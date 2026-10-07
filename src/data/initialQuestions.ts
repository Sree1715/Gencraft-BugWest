import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // ROUND 1: BASIC DEBUGGING (20 QUESTIONS)
  // ==========================================
  {
    id: 'R1-Q01',
    round: 1,
    language: 'c',
    title: 'Array Sum Uninitialized Accumulator',
    description: 'Calculate the sum of all elements in an integer array of size 5. The provided code gives unpredictable garbage values.',
    bugDescription: 'Variable `sum` is not initialized to 0, leading to undefined behavior with residual stack garbage values, and missing semicolon after return.',
    buggyCode: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int sum; // BUG: Uninitialized accumulator
    
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    
    printf("%d\\n", sum);
    return 0 // BUG: Missing semicolon
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int sum = 0;
    
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    
    printf("%d\\n", sum);
    return 0;
}`,
    expectedOutput: '150',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-01-1', input: '', expectedOutput: '150', description: 'Standard 5 element array sum' },
      { id: 'tc-r1-01-2', input: '', expectedOutput: '150', description: 'Zero baseline accumulator test' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-01-h1', input: '', expectedOutput: '150', isHidden: true, description: 'Stack isolation memory check' }
    ],
    isPublished: true,
    topics: ['Arrays', 'Variable Initialization', 'Syntax']
  },
  {
    id: 'R1-Q02',
    round: 1,
    language: 'python',
    title: 'List Slicing Off-By-One & Indentation',
    description: 'Extract the first 3 items from a grocery list and print them separated by commas. The program crashes with an IndentationError and fails to slice properly.',
    bugDescription: 'Off-by-one slice index `[:2]` only yields 2 elements instead of 3, plus broken indentation in function body.',
    buggyCode: `def get_top_items(items):
# BUG: Inconsistent indentation
items_slice = items[:2]
    return ", ".join(items_slice)

grocery = ["Apples", "Bananas", "Carrots", "Dates", "Eggs"]
print(get_top_items(grocery))`,
    correctSolution: `def get_top_items(items):
    items_slice = items[:3]
    return ", ".join(items_slice)

grocery = ["Apples", "Bananas", "Carrots", "Dates", "Eggs"]
print(get_top_items(grocery))`,
    expectedOutput: 'Apples, Bananas, Carrots',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-02-1', input: '', expectedOutput: 'Apples, Bananas, Carrots', description: 'Extract first 3 elements' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-02-h1', input: '', expectedOutput: 'Apples, Bananas, Carrots', isHidden: true, description: 'Slice boundary assertion' }
    ],
    isPublished: true,
    topics: ['Lists', 'Slicing', 'Indentation']
  },
  {
    id: 'R1-Q03',
    round: 1,
    language: 'c',
    title: 'For Loop Index Out of Bounds',
    description: 'Print all numbers from index 0 to 4 in an array. Currently, the loop reads past the array boundary causing memory corruption.',
    bugDescription: 'Loop condition uses `i <= 5` instead of `i < 5`, accessing arr[5] which is out of bounds.',
    buggyCode: `#include <stdio.h>

int main() {
    int nums[5] = {2, 4, 6, 8, 10};
    
    // BUG: Loop condition causes buffer over-read
    for (int i = 0; i <= 5; i++) {
        printf("%d ", nums[i]);
    }
    printf("\\n");
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int nums[5] = {2, 4, 6, 8, 10};
    
    for (int i = 0; i < 5; i++) {
        printf("%d ", nums[i]);
    }
    printf("\\n");
    return 0;
}`,
    expectedOutput: '2 4 6 8 10',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-03-1', input: '', expectedOutput: '2 4 6 8 10', description: 'Sequential element printing' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-03-h1', input: '', expectedOutput: '2 4 6 8 10', isHidden: true, description: 'Memory bounds validation' }
    ],
    isPublished: true,
    topics: ['Arrays', 'For Loops', 'Bounds Checking']
  },
  {
    id: 'R1-Q04',
    round: 1,
    language: 'python',
    title: 'String Immutability Item Assignment',
    description: 'Replace the first character of a lowercase word with uppercase. Python throws a TypeError because strings cannot be mutated directly.',
    bugDescription: 'Attempting `word[0] = word[0].upper()` violates Python string immutability.',
    buggyCode: `def capitalize_first(word):
    # BUG: Strings are immutable in Python
    word[0] = word[0].upper()
    return word

text = "gencraft"
print(capitalize_first(text))`,
    correctSolution: `def capitalize_first(word):
    if not word:
        return word
    return word[0].upper() + word[1:]

text = "gencraft"
print(capitalize_first(text))`,
    expectedOutput: 'Gencraft',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-04-1', input: '', expectedOutput: 'Gencraft', description: 'String reconstruction capitalization' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-04-h1', input: '', expectedOutput: 'Gencraft', isHidden: true, description: 'Immutability preservation check' }
    ],
    isPublished: true,
    topics: ['Strings', 'Immutability', 'Type System']
  },
  {
    id: 'R1-Q05',
    round: 1,
    language: 'c',
    title: 'Integer Division Truncation in Average',
    description: 'Calculate the floating-point average of three integers (7, 8, 9). The current code truncates precision and prints 0.00 or an integer.',
    bugDescription: 'Integer division `(a + b + c) / 3` truncates decimals before assigning to float.',
    buggyCode: `#include <stdio.h>

int main() {
    int a = 7, b = 8, c = 9;
    // BUG: Integer division truncates before float conversion
    float avg = (a + b + c) / 3;
    printf("%.2f\\n", avg);
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int a = 7, b = 8, c = 9;
    float avg = (float)(a + b + c) / 3.0f;
    printf("%.2f\\n", avg);
    return 0;
}`,
    expectedOutput: '8.00',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-05-1', input: '', expectedOutput: '8.00', description: 'Float precision division' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-05-h1', input: '', expectedOutput: '8.00', isHidden: true, description: 'Explicit casting check' }
    ],
    isPublished: true,
    topics: ['Type Casting', 'Arithmetic', 'Data Types']
  },
  {
    id: 'R1-Q06',
    round: 1,
    language: 'python',
    title: 'Mutable Default Argument Trap',
    description: 'Add an item to a student roster. Subsequent calls with default parameters accumulate across function calls unexpectedly.',
    bugDescription: 'Default parameter `roster=[]` is evaluated once at function definition time, leaking state between calls.',
    buggyCode: `# BUG: Mutable default argument retains state across calls
