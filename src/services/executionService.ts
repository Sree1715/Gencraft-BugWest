import { Question, TestCase, TestCaseResult, ExecutionResult } from '../types';

export class ExecutionService {
  /**
   * Run code against visible test cases only (For the "Run" button)
   */
  public static runVisibleTests(
    question: Question,
    code: string
  ): ExecutionResult {
    const startTime = performance.now();
    const visibleTests = question.visibleTestCases;

    const { syntaxError, isFixed } = this.analyzeAndExecute(question, code);

    const testCaseResults: TestCaseResult[] = visibleTests.map((tc) => {
      if (syntaxError) {
        return {
          id: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: '',
          passed: false,
          isHidden: false,
          error: syntaxError
        };
      }

      const passed = isFixed;
      const actualOutput = passed
        ? tc.expectedOutput
        : this.simulateBuggyOutput(question, code, tc.expectedOutput);

      return {
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput,
        passed,
        isHidden: false
      };
    });

    const passedCount = testCaseResults.filter((r) => r.passed).length;
    const executionTimeMs = Math.round(performance.now() - startTime + Math.random() * 15 + 8);

    let stdout = '';
    let stderr = '';
    if (syntaxError) {
      stderr = syntaxError;
    } else if (isFixed) {
      stdout = visibleTests[0]?.expectedOutput || question.expectedOutput;
    } else {
      stdout = this.simulateBuggyOutput(question, code, question.expectedOutput);
      stderr = this.generateDiagnosticWarning(question, code);
    }

    return {
      success: !syntaxError && passedCount === visibleTests.length,
      stdout,
      stderr,
      exitCode: syntaxError ? 1 : 0,
      executionTimeMs,
      testCaseResults,
      passedTests: passedCount,
      totalTests: visibleTests.length,
      marksEarned: 0,
      maxMarks: question.marks
    };
  }

  /**
   * Grade code against visible AND hidden test cases (For the "Submit" button)
   * Sanitizes hidden test cases before returning
   */
  public static evaluateFullSubmission(
    question: Question,
    code: string
  ): ExecutionResult {
    return this.gradeSubmission(question, code);
  }

  public static gradeSubmission(
    question: Question,
    code: string
  ): ExecutionResult {
    const startTime = performance.now();
    const allTests = [...question.visibleTestCases, ...question.hiddenTestCases];

    const { syntaxError, isFixed } = this.analyzeAndExecute(question, code);

    const testCaseResults: TestCaseResult[] = allTests.map((tc) => {
      const isHidden = !!tc.isHidden;
      if (syntaxError) {
        return {
          id: tc.id,
          input: isHidden ? '[HIDDEN INPUT]' : tc.input,
          expectedOutput: isHidden ? '[HIDDEN EXPECTED OUTPUT]' : tc.expectedOutput,
          actualOutput: isHidden ? '[HIDDEN ACTUAL OUTPUT]' : '',
          passed: false,
          isHidden,
          error: syntaxError
        };
      }

      const passed = isFixed;
      const actualOutput = passed
        ? tc.expectedOutput
        : this.simulateBuggyOutput(question, code, tc.expectedOutput);

      return {
        id: tc.id,
        input: isHidden ? '[HIDDEN INPUT]' : tc.input,
        expectedOutput: isHidden ? '[HIDDEN EXPECTED OUTPUT]' : tc.expectedOutput,
        actualOutput: isHidden ? (passed ? '[HIDDEN MATCH]' : '[HIDDEN MISMATCH]') : actualOutput,
        passed,
        isHidden
      };
    });

    const passedCount = testCaseResults.filter((r) => r.passed).length;
    const totalCount = allTests.length;
    const executionTimeMs = Math.round(performance.now() - startTime + Math.random() * 20 + 12);
    const marksEarned = Math.round((passedCount / totalCount) * question.marks);

    let stdout = '';
    let stderr = '';
    if (syntaxError) {
      stderr = syntaxError;
    } else if (isFixed) {
      stdout = question.expectedOutput;
    } else {
      stdout = this.simulateBuggyOutput(question, code, question.expectedOutput);
      stderr = this.generateDiagnosticWarning(question, code);
    }

    return {
      success: !syntaxError && passedCount === totalCount,
      stdout,
      stderr,
      exitCode: syntaxError ? 1 : 0,
      executionTimeMs,
      testCaseResults,
      passedTests: passedCount,
      totalTests: totalCount,
      marksEarned,
      maxMarks: question.marks
    };
  }

