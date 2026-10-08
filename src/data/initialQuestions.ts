import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // ROUND 1: CHAMPIONSHIP DEBUGGING (7 QUESTIONS)
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
  }
];