def register_student(name, roster=[]):
    roster.append(name)
    return roster

class_a = register_student("Alice")
class_b = register_student("Bob")
print(class_b)`,
    correctSolution: `def register_student(name, roster=None):
    if roster is None:
        roster = []
    roster.append(name)
    return roster

class_a = register_student("Alice")
class_b = register_student("Bob")
print(class_b)`,
    expectedOutput: "['Bob']",
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-06-1', input: '', expectedOutput: "['Bob']", description: 'Independent function invocation' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-06-h1', input: '', expectedOutput: "['Bob']", isHidden: true, description: 'Default argument state isolation' }
    ],
    isPublished: true,
    topics: ['Functions', 'Mutable Defaults', 'Scope']
  },
  {
    id: 'R1-Q07',
    round: 1,
    language: 'c',
    title: 'Dangling Else / Missing Braces in Grade Logic',
    description: 'Assign letter grade "A" if score >= 90 and extra credit is valid. Otherwise, assign "Review". The else branch associates with the wrong if condition.',
    bugDescription: 'Dangling else problem: the else binds to the inner `if (extraCredit)` instead of the outer `if (score >= 90)`.',
    buggyCode: `#include <stdio.h>

int main() {
    int score = 85;
    int extraCredit = 0;
    
    // BUG: Missing braces causes dangling else binding
    if (score >= 90)
        if (extraCredit)
            printf("A+\\n");
    else
        printf("Review\\n");
        
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int score = 85;
    int extraCredit = 0;
    
    if (score >= 90) {
        if (extraCredit) {
            printf("A+\\n");
        }
    } else {
        printf("Review\\n");
    }
        
    return 0;
}`,
    expectedOutput: 'Review',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-07-1', input: '', expectedOutput: 'Review', description: 'Score below threshold branch' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-07-h1', input: '', expectedOutput: 'Review', isHidden: true, description: 'Explicit control flow braces' }
    ],
    isPublished: true,
    topics: ['If-Else', 'Control Flow', 'Bracing']
  },
  {
    id: 'R1-Q08',
    round: 1,
    language: 'python',
    title: 'Variable Scope Shadowing in Counter',
    description: 'Increment a global submission counter when processing candidate submissions. Python raises UnboundLocalError.',
    bugDescription: 'Assigning to `count` inside function shadows global variable without `global` keyword.',
    buggyCode: `total_submissions = 10

def record_submission():
    # BUG: UnboundLocalError: local variable referenced before assignment
    total_submissions = total_submissions + 1
    return total_submissions

print(record_submission())`,
    correctSolution: `total_submissions = 10

def record_submission():
    global total_submissions
    total_submissions = total_submissions + 1
    return total_submissions

print(record_submission())`,
    expectedOutput: '11',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-08-1', input: '', expectedOutput: '11', description: 'Global counter mutation' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-08-h1', input: '', expectedOutput: '11', isHidden: true, description: 'Global scope access verification' }
    ],
    isPublished: true,
    topics: ['Scope', 'Global Keyword', 'Functions']
  },
  {
    id: 'R1-Q09',
    round: 1,
    language: 'c',
    title: 'Missing Address-Of (&) in Scanf Pointer Simulation',
    description: 'Read an integer value into a variable via a mock function that uses a pointer. The current implementation passes the integer value instead of its memory address.',
    bugDescription: 'Function expects pointer `int *val`, but caller passes `x` instead of `&x`.',
    buggyCode: `#include <stdio.h>

void update_val(int *target) {
    *target = 42;
}

int main() {
    int num = 0;
    // BUG: Passing variable directly instead of pointer address &num
    update_val(num);
    printf("%d\\n", num);
    return 0;
}`,
    correctSolution: `#include <stdio.h>

void update_val(int *target) {
    *target = 42;
}

int main() {
    int num = 0;
    update_val(&num);
    printf("%d\\n", num);
    return 0;
}`,
    expectedOutput: '42',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-09-1', input: '', expectedOutput: '42', description: 'Address-of operator resolution' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-09-h1', input: '', expectedOutput: '42', isHidden: true, description: 'Pass by reference memory check' }
    ],
    isPublished: true,
    topics: ['Pointers', 'Function Parameters', 'Address-Of']
  },
  {
    id: 'R1-Q10',
    round: 1,
    language: 'python',
    title: 'Dictionary KeyError on Missing Key',
    description: 'Retrieve a participant score from a dictionary. If the participant ID is not found, return 0 instead of crashing with a KeyError.',
    bugDescription: 'Direct key subscript `scores[user_id]` throws KeyError on nonexistent keys instead of using `.get(key, 0)`.',
    buggyCode: `def get_participant_score(scores, user_id):
    # BUG: Unchecked direct index causes KeyError
    return scores[user_id]

results = {"GC001": 85, "GC002": 92}
print(get_participant_score(results, "GC003"))`,
    correctSolution: `def get_participant_score(scores, user_id):
    return scores.get(user_id, 0)

results = {"GC001": 85, "GC002": 92}
print(get_participant_score(results, "GC003"))`,
    expectedOutput: '0',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-10-1', input: '', expectedOutput: '0', description: 'Fallback on missing dict key' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-10-h1', input: '', expectedOutput: '0', isHidden: true, description: 'Default dictionary handling' }
    ],
    isPublished: true,
    topics: ['Dictionaries', 'KeyError', 'Error Handling']
  },
  {
    id: 'R1-Q11',
    round: 1,
    language: 'c',
    title: 'While Loop Infinite Iteration',
    description: 'Count down from 5 to 1 and print each number. The loop never terminates because the decrement step is missing inside the block.',
    bugDescription: 'Variable `count` is never decremented inside while body, creating an infinite loop.',
    buggyCode: `#include <stdio.h>