  /**
   * Internal syntax and logic evaluator for C and Python
   */
  private static analyzeAndExecute(
    question: Question,
    code: string
  ): { syntaxError: string | null; isFixed: boolean } {
    const cleanCode = code.trim();
    if (!cleanCode) {
      return { syntaxError: 'Error: Empty source code provided.', isFixed: false };
    }

    if (question.language === 'c') {
      return this.analyzeC(question, cleanCode);
    } else {
      return this.analyzePython(question, cleanCode);
    }
  }

  private static analyzeC(
    question: Question,
    code: string
  ): { syntaxError: string | null; isFixed: boolean } {
    // 1. Bracket and parenthesis balance
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      return {
        syntaxError: `gcc: error: expected '}' at end of input (found ${openBraces} '{' and ${closeBraces} '}')`,
        isFixed: false
      };
    }

    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      return {
        syntaxError: `gcc: error: mismatched parentheses in statement`,
        isFixed: false
      };
    }

    // 2. Check main function presence
    if (!code.includes('main') && !code.includes('int main')) {
      return {
        syntaxError: `undefined reference to \`main'\ncollect2: error: ld returned 1 exit status`,
        isFixed: false
      };
    }

    // 3. Question-specific bug fix checks
    const normalized = code.replace(/\s+/g, ' ');

    switch (question.id) {
      case 'R1-Q01': {
        // Fix: int sum = 0 and semicolon after return 0;
        const hasInitializedSum = /int\s+sum\s*=\s*0\s*;/.test(code);
        const hasReturnSemi = /return\s+0\s*;/.test(code);
        if (!hasReturnSemi) {
          return { syntaxError: "gcc: error: expected ';' before '}' token at return 0", isFixed: false };
        }
        return { syntaxError: null, isFixed: hasInitializedSum && hasReturnSemi };
      }

      case 'R1-Q03': {
        // Fix: i < 5 or i <= 4 instead of i <= 5
        const hasCorrectCondition = /i\s*<\s*5/.test(code) || /i\s*<=\s*4/.test(code);
        return { syntaxError: null, isFixed: hasCorrectCondition };
      }

      case 'R1-Q05': {
        // Fix: float casting in average (float) or 3.0f or 3.0
        const hasFloatDivision = /\/\s*3\.0/i.test(code) || /\(float\)/.test(code) || /\(double\)/.test(code);
        return { syntaxError: null, isFixed: hasFloatDivision };
      }

      case 'R1-Q07': {
        // Fix: Braces around if-else to prevent dangling else
        const hasBraces = /if\s*\(score\s*>=\s*90\)\s*\{/.test(code);
        return { syntaxError: null, isFixed: hasBraces };
      }

      case 'R1-Q09': {
        // Fix: update_val(&num) with address-of operator
        const hasAddressOf = /update_val\s*\(\s*&num\s*\)/.test(code);
        return { syntaxError: null, isFixed: hasAddressOf };
      }

      case 'R1-Q11': {
        // Fix: while loop decrement count-- or count -= 1
        const hasDecrement = /count\s*--/.test(code) || /count\s*-=\s*1/.test(code) || /--\s*count/.test(code);
        return { syntaxError: null, isFixed: hasDecrement };
      }

      case 'R1-Q13': {
        // Fix: loop to n / 2 or i < 2
        const hasMidpoint = /i\s*<\s*n\s*\/\s*2/.test(code) || /i\s*<\s*2/.test(code);
        return { syntaxError: null, isFixed: hasMidpoint };
      }

      case 'R1-Q15': {
        // Fix: null terminator dest[3] = '\0' or 0
        const hasNullTerm = /dest\[3\]\s*=\s*('\\0'|0)/.test(code);
        return { syntaxError: null, isFixed: hasNullTerm };
      }

      case 'R1-Q17': {
        // Fix: parenthesis around bitwise op ((val & 1) == 0)
        const hasParentheses = /\(\s*(\(?val\s*&\s*1\)?)\s*==\s*0\s*\)/.test(code) || /\(\s*val\s*&\s*1\s*\)/.test(code);
        return { syntaxError: null, isFixed: hasParentheses };
      }

      case 'R1-Q19': {
        // Fix: break statements in switch cases
        const breakCount = (code.match(/break\s*;/g) || []).length;
        return { syntaxError: null, isFixed: breakCount >= 2 };
      }

      case 'R2-Q01': {
        // Fix: swap(int *a, int *b) and swap(&x, &y)
        const hasPointerParams = /swap\s*\(\s*int\s*\*\s*[a-z]/i.test(code);
        const hasCallAddress = /swap\s*\(\s*&x\s*,\s*&y\s*\)/.test(code);
        return { syntaxError: null, isFixed: hasPointerParams && hasCallAddress };
      }

      case 'R2-Q03': {
        // Fix: Player *p = malloc(sizeof(Player)) and free(p)
        const hasMalloc = /malloc\s*\(/.test(code);
        return { syntaxError: null, isFixed: hasMalloc };
      }

      case 'R2-Q05': {
        // Fix: sizeof(double) instead of sizeof(int)
        const hasSizeofDouble = /sizeof\s*\(\s*double\s*\)/.test(code);
        return { syntaxError: null, isFixed: hasSizeofDouble };
      }

      case 'R2-Q07': {
        // Fix: second->next = first->next; first->next = second;
        const correctOrder = code.indexOf('second->next') < code.indexOf('first->next = second');
        const hasSecondNext = /second\s*->\s*next\s*=\s*first\s*->\s*next/.test(code);
        return { syntaxError: null, isFixed: hasSecondNext && correctOrder };
      }

      case 'R2-Q09': {
        // Fix: char str[] = "HELLO"; instead of char *str = "HELLO";
        const hasArrayDecl = /char\s+str\s*\[\s*\]\s*=/.test(code);
        return { syntaxError: null, isFixed: hasArrayDecl };
      }

      case 'R3-Q01': {
        // Fix: Don't free ret in pop(), let caller free it
        const popOnlyFreesTemp = !/free\s*\(\s*temp\s*->\s*text\s*\)/.test(code) && /free\s*\(\s*temp\s*\)/.test(code);
        return { syntaxError: null, isFixed: popOnlyFreesTemp };
      }

      case 'R3-Q03': {
        // Fix: <= pivot in partition to handle duplicates
        const hasLessEqual = /arr\[j\]\s*<=\s*pivot/.test(code);
        return { syntaxError: null, isFixed: hasLessEqual };
      }

      case 'R3-Q05': {
        // Fix: Handle head == tail edge case in LRU eviction
        const handlesSingleNode = /cache->head\s*==\s*cache->tail/.test(code) || /oldTail->prev\s*==\s*NULL/.test(code) || /if\s*\(\s*cache->tail\s*\)/.test(code);
        return { syntaxError: null, isFixed: handlesSingleNode };
      }

      default: {
        // Generic fallback for custom organizer-created C questions
        const matchesSolution = this.similarityCheck(code, question.correctSolution);
        const changedFromBug = code.trim() !== question.buggyCode.trim();
        return { syntaxError: null, isFixed: matchesSolution > 0.65 || (changedFromBug && matchesSolution > 0.45) };
      }
    }
  }

  private static analyzePython(
    question: Question,
    code: string
  ): { syntaxError: string | null; isFixed: boolean } {
    // 1. Check indentation errors
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('#') || !line.trim()) continue;
      // Check if line following def has no indentation
      if (i > 0 && lines[i - 1].trim().endsWith(':') && line.length > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
        return {
          syntaxError: `IndentationError: expected an indented block after '${lines[i - 1].trim()}' on line ${i + 1}`,
          isFixed: false
        };
      }
    }

    // 2. Question-specific bug fix checks
    switch (question.id) {
      case 'R1-Q02': {
        // Fix: items[:3] and correct indentation
        const hasSlice3 = /items\[:3\]/.test(code) || /items\[0:3\]/.test(code);
        return { syntaxError: null, isFixed: hasSlice3 };
      }

      case 'R1-Q04': {
        // Fix: capitalize without item assignment (word[0].upper() + word[1:] or word.capitalize())
        const noItemAssignment = !/word\[0\]\s*=/.test(code);
        const hasCapitalize = /word\.capitalize\(\)/.test(code) || /word\[0\]\.upper\(\)\s*\+\s*word\[1:\]/.test(code);
        return { syntaxError: null, isFixed: noItemAssignment && hasCapitalize };
      }

      case 'R1-Q06': {
        // Fix: roster=None default argument
        const hasNoneDefault = /roster\s*=\s*None/.test(code);
        return { syntaxError: null, isFixed: hasNoneDefault };
      }

      case 'R1-Q08': {
        // Fix: global total_submissions
        const hasGlobal = /global\s+total_submissions/.test(code);
        return { syntaxError: null, isFixed: hasGlobal };
      }

      case 'R1-Q10': {
        // Fix: scores.get(user_id, 0) or if key in dict
        const hasGetOrDefault = /scores\.get\s*\(\s*user_id\s*,\s*0\s*\)/.test(code) || /user_id\s+in\s+scores/.test(code);
        return { syntaxError: null, isFixed: hasGetOrDefault };
      }

      case 'R1-Q12': {
        // Fix: int(val1) + int(val2)
        const hasIntCast = /int\s*\(\s*val1\s*\)\s*\+\s*int\s*\(\s*val2\s*\)/.test(code);
        return { syntaxError: null, isFixed: hasIntCast };
      }

      case 'R1-Q14': {
        // Fix: prime check loop checks up to sqrt or doesn't return early True
        const noEarlyTrue = !/if\s+n\s*%\s*i\s*!=\s*0:\s*return\s+True/.test(code.replace(/\s+/g, ' '));
        const hasSqrtOrAllCheck = /int\(n\*\*0\.5\)/.test(code) || /range\(2,\s*int\(/.test(code) || /range\(2,\s*n\)/.test(code);
        return { syntaxError: null, isFixed: noEarlyTrue && hasSqrtOrAllCheck };
      }

      case 'R1-Q16': {
        // Fix: list comprehension or copy iteration [x for x in nums if x % 2 != 0]
        const hasListComp = /\[\s*[a-z]\s+for\s+[a-z]\s+in\s+nums\s+if/i.test(code);
        return { syntaxError: null, isFixed: hasListComp };
      }

      case 'R1-Q18': {
        // Fix: Base case in factorial if n <= 1: return 1
        const hasBaseCase = /if\s+n\s*(<=|<|==)\s*1\s*:\s*return\s+1/.test(code.replace(/\s+/g, ' '));
        return { syntaxError: null, isFixed: hasBaseCase };
      }

      case 'R1-Q20': {
        // Fix: using list result = [] instead of tuple ()
        const usesList = /result\s*=\s*\[\s*\]/.test(code);
        return { syntaxError: null, isFixed: usesList };
      }

      case 'R2-Q02': {
        // Fix: implement __eq__ and __hash__
        const hasEq = /def\s+__eq__/.test(code);
        const hasHash = /def\s+__hash__/.test(code);
        return { syntaxError: null, isFixed: hasEq && hasHash };
      }

      case 'R2-Q04': {
        // Fix: list comprehension for 2D matrix
        const hasRowComp = /\[\s*\[0\]\s*\*\s*3\s+for\s+_?\s+in\s+range\(3\)\s*\]/.test(code.replace(/\s+/g, ' '));
        return { syntaxError: null, isFixed: hasRowComp };
      }

      case 'R2-Q06': {
        // Fix: raise InvalidTokenError
        const raisesCustom = /raise\s+InvalidTokenError/.test(code);
        return { syntaxError: null, isFixed: raisesCustom };
      }

      case 'R2-Q08': {
        // Fix: low = mid + 1
        const hasLowMidPlusOne = /low\s*=\s*mid\s*\+\s*1/.test(code);
        return { syntaxError: null, isFixed: hasLowMidPlusOne };
      }

      case 'R2-Q10': {
        // Fix: convert generator to list: list(generate_multiples(...))
        const convertsToList = /list\s*\(\s*generate_multiples/.test(code);
        return { syntaxError: null, isFixed: convertsToList };
      }

      case 'R3-Q02': {
        // Fix: use super().process() in diamond inheritance
        const hasSuperCalls = /super\(\)\.process\(\)/.test(code);
        return { syntaxError: null, isFixed: hasSuperCalls };
      }

      case 'R3-Q04': {
        // Fix: proper cache key with tuple or proper dynamic programming
        const fixesKeyOrInfinity = /key\s*=\s*\(tuple\(coins\)/.test(code) || /float\('inf'\)/.test(code);
        return { syntaxError: null, isFixed: fixesKeyOrInfinity };
      }

      default: {
        // Generic fallback for custom organizer-created Python questions
        const matchesSolution = this.similarityCheck(code, question.correctSolution);
        const changedFromBug = code.trim() !== question.buggyCode.trim();
        return { syntaxError: null, isFixed: matchesSolution > 0.65 || (changedFromBug && matchesSolution > 0.45) };
      }
    }
  }

  private static simulateBuggyOutput(
    question: Question,
    code: string,
    expectedOutput: string
  ): string {
    // Return realistic faulty outputs based on question
    switch (question.id) {
      case 'R1-Q01': return '32767'; // uninitialized stack garbage
      case 'R1-Q02': return 'Apples, Bananas';
      case 'R1-Q03': return '2 4 6 8 10 32764'; // buffer over-read
      case 'R1-Q04': return "TypeError: 'str' object does not support item assignment";
      case 'R1-Q05': return '8.00 (or truncated 8)';
      case 'R1-Q06': return "['Alice', 'Bob']"; // accumulator state leak
      case 'R1-Q07': return 'Review';
      case 'R1-Q08': return 'UnboundLocalError: local variable referenced before assignment';
      case 'R1-Q09': return '0';
      case 'R1-Q10': return "KeyError: 'GC003'";
      case 'R1-Q11': return '[Execution timed out: infinite loop detected]';
      case 'R1-Q12': return '2575';
      case 'R1-Q13': return '1 2 3 4';
      case 'R1-Q14': return 'True';
      case 'R1-Q15': return 'BUG@\\x7f';
      case 'R1-Q16': return '[1, 4, 5]';
      case 'R1-Q17': return 'Even';
      case 'R1-Q18': return 'RecursionError: maximum recursion depth exceeded';
      case 'R1-Q19': return 'ActivePausedUnknown';
      case 'R1-Q20': return "AttributeError: 'tuple' object has no attribute 'append'";
      case 'R2-Q01': return 'x=10, y=20';
      case 'R2-Q02': return '2';
      case 'R2-Q03': return 'Segmentation fault (core dumped)';
      case 'R2-Q04': return '[1, 0, 0, 1, 0, 0, 1, 0, 0]';
      case 'R2-Q05': return '0.0';
      case 'R2-Q06': return 'None';
      case 'R2-Q07': return '10 15 15';
      case 'R2-Q08': return '[Execution timed out: binary search loop]';
      case 'R2-Q09': return 'Segmentation fault (core dumped)';
      case 'R2-Q10': return 'ValueError: min() arg is an empty sequence';
      case 'R3-Q01': return 'double free or corruption (out)\nAborted (core dumped)';
      case 'R3-Q02': return 'D->B->A';
      case 'R3-Q03': return 'Segmentation fault (core dumped)';
      case 'R3-Q04': return '0';
      case 'R3-Q05': return 'Segmentation fault (core dumped)';
      default: return `Mismatch output. Expected: ${expectedOutput}`;
    }
  }

  private static generateDiagnosticWarning(question: Question, code: string): string {
    if (question.language === 'c') {
      return `gcc: warning: runtime evaluation failed. Bug remains active: ${question.bugDescription}`;
    }
    return `python: AssertionError: Test assertion failed. Target output not met.`;
  }

  private static similarityCheck(s1: string, s2: string): number {
    const set1 = new Set(s1.split(/\s+/));
    const set2 = new Set(s2.split(/\s+/));
    let intersection = 0;
    set1.forEach((token) => {
      if (set2.has(token)) intersection++;
    });
    return (2 * intersection) / (set1.size + set2.size);
  }
}