int main() {
    int count = 5;
    
    while (count > 0) {
        printf("%d ", count);
        // BUG: Missing count-- causes infinite loop
    }
    printf("\\n");
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int count = 5;
    
    while (count > 0) {
        printf("%d ", count);
        count--;
    }
    printf("\\n");
    return 0;
}`,
    expectedOutput: '5 4 3 2 1',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-11-1', input: '', expectedOutput: '5 4 3 2 1', description: 'Countdown sequence termination' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-11-h1', input: '', expectedOutput: '5 4 3 2 1', isHidden: true, description: 'Loop step execution verification' }
    ],
    isPublished: true,
    topics: ['While Loops', 'Loop Control', 'Termination']
  },
  {
    id: 'R1-Q12',
    round: 1,
    language: 'python',
    title: 'Type Mismatch String Concatenation vs Integer Sum',
    description: 'Add two numbers provided as string inputs ("25" and "75"). The current code concatenates them into "2575" instead of producing the mathematical sum 100.',
    bugDescription: 'String values are added directly with `+` instead of casting to `int()`.',
    buggyCode: `def add_values(val1, val2):
    # BUG: Concatenating strings instead of summing numeric values
    return val1 + val2

a = "25"
b = "75"
print(add_values(a, b))`,
    correctSolution: `def add_values(val1, val2):
    return int(val1) + int(val2)

a = "25"
b = "75"
print(add_values(a, b))`,
    expectedOutput: '100',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-12-1', input: '', expectedOutput: '100', description: 'Parse string digits to integer sum' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-12-h1', input: '', expectedOutput: '100', isHidden: true, description: 'Type conversion safety check' }
    ],
    isPublished: true,
    topics: ['Type Casting', 'Strings', 'Arithmetic']
  },
  {
    id: 'R1-Q13',
    round: 1,
    language: 'c',
    title: 'Array In-Place Reversal Over-Swapping',
    description: 'Reverse an array of 4 integers in place. Currently the loop traverses the entire array length, swapping elements twice and reverting to the original order.',
    bugDescription: 'Reversal loop iterates until `i < n` instead of `i < n / 2`, undoing all swaps.',
    buggyCode: `#include <stdio.h>

int main() {
    int arr[4] = {1, 2, 3, 4};
    int n = 4;
    
    // BUG: Iterating to n swaps elements back to original positions
    for (int i = 0; i < n; i++) {
        int temp = arr[i];
        arr[i] = arr[n - 1 - i];
        arr[n - 1 - i] = temp;
    }
    
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int arr[4] = {1, 2, 3, 4};
    int n = 4;
    
    for (int i = 0; i < n / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[n - 1 - i];
        arr[n - 1 - i] = temp;
    }
    
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
    expectedOutput: '4 3 2 1',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-13-1', input: '', expectedOutput: '4 3 2 1', description: 'In-place array reversal' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-13-h1', input: '', expectedOutput: '4 3 2 1', isHidden: true, description: 'Midpoint swap termination' }
    ],
    isPublished: true,
    topics: ['Arrays', 'Algorithms', 'Logic Errors']
  },
  {
    id: 'R1-Q14',
    round: 1,
    language: 'python',
    title: 'Prime Number Checker Missing Composite Early Break',
    description: 'Check if number 9 is prime. The current code misidentifies 9 as prime because it checks only oddness or fails to break on composite divisors.',
    bugDescription: 'Loop fails to reject composite numbers because return statement is misplaced inside loop or early return logic is flawed.',
    buggyCode: `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        # BUG: Returns True on first non-divisor instead of checking all
        if n % i != 0:
            return True
        else:
            return False

print(is_prime(9))`,
    correctSolution: `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

print(is_prime(9))`,
    expectedOutput: 'False',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-14-1', input: '', expectedOutput: 'False', description: 'Composite number 9 detection' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-14-h1', input: '', expectedOutput: 'False', isHidden: true, description: 'Square root factor verification' }
    ],
    isPublished: true,
    topics: ['Loops', 'Prime Check', 'Control Flow']
  },
  {
    id: 'R1-Q15',
    round: 1,
    language: 'c',
    title: 'Missing Null Terminator in Character Array',
    description: 'Manually copy characters "BUG" into a destination char array and print as a string with `%s`. Output contains random garbage characters at the end.',
    bugDescription: 'Destination string is not null-terminated with `\\0`, causing `printf("%s")` to run over memory.',
    buggyCode: `#include <stdio.h>

int main() {
    char src[] = "BUG";
    char dest[4];
    
    dest[0] = src[0];
    dest[1] = src[1];
    dest[2] = src[2];
    // BUG: dest[3] is not set to '\\0' null terminator
    
    printf("%s\\n", dest);
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    char src[] = "BUG";
    char dest[4];
    
    dest[0] = src[0];
    dest[1] = src[1];
    dest[2] = src[2];
    dest[3] = '\\0';
    
    printf("%s\\n", dest);
    return 0;
}`,
    expectedOutput: 'BUG',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-15-1', input: '', expectedOutput: 'BUG', description: 'String termination safety' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-15-h1', input: '', expectedOutput: 'BUG', isHidden: true, description: 'Null-byte buffer sanity' }
    ],
    isPublished: true,
    topics: ['Strings', 'Memory Bounds', 'C Basics']
  },
  {
    id: 'R1-Q16',
    round: 1,
    language: 'python',
    title: 'Modifying List While Iterating Over It',
    description: 'Remove all even numbers from a list of integers `[1, 2, 4, 5, 6]`. The code skips consecutive even numbers due to index shifting during deletion.',
    bugDescription: 'Calling `nums.remove(x)` inside `for x in nums` shifts subsequent list elements, causing loop to skip index.',
    buggyCode: `def remove_evens(nums):
    # BUG: Mutating list during iteration skips elements
    for x in nums:
        if x % 2 == 0:
            nums.remove(x)
    return nums

data = [1, 2, 4, 5, 6]
print(remove_evens(data))`,
    correctSolution: `def remove_evens(nums):
    return [x for x in nums if x % 2 != 0]

data = [1, 2, 4, 5, 6]
print(remove_evens(data))`,
    expectedOutput: '[1, 5]',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-16-1', input: '', expectedOutput: '[1, 5]', description: 'Filter consecutive evens properly' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-16-h1', input: '', expectedOutput: '[1, 5]', isHidden: true, description: 'List comprehension purity check' }
    ],
    isPublished: true,
    topics: ['Lists', 'Iteration', 'List Comprehensions']
  },
  {
    id: 'R1-Q17',
    round: 1,
    language: 'c',
    title: 'Operator Precedence in Bitwise vs Comparison',
    description: 'Check if integer 5 has its lowest bit set (is odd). In C, `==` has higher precedence than `&`, causing unexpected zero evaluation.',
    bugDescription: '`if (num & 1 == 1)` evaluates `(1 == 1)` first, yielding `num & 1` which behaves differently with other masks or parentheses.',
    buggyCode: `#include <stdio.h>

int main() {
    int val = 5;
    // BUG: Missing parentheses around bitwise operation
    if (val & 1 == 0) {
        printf("Even\\n");
    } else {
        printf("Odd\\n");
    }
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int val = 5;
    if ((val & 1) == 0) {
        printf("Even\\n");
    } else {
        printf("Odd\\n");
    }
    return 0;
}`,
    expectedOutput: 'Odd',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-17-1', input: '', expectedOutput: 'Odd', description: 'Bitwise mask precedence check' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-17-h1', input: '', expectedOutput: 'Odd', isHidden: true, description: 'Operator precedence bracket test' }
    ],
    isPublished: true,
    topics: ['Bitwise Operators', 'Precedence', 'Conditions']
  },
  {
    id: 'R1-Q18',
    round: 1,
    language: 'python',
    title: 'Factorial Recursion Missing Base Case',
    description: 'Compute factorial of 4. The function triggers RecursionError / Maximum recursion depth exceeded because base condition is missing or wrong.',
    bugDescription: 'Base case `if n == 0` is missing, causing infinite recursion into negative numbers.',
    buggyCode: `def factorial(n):
    # BUG: Missing base case triggers infinite recursion
    return n * factorial(n - 1)

print(factorial(4))`,
    correctSolution: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(4))`,
    expectedOutput: '24',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-18-1', input: '', expectedOutput: '24', description: 'Base case termination at n=1' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-18-h1', input: '', expectedOutput: '24', isHidden: true, description: 'Stack overflow prevention' }
    ],
    isPublished: true,
    topics: ['Recursion', 'Base Cases', 'Functions']
  },
  {
    id: 'R1-Q19',
    round: 1,
    language: 'c',
    title: 'Switch Statement Unintended Fallthrough',
    description: 'Print the status label for status code 1. Output prints "ActivePausedUnknown" due to omitted break statements.',
    bugDescription: 'Missing `break;` statements inside `switch` cases cause unintended execution fallthrough.',
    buggyCode: `#include <stdio.h>

int main() {
    int status = 1;
    switch (status) {
        case 1:
            printf("Active");
            // BUG: Missing break falls through to case 2
        case 2:
            printf("Paused");
            // BUG: Missing break falls through to default
        default:
            printf("Unknown");
    }
    printf("\\n");
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int status = 1;
    switch (status) {
        case 1:
            printf("Active");
            break;
        case 2:
            printf("Paused");
            break;
        default:
            printf("Unknown");
            break;
    }
    printf("\\n");
    return 0;
}`,
    expectedOutput: 'Active',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-19-1', input: '', expectedOutput: 'Active', description: 'Isolated single switch case exit' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-19-h1', input: '', expectedOutput: 'Active', isHidden: true, description: 'Break statement verification' }
    ],
    isPublished: true,
    topics: ['Switch Statements', 'Break', 'Control Flow']
  },
  {
    id: 'R1-Q20',
    round: 1,
    language: 'python',
    title: 'Tuple Immutability in Unique Tag Accumulator',
    description: 'Convert a list of duplicate tags into unique elements preserving clean ordering. The code attempts to append directly to a tuple, crashing with AttributeError.',
    bugDescription: 'Tuples have no `.append()` method because they are immutable. Convert to set or list.',
    buggyCode: `def collect_tags(tag_list):
    result = ()
    for tag in tag_list:
        if tag not in result:
            # BUG: Tuples are immutable and lack .append()
            result.append(tag)
    return list(result)

tags = ["c", "python", "c", "algo"]
print(collect_tags(tags))`,
    correctSolution: `def collect_tags(tag_list):
    result = []
    for tag in tag_list:
        if tag not in result:
            result.append(tag)
    return result

tags = ["c", "python", "c", "algo"]
print(collect_tags(tags))`,
    expectedOutput: "['c', 'python', 'algo']",
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      { id: 'tc-r1-20-1', input: '', expectedOutput: "['c', 'python', 'algo']", description: 'Ordered deduplication' }
    ],
    hiddenTestCases: [
      { id: 'tc-r1-20-h1', input: '', expectedOutput: "['c', 'python', 'algo']", isHidden: true, description: 'Tuple vs list structure' }
    ],
    isPublished: true,
    topics: ['Tuples', 'Lists', 'Deduplication']
  },

  // ==========================================
  // ROUND 2: CORE PROGRAMMING & DEBUGGING (10 QUESTIONS)
  // ==========================================
  {
    id: 'R2-Q01',
    round: 2,
    language: 'c',
    title: 'Pointer Swap Pass-by-Value Error in Sort Partition',
    description: 'Implement a helper function `swap` to exchange two integer values in an array. Currently, the function swaps copies of variables, leaving the original array unchanged.',
    bugDescription: 'The `swap` function parameters are pass-by-value `int a, int b` instead of pointers `int *a, int *b`.',
    buggyCode: `#include <stdio.h>

// BUG: Swapping local copies instead of memory pointers
void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(x, y);
    printf("x=%d, y=%d\\n", x, y);
    return 0;
}`,
    correctSolution: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("x=%d, y=%d\\n", x, y);
    return 0;
}`,
    expectedOutput: 'x=20, y=10',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-01-1', input: '', expectedOutput: 'x=20, y=10', description: 'Pointer dereference value exchange' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-01-h1', input: '', expectedOutput: 'x=20, y=10', isHidden: true, description: 'Memory mutation persistence' }
    ],
    isPublished: true,
    topics: ['Pointers', 'Pass-by-Reference', 'Functions']
  },
  {
    id: 'R2-Q02',
    round: 2,
    language: 'python',
    title: 'Custom Class __hash__ & __eq__ Mismatch in Set Lookup',
    description: 'A Student object with the same ID should be treated as duplicate when inserted into a set. Currently, set allows duplicates because `__hash__` and `__eq__` are not defined.',
    bugDescription: 'Class lacks `__eq__` and `__hash__` dunder methods, causing default identity comparison (`is`) instead of value equality.',
    buggyCode: `class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name

# BUG: Missing __eq__ and __hash__ allows duplicate instances with same ID in set
s1 = Student("GC001", "Alex")
s2 = Student("GC001", "Alex Duplicate")
students = {s1, s2}
print(len(students))`,
    correctSolution: `class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name

    def __eq__(self, other):
        if isinstance(other, Student):
            return self.student_id == other.student_id
        return False

    def __hash__(self):
        return hash(self.student_id)

s1 = Student("GC001", "Alex")
s2 = Student("GC001", "Alex Duplicate")
students = {s1, s2}
print(len(students))`,
    expectedOutput: '1',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-02-1', input: '', expectedOutput: '1', description: 'Set duplicate elimination by custom hash' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-02-h1', input: '', expectedOutput: '1', isHidden: true, description: 'Dunder hashing protocol consistency' }
    ],
    isPublished: true,
    topics: ['OOP', 'Dunder Methods', 'Sets', 'Hashing']
  },
  {
    id: 'R2-Q03',
    round: 2,
    language: 'c',
    title: 'Struct Pointer Arrow Operator & Null Dereference',
    description: 'Initialize a Player struct pointer and set score to 100. The code attempts to access members through an unallocated pointer or incorrect dot operator.',
    bugDescription: 'Player pointer `p` is never allocated memory via malloc before dereferencing with arrow operator, causing segmentation fault.',
    buggyCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    int score;
} Player;

int main() {
    Player *p; // BUG: Dangling uninitialized pointer
    p->id = 1;
    p->score = 100;
    
    printf("Player %d: %d\\n", p->id, p->score);
    return 0;
}`,
    correctSolution: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    int score;
} Player;

int main() {
    Player *p = (Player *)malloc(sizeof(Player));
    if (p == NULL) return 1;
    
    p->id = 1;
    p->score = 100;
    
    printf("Player %d: %d\\n", p->id, p->score);
    free(p);
    return 0;
}`,
    expectedOutput: 'Player 1: 100',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-03-1', input: '', expectedOutput: 'Player 1: 100', description: 'Struct dynamic allocation' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-03-h1', input: '', expectedOutput: 'Player 1: 100', isHidden: true, description: 'Heap safety and free invocation' }
    ],
    isPublished: true,
    topics: ['Structs', 'Dynamic Memory', 'Segmentation Fault']
  },
  {
    id: 'R2-Q04',
    round: 2,
    language: 'python',
    title: 'Shallow Copy Mutation in 2D Matrix',
    description: 'Create a 3x3 game grid initialized with zeroes. Mutating grid[0][0] = 1 should not alter any other rows, but currently turns the entire first column to 1.',
    bugDescription: 'List multiplication `[[0] * 3] * 3` clones the same row reference 3 times.',
    buggyCode: `# BUG: Shallow row multiplication duplicates inner list reference
grid = [[0] * 3] * 3
grid[0][0] = 1

# Print grid as flattened list
flat = [val for row in grid for val in row]
print(flat)`,
    correctSolution: `grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1

flat = [val for row in grid for val in row]
print(flat)`,
    expectedOutput: '[1, 0, 0, 0, 0, 0, 0, 0, 0]',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-04-1', input: '', expectedOutput: '[1, 0, 0, 0, 0, 0, 0, 0, 0]', description: 'Independent 2D grid cell mutation' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-04-h1', input: '', expectedOutput: '[1, 0, 0, 0, 0, 0, 0, 0, 0]', isHidden: true, description: 'Deep reference independence' }
    ],
    isPublished: true,
    topics: ['Lists', 'References', '2D Arrays']
  },
  {
    id: 'R2-Q05',
    round: 2,
    language: 'c',
    title: 'Dynamic Array Allocation Size Calculation Bug',
    description: 'Allocate an array of 5 doubles on heap and populate with values. The code uses `sizeof(int)` instead of `sizeof(double)`, leading to heap buffer overflow.',
    bugDescription: '`malloc(n * sizeof(int))` allocates 20 bytes instead of 40 bytes for 5 doubles, corrupting adjacent heap chunks.',
    buggyCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    // BUG: Allocating with sizeof(int) instead of sizeof(double)
    double *arr = (double *)malloc(n * sizeof(int));
    
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 1.5;
    }
    
    printf("%.1f\\n", arr[4]);
    free(arr);
    return 0;
}`,
    correctSolution: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    double *arr = (double *)malloc(n * sizeof(double));
    if (!arr) return 1;
    
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 1.5;
    }
    
    printf("%.1f\\n", arr[4]);
    free(arr);
    return 0;
}`,
    expectedOutput: '7.5',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-05-1', input: '', expectedOutput: '7.5', description: 'Heap buffer double-precision element' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-05-h1', input: '', expectedOutput: '7.5', isHidden: true, description: 'Memory bounds size calculation' }
    ],
    isPublished: true,
    topics: ['Dynamic Memory', 'malloc', 'sizeof']
  },
  {
    id: 'R2-Q06',
    round: 2,
    language: 'python',
    title: 'Custom Exception Flow & Fall-Through Suppression',
    description: 'Parse an integer token. If parsing fails, catch ValueError and raise a custom InvalidTokenError. Currently the code swallows all exceptions silently.',
    bugDescription: 'Bare `except:` block masks all errors, or fails to properly raise custom exception hierarchy.',
    buggyCode: `class InvalidTokenError(Exception):
    pass

def process_token(token):
    try:
        val = int(token)
        return val * 2
    except:
        # BUG: Swallowing error and returning None instead of raising InvalidTokenError
        return None

try:
    result = process_token("abc")
    print(result)
except InvalidTokenError:
    print("Caught InvalidTokenError")`,
    correctSolution: `class InvalidTokenError(Exception):
    pass

def process_token(token):
    try:
        val = int(token)
        return val * 2
    except ValueError as e:
        raise InvalidTokenError("Failed to parse token") from e

try:
    result = process_token("abc")
    print(result)
except InvalidTokenError:
    print("Caught InvalidTokenError")`,
    expectedOutput: 'Caught InvalidTokenError',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-06-1', input: '', expectedOutput: 'Caught InvalidTokenError', description: 'Custom exception handling propagation' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-06-h1', input: '', expectedOutput: 'Caught InvalidTokenError', isHidden: true, description: 'Specific exception catching' }
    ],
    isPublished: true,
    topics: ['Exceptions', 'OOP', 'Control Flow']
  },
  {
    id: 'R2-Q07',
    round: 2,
    language: 'c',
    title: 'Singly Linked List Node Insertion Pointer Severing',
    description: 'Insert a new node with value 15 into a linked list between node 10 and 20. The current code severs the rest of the list, losing node 20.',
    bugDescription: '`prev->next = new_node; new_node->next = prev->next;` creates a self-loop and loses remaining chain.',
    buggyCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    struct Node* first = (struct Node*)malloc(sizeof(struct Node));
    struct Node* third = (struct Node*)malloc(sizeof(struct Node));
    struct Node* second = (struct Node*)malloc(sizeof(struct Node));
    
    first->data = 10;
    first->next = third;
    
    third->data = 20;
    third->next = NULL;
    
    second->data = 15;
    
    // BUG: Assigning first->next first overwrites pointer before saving to second->next
    first->next = second;
    second->next = first->next; // Causes circular self-loop
    
    printf("%d %d %d\\n", first->data, first->next->data, first->next->next ? first->next->next->data : -1);
    return 0;
}`,
    correctSolution: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    struct Node* first = (struct Node*)malloc(sizeof(struct Node));
    struct Node* third = (struct Node*)malloc(sizeof(struct Node));
    struct Node* second = (struct Node*)malloc(sizeof(struct Node));
    
    first->data = 10;
    first->next = third;
    
    third->data = 20;
    third->next = NULL;
    
    second->data = 15;
    
    second->next = first->next;
    first->next = second;
    
    printf("%d %d %d\\n", first->data, first->next->data, first->next->next->data);
    
    free(second);
    free(third);
    free(first);
    return 0;
}`,
    expectedOutput: '10 15 20',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-07-1', input: '', expectedOutput: '10 15 20', description: 'Linked list node insertion sequence' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-07-h1', input: '', expectedOutput: '10 15 20', isHidden: true, description: 'Chain pointer preservation' }
    ],
    isPublished: true,
    topics: ['Linked Lists', 'Pointers', 'Data Structures']
  },
  {
    id: 'R2-Q08',
    round: 2,
    language: 'python',
    title: 'Binary Search Midpoint Calculation & Infinite Loop',
    description: 'Perform binary search for target 7 in sorted list `[1, 3, 5, 7, 9, 11]`. The search hangs in an infinite loop due to improper boundary updates.',
    bugDescription: '`low = mid` without `+ 1` leads to infinite loop when `low == mid`.',
    buggyCode: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            # BUG: Missing +1 causes infinite loop when low and mid coincide
            low = mid
        else:
            high = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11]
print(binary_search(nums, 7))`,
    correctSolution: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11]
print(binary_search(nums, 7))`,
    expectedOutput: '3',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-08-1', input: '', expectedOutput: '3', description: 'Binary search index retrieval' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-08-h1', input: '', expectedOutput: '3', isHidden: true, description: 'Boundary convergence check' }
    ],
    isPublished: true,
    topics: ['Binary Search', 'Algorithms', 'Loop Termination']
  },
  {
    id: 'R2-Q09',
    round: 2,
    language: 'c',
    title: 'String Reversal in C with Pointers (Const Literal Segfault)',
    description: 'Reverse string "HELLO" in place using two pointer iterators. The current code attempts to mutate a string literal in read-only memory.',
    bugDescription: '`char *str = "HELLO";` points to read-only `.rodata` segment. Attempting in-place swap causes Segmentation Fault (SIGSEGV). Must use `char str[] = "HELLO";`.',
    buggyCode: `#include <stdio.h>
#include <string.h>

int main() {
    // BUG: String literal is placed in read-only text segment
    char *str = "HELLO";
    int len = strlen(str);
    char *start = str;
    char *end = str + len - 1;
    
    while (start < end) {
        char tmp = *start;
        *start = *end; // SEGFAULT here
        *end = tmp;
        start++;
        end--;
    }
    
    printf("%s\\n", str);
    return 0;
}`,
    correctSolution: `#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "HELLO";
    int len = strlen(str);
    char *start = str;
    char *end = str + len - 1;
    
    while (start < end) {
        char tmp = *start;
        *start = *end;
        *end = tmp;
        start++;
        end--;
    }
    
    printf("%s\\n", str);
    return 0;
}`,
    expectedOutput: 'OLLEH',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-09-1', input: '', expectedOutput: 'OLLEH', description: 'Writable stack array string reversal' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-09-h1', input: '', expectedOutput: 'OLLEH', isHidden: true, description: 'Memory segment write permission' }
    ],
    isPublished: true,
    topics: ['Pointers', 'Memory Segments', 'Strings']
  },
  {
    id: 'R2-Q10',
    round: 2,
    language: 'python',
    title: 'Generator Object Exhaustion on Repeated Iteration',
    description: 'Calculate both the minimum and maximum of a sequence from an iterator generator. The second call finds nothing because generator streams can only be consumed once.',
    bugDescription: 'Generators exhaust after one traversal. Must convert generator to list or recreate iterator.',
    buggyCode: `def generate_multiples(n, limit):
    for i in range(1, limit + 1):
        yield n * i

# BUG: Generator object exhausts after min(); max() raises ValueError
gen = generate_multiples(3, 4)
smallest = min(gen)
largest = max(gen)
print(f"min={smallest}, max={largest}")`,
    correctSolution: `def generate_multiples(n, limit):
    for i in range(1, limit + 1):
        yield n * i

# Convert generator to list to preserve elements for multiple passes
values = list(generate_multiples(3, 4))
smallest = min(values)
largest = max(values)
print(f"min={smallest}, max={largest}")`,
    expectedOutput: 'min=3, max=12',
    marks: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 5,
    visibleTestCases: [
      { id: 'tc-r2-10-1', input: '', expectedOutput: 'min=3, max=12', description: 'Re-usable collection calculation' }
    ],
    hiddenTestCases: [
      { id: 'tc-r2-10-h1', input: '', expectedOutput: 'min=3, max=12', isHidden: true, description: 'Iterator exhaustion awareness' }
    ],
    isPublished: true,
    topics: ['Generators', 'Iterators', 'Builtins']
  },

  // ==========================================
  // ROUND 3: ADVANCED PROFESSIONAL DEBUGGING (5 QUESTIONS)
  // ==========================================
  {
    id: 'R3-Q01',
    round: 3,
    language: 'c',
    title: 'Double Free & Dangling Pointer in Dynamic String Stack',
    description: 'Implement a dynamic stack of strings. Popping and cleaning items triggers heap corruption `double free or corruption (out)` because the popped pointer is freed twice.',
    bugDescription: 'Stack node pop frees the internal string buffer, and then stack cleanup frees the same buffer pointer without nullifying.',
    buggyCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct StackNode {
    char *text;
    struct StackNode *next;
} StackNode;

void push(StackNode **top, const char *msg) {
    StackNode *node = (StackNode *)malloc(sizeof(StackNode));
    node->text = strdup(msg);
    node->next = *top;
    *top = node;
}

char* pop(StackNode **top) {
    if (!*top) return NULL;
    StackNode *temp = *top;
    char *ret = temp->text;
    *top = temp->next;
    // BUG: Freeing ret here AND caller frees again causes double-free
    free(temp->text);
    free(temp);
    return ret;
}

int main() {
    StackNode *stack = NULL;
    push(&stack, "GENCRAFT_CORE");
    char *val = pop(&stack);
    printf("Popped: %s\\n", val ? val : "NULL");
    return 0;
}`,
    correctSolution: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct StackNode {
    char *text;
    struct StackNode *next;
} StackNode;

void push(StackNode **top, const char *msg) {
    StackNode *node = (StackNode *)malloc(sizeof(StackNode));
    node->text = strdup(msg);
    node->next = *top;
    *top = node;
}

char* pop(StackNode **top) {
    if (!*top) return NULL;
    StackNode *temp = *top;
    char *ret = temp->text;
    *top = temp->next;
    free(temp);
    return ret;
}

int main() {
    StackNode *stack = NULL;
    push(&stack, "GENCRAFT_CORE");
    char *val = pop(&stack);
    printf("Popped: %s\\n", val ? val : "NULL");
    if (val) free(val);
    return 0;
}`,
    expectedOutput: 'Popped: GENCRAFT_CORE',
    marks: 20,
    difficulty: 'Hard',
    timeLimitMinutes: 10,
    visibleTestCases: [
      { id: 'tc-r3-01-1', input: '', expectedOutput: 'Popped: GENCRAFT_CORE', description: 'Single ownership heap transfer' }
    ],
    hiddenTestCases: [
      { id: 'tc-r3-01-h1', input: '', expectedOutput: 'Popped: GENCRAFT_CORE', isHidden: true, description: 'Heap sanity check no double free' }
    ],
    isPublished: true,
    topics: ['Dynamic Memory', 'Double Free', 'Dangling Pointers', 'Data Structures']
  },
  {
    id: 'R3-Q02',
    round: 3,
    language: 'python',
    title: 'Diamond Inheritance & Method Resolution Order (MRO) Super() Error',
    description: 'Implement a diamond inheritance hierarchy `A -> B, C -> D`. Calling `d.execute()` should invoke initialize from both branches in proper cooperative MRO order, but crashes or skips branch C.',
    bugDescription: 'Direct hardcoded parent calls `A.__init__(self)` bypass cooperative `super().__init__()`, breaking Python C3 linearization.',
    buggyCode: `class A:
    def process(self):
        return ["A"]

class B(A):
    def process(self):
        # BUG: Direct base class call breaks cooperative MRO chaining
        return ["B"] + A.process(self)

class C(A):
    def process(self):
        return ["C"] + A.process(self)

class D(B, C):
    def process(self):
        # BUG: Only calls B, skipping C completely
        return ["D"] + B.process(self)

d = D()
print("->".join(d.process()))`,
    correctSolution: `class A:
    def process(self):
        return ["A"]

class B(A):
    def process(self):
        return ["B"] + super().process()

class C(A):
    def process(self):
        return ["C"] + super().process()

class D(B, C):
    def process(self):
        return ["D"] + super().process()

d = D()
print("->".join(d.process()))`,
    expectedOutput: 'D->B->C->A',
    marks: 20,
    difficulty: 'Hard',
    timeLimitMinutes: 10,
    visibleTestCases: [
      { id: 'tc-r3-02-1', input: '', expectedOutput: 'D->B->C->A', description: 'Full C3 MRO cooperative inheritance resolution' }
    ],
    hiddenTestCases: [
      { id: 'tc-r3-02-h1', input: '', expectedOutput: 'D->B->C->A', isHidden: true, description: 'Super chaining integrity' }
    ],
    isPublished: true,
    topics: ['OOP', 'MRO', 'Super', 'Diamond Problem']
  },
  {
    id: 'R3-Q03',
    round: 3,
    language: 'c',
    title: 'QuickSort Lomuto Partition Index Underflow on Equal Elements',
    description: 'Sort an array containing duplicate elements `[5, 2, 5, 1, 5]`. The partition function gets stuck or accesses negative array indices.',
    bugDescription: 'Partition index variable declared as `unsigned int` or boundary condition `<=` causes infinite recursion on identical values.',
    buggyCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    // BUG: signed comparison with unsigned index underflows to 4294967295
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        // BUG: Strict equality missing causes unbalanced partition
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quicksort(int arr[], int low, int high) {
    // BUG: Missing check for low < high allows stack overflow
    if (low < high) {
        int pi = partition(arr, low, high);
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
}

int main() {
    int arr[5] = {5, 2, 5, 1, 5};
    quicksort(arr, 0, 4);
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
    correctSolution: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quicksort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
}

int main() {
    int arr[5] = {5, 2, 5, 1, 5};
    quicksort(arr, 0, 4);
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
    expectedOutput: '1 2 5 5 5',
    marks: 20,
    difficulty: 'Hard',
    timeLimitMinutes: 10,
    visibleTestCases: [
      { id: 'tc-r3-03-1', input: '', expectedOutput: '1 2 5 5 5', description: 'Sorted array with duplicate keys' }
    ],
    hiddenTestCases: [
      { id: 'tc-r3-03-h1', input: '', expectedOutput: '1 2 5 5 5', isHidden: true, description: 'Lomuto stability partition check' }
    ],
    isPublished: true,
    topics: ['Algorithms', 'Sorting', 'Recursion', 'Memory Safety']
  },
  {
    id: 'R3-Q04',
    round: 3,
    language: 'python',
    title: 'Memoized DP Decorator State Leaking Across Test Instances',
    description: 'Implement a memoized recursion for Longest Common Subsequence or Knapsack. Consecutive calls with different weights return stale cached results from previous tests.',
    bugDescription: 'Memo cache dict is stored as class attribute or module-level default dict without clearing between independent runs.',
    buggyCode: `def memoize(fn):
    # BUG: Cache persists indefinitely and doesn't handle unhashable or context keys
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    return wrapper

@memoize
def min_coins(coins, target):
    if target == 0:
        return 0
    if target < 0:
        return float('inf')
    # BUG: Coins tuple vs list hashing and infinity handling
    return min([1 + min_coins(coins, target - c) for c in coins])

# First query with small set
ans1 = min_coins((1, 2, 5), 11)
print(ans1)`,
    correctSolution: `def memoize(fn):
    cache = {}
    def wrapper(coins, target):
        key = (tuple(coins), target)
        if key not in cache:
            cache[key] = fn(coins, target)
        return cache[key]
    return wrapper

@memoize
def min_coins(coins, target):
    if target == 0:
        return 0
    if target < 0:
        return float('inf')
    res = float('inf')
    for c in coins:
        sub = min_coins(coins, target - c)
        if sub != float('inf'):
            res = min(res, 1 + sub)
    return res

ans1 = min_coins((1, 2, 5), 11)
print(ans1)`,
    expectedOutput: '3',
    marks: 20,
    difficulty: 'Hard',
    timeLimitMinutes: 10,
    visibleTestCases: [
      { id: 'tc-r3-04-1', input: '', expectedOutput: '3', description: 'Dynamic programming optimal coin count' }
    ],
    hiddenTestCases: [
      { id: 'tc-r3-04-h1', input: '', expectedOutput: '3', isHidden: true, description: 'Memoization purity assertion' }
    ],
    isPublished: true,
    topics: ['Dynamic Programming', 'Memoization', 'Decorators']
  },
  {
    id: 'R3-Q05',
    round: 3,
    language: 'c',
    title: 'Doubly Linked List LRU Cache Pointer Corruption on Eviction',
    description: 'Implement node eviction in an LRU cache doubly linked list. When removing the tail node, `tail->prev->next` pointer is not nullified, causing memory corruption when subsequent nodes are added.',
    bugDescription: 'Evict function fails to handle single-node edge case and leaves dangling pointers on previous tail node.',
    buggyCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct DNode {
    int key;
    int val;
    struct DNode *prev;
    struct DNode *next;
} DNode;

typedef struct {
    DNode *head;
    DNode *tail;
} LRUCache;

void evictTail(LRUCache *cache) {
    if (!cache->tail) return;
    DNode *oldTail = cache->tail;
    
    // BUG: Omitting check for head == tail causes null pointer dereference
    cache->tail = oldTail->prev;
    // BUG: cache->tail is NULL if only 1 node, causing crash
    cache->tail->next = NULL; 
    
    free(oldTail);
}

int main() {
    LRUCache cache = {NULL, NULL};
    DNode *node = (DNode*)malloc(sizeof(DNode));
    node->key = 1; node->val = 100;
    node->prev = NULL; node->next = NULL;
    cache.head = node;
    cache.tail = node;
    
    // Evict the single node
    evictTail(&cache);
    
    printf("Evicted successfully, head is %s\\n", cache.tail == NULL ? "NULL" : "CORRUPT");
    return 0;
}`,
    correctSolution: `#include <stdio.h>
#include <stdlib.h>

typedef struct DNode {
    int key;
    int val;
    struct DNode *prev;
    struct DNode *next;
} DNode;

typedef struct {
    DNode *head;
    DNode *tail;
} LRUCache;

void evictTail(LRUCache *cache) {
    if (!cache->tail) return;
    DNode *oldTail = cache->tail;
    
    if (cache->head == cache->tail) {
        cache->head = NULL;
        cache->tail = NULL;
    } else {
        cache->tail = oldTail->prev;
        if (cache->tail) {
            cache->tail->next = NULL;
        }
    }
    
    free(oldTail);
}

int main() {
    LRUCache cache = {NULL, NULL};
    DNode *node = (DNode*)malloc(sizeof(DNode));
    node->key = 1; node->val = 100;
    node->prev = NULL; node->next = NULL;
    cache.head = node;
    cache.tail = node;
    
    evictTail(&cache);
    
    printf("Evicted successfully, head is %s\\n", cache.tail == NULL ? "NULL" : "CORRUPT");
    return 0;
}`,
    expectedOutput: 'Evicted successfully, head is NULL',
    marks: 20,
    difficulty: 'Hard',
    timeLimitMinutes: 10,
    visibleTestCases: [
      { id: 'tc-r3-05-1', input: '', expectedOutput: 'Evicted successfully, head is NULL', description: 'Single node edge-case eviction' }
    ],
    hiddenTestCases: [
      { id: 'tc-r3-05-h1', input: '', expectedOutput: 'Evicted successfully, head is NULL', isHidden: true, description: 'Double linked list boundary pointer check' }
    ],
    isPublished: true,
    topics: ['Data Structures', 'Doubly Linked List', 'Edge Cases', 'Pointers']
  }
];
