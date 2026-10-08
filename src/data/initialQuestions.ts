import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'R1-Q01',
    round: 1,
    language: 'python',
    title: 'Loop Even Numbers Sum',
    description: 'Calculate the sum of all positive even integers up to and including n. Fix the loop boundary so that n is included when it is even.',
    bugDescription: 'range(1, n) stops before n instead of including n, failing to sum n when n is even.',
    buggyCode: `n = int(input())
total = 0
for i in range(1, n):
    if i % 2 == 0:
        total += i
print(total)`,
    correctSolution: `n = int(input())
total = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        total += i
print(total)`,
    expectedOutput: '30',
    marks: 5,
    difficulty: 'Easy',
    timeLimitMinutes: 3,
    visibleTestCases: [
      {
        id: 'tc-r1-01-1',
        input: '10',
        expectedOutput: '30',
        buggyOutput: '20',
        description: 'Sum of even numbers up to 10'
      },
      {
        id: 'tc-r1-01-2',
        input: '6',
        expectedOutput: '12',
        buggyOutput: '6',
        description: 'Sum of even numbers up to 6'
      },
      {
        id: 'tc-r1-01-3',
        input: '4',
        expectedOutput: '6',
        buggyOutput: '2',
        description: 'Sum of even numbers up to 4'
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-r1-01-4',
        input: '100',
        expectedOutput: '2550',
        buggyOutput: '2450',
        description: 'Large boundary test up to 100',
        isHidden: true
      }
    ],
    isPublished: true,
    author: 'BugFest Committee',
    topics: ['Loops', 'Range Boundaries', 'Arithmetic']
  },
  {
    id: 'R1-Q02',
    round: 1,
    language: 'c',
    title: 'Function Pointer Swap',
    description: 'Swap two integer variables using a helper function. Fix the pass-by-value parameter passing to pass pointers so the swap persists in main.',
    bugDescription: 'Parameters a and b are passed by value instead of by pointer reference, so modifications are lost upon function return.',
    buggyCode: `#include <stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(x, y);
    printf("x = %d, y = %d\\n", x, y);
    return 0;
}`,
    correctSolution: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("x = %d, y = %d\\n", x, y);
    return 0;
}`,
    expectedOutput: 'x = 10, y = 5',
    marks: 5,
    difficulty: 'Medium',
    timeLimitMinutes: 4,
    visibleTestCases: [
      {
        id: 'tc-r1-02-1',
        input: '5 10',
        expectedOutput: 'x = 10, y = 5',
        buggyOutput: 'x = 5, y = 10',
        description: 'Positive integers swap'
      },
      {
        id: 'tc-r1-02-2',
        input: '-3 8',
        expectedOutput: 'x = 8, y = -3',
        buggyOutput: 'x = -3, y = 8',
        description: 'Negative and positive swap'
      },
      {
        id: 'tc-r1-02-3',
        input: '100 200',
        expectedOutput: 'x = 200, y = 100',
        buggyOutput: 'x = 100, y = 200',
        description: 'Large values swap'
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-r1-02-4',
        input: '-7 -9',
        expectedOutput: 'x = -9, y = -7',
        buggyOutput: 'x = -7, y = -9',
        description: 'Both negative integers swap',
        isHidden: true
      }
    ],
    isPublished: true,
    author: 'BugFest Committee',
    topics: ['Pointers', 'Pass by Reference', 'Functions']
  },
  {
    id: 'R1-Q03',
    round: 1,
    language: 'python',
    title: 'If-Else Grade Categorization',
    description: 'Classify numerical marks into letter grades (A for >= 90, B for >= 75, C for >= 50, F otherwise). Fix the conditional check ordering.',
    bugDescription: 'Condition marks >= 50 is evaluated first, causing scores of 75+ and 90+ to prematurely match grade C.',
    buggyCode: `marks = int(input())
if marks >= 50:
    print("C")
elif marks >= 75:
    print("B")
elif marks >= 90:
    print("A")
else:
    print("F")`,
    correctSolution: `marks = int(input())
if marks >= 90:
    print("A")
elif marks >= 75:
    print("B")
elif marks >= 50:
    print("C")
else:
    print("F")`,
    expectedOutput: 'A',
    marks: 5,
    difficulty: 'Medium',
    timeLimitMinutes: 3,
    visibleTestCases: [
      {
        id: 'tc-r1-03-1',
        input: '95',
        expectedOutput: 'A',
        buggyOutput: 'C',
        description: 'Grade A score evaluation'
      },
      {
        id: 'tc-r1-03-2',
        input: '80',
        expectedOutput: 'B',
        buggyOutput: 'C',
        description: 'Grade B score evaluation'
      },
      {
        id: 'tc-r1-03-3',
        input: '49',
        expectedOutput: 'F',
        buggyOutput: 'F',
        description: 'Failing grade evaluation'
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-r1-03-4',
        input: '90',
        expectedOutput: 'A',
        buggyOutput: 'C',
        description: 'Threshold boundary for Grade A',
        isHidden: true
      }
    ],
    isPublished: true,
    author: 'BugFest Committee',
    topics: ['Conditionals', 'Evaluation Order', 'Control Flow']
  },
  {
    id: 'R1-Q04',
    round: 1,
    language: 'c',
    title: 'Array Average Calculation',
    description: 'Read 5 integers into an array and compute their floating-point average formatted to 2 decimal places. Fix the 1-based loop index and integer division truncation.',
    bugDescription: 'Accumulator loop starts at index 1 omitting arr[0], and sum / 5 performs integer truncation.',
    buggyCode: `#include <stdio.h>

int main() {
    int arr[5];
    int sum = 0;
    for (int i = 0; i < 5; i++)
        scanf("%d", &arr[i]);
    for (int i = 1; i < 5; i++)
        sum += arr[i];
    float avg = sum / 5;
    printf("Average = %.2f\\n", avg);
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int main() {
    int arr[5];
    int sum = 0;
    for (int i = 0; i < 5; i++)
        scanf("%d", &arr[i]);
    for (int i = 0; i < 5; i++)
        sum += arr[i];
    float avg = (float)sum / 5;
    printf("Average = %.2f\\n", avg);
    return 0;
}`,
    expectedOutput: 'Average = 20.40',
    marks: 5,
    difficulty: 'Medium',
    timeLimitMinutes: 4,
    visibleTestCases: [
      {
        id: 'tc-r1-04-1',
        input: '12 15 20 25 30',
        expectedOutput: 'Average = 20.40',
        buggyOutput: 'Average = 18.00',
        description: 'General 5 numbers floating average'
      },
      {
        id: 'tc-r1-04-2',
        input: '1 2 3 4 5',
        expectedOutput: 'Average = 3.00',
        buggyOutput: 'Average = 2.00',
        description: 'Sequential integers average'
      },
      {
        id: 'tc-r1-04-3',
        input: '10 20 30 40 51',
        expectedOutput: 'Average = 30.20',
        buggyOutput: 'Average = 28.00',
        description: 'Decimal average remainder'
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-r1-04-4',
        input: '-5 10 0 7 4',
        expectedOutput: 'Average = 3.20',
        buggyOutput: 'Average = 4.00',
        description: 'Negative and zero numbers average',
        isHidden: true
      }
    ],
    isPublished: true,
    author: 'BugFest Committee',
    topics: ['Arrays', 'Type Casting', 'Loops']
  },
  {
    id: 'R1-Q05',
    round: 1,
    language: 'python',
    title: 'Find Maximum Value',
    description: 'Find the maximum value from a space-separated list of numbers. Fix the 0 initialization for negative numbers and the inverted comparison operator.',
    bugDescription: 'max_val is initialized to 0 (fails when all numbers are negative) and uses < instead of >.',
    buggyCode: `def find_max(nums):
    max_val = 0
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

nums = list(map(int, input().split()))
print(find_max(nums))`,
    correctSolution: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n > max_val:
            max_val = n
    return max_val

nums = list(map(int, input().split()))
print(find_max(nums))`,
    expectedOutput: '-2',
    marks: 5,
    difficulty: 'Medium',
    timeLimitMinutes: 4,
    visibleTestCases: [
      {
        id: 'tc-r1-05-1',
        input: '-5 -2 -9',
        expectedOutput: '-2',
        buggyOutput: '-9',
        description: 'All negative numbers maximum'
      },
      {
        id: 'tc-r1-05-2',
        input: '3 8 1',
        expectedOutput: '8',
        buggyOutput: '0',
        description: 'Positive integers maximum'
      },
      {
        id: 'tc-r1-05-3',
        input: '4 9 2 7',
        expectedOutput: '9',
        buggyOutput: '0',
        description: 'Multi-element list maximum'
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-r1-05-4',
        input: '-10 -3 -50 -1 -8',
        expectedOutput: '-1',
        buggyOutput: '-50',
        description: 'Larger negative array maximum',
        isHidden: true
      }
    ],
    isPublished: true,
    author: 'BugFest Committee',
    topics: ['Lists', 'Min/Max Algorithms', 'Negative Numbers']
  },
  {
    id: 'R1-Q06',
    round: 1,
    language: 'c',
    title: 'Binary Search Algorithm',
    description: 'Implement binary search in a sorted array by filling in the missing pointer update logic inside the branch statements.',
    bugDescription: 'Missing low = mid + 1; and high = mid - 1; pointer updates, causing an infinite loop.',
    buggyCode: `#include <stdio.h>

int binarySearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == key)
            return mid;
        else if (arr[mid] < key) {
            // write missing line 1
        } else {
            // write missing line 2
        }
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    int key;
    scanf("%d", &key);
    int result = binarySearch(arr, n, key);
    if (result != -1)
        printf("Found at index %d\\n", result);
    else
        printf("Not found\\n");
    return 0;
}`,
    correctSolution: `#include <stdio.h>

int binarySearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == key)
            return mid;
        else if (arr[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    int key;
    scanf("%d", &key);
    int result = binarySearch(arr, n, key);
    if (result != -1)
        printf("Found at index %d\\n", result);
    else
        printf("Not found\\n");
    return 0;
}`,
    expectedOutput: 'Found at index 5',
    marks: 5,
    difficulty: 'Medium',
    timeLimitMinutes: 4,
    visibleTestCases: [
      {
        id: 'tc-r1-06-1',
        input: '23',
        expectedOutput: 'Found at index 5',
        buggyOutput: '[Execution timed out: infinite loop detected]',
        description: 'Target in middle of array'
      },
      {
        id: 'tc-r1-06-2',
        input: '2',
        expectedOutput: 'Found at index 0',
        buggyOutput: '[Execution timed out: infinite loop detected]',
        description: 'First element of array'
      },
      {
        id: 'tc-r1-06-3',
        input: '91',
        expectedOutput: 'Found at index 9',
        buggyOutput: '[Execution timed out: infinite loop detected]',
        description: 'Last element of array'
      },
      {
        id: 'tc-r1-06-4',
        input: '40',
        expectedOutput: 'Not found',
        buggyOutput: '[Execution timed out: infinite loop detected]',
        description: 'Element not in array (middle missing)'
      },
      {
        id: 'tc-r1-06-5',
        input: '12',
        expectedOutput: 'Found at index 3',
        buggyOutput: '[Execution timed out: infinite loop detected]',
        description: 'Quarter position search'
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-r1-06-6',
        input: '1',
        expectedOutput: 'Not found',
        buggyOutput: '[Execution timed out: infinite loop detected]',
        description: 'Element smaller than min',
        isHidden: true
      }
    ],
    isPublished: true,
    author: 'BugFest Committee',
    topics: ['Binary Search', 'Algorithms', 'Pointers']
  },
  {
    id: 'R1-Q07',
    round: 1,
    language: 'python',
    title: 'Tower of Hanoi Recursion',
    description: 'Solve the Tower of Hanoi problem recursively by writing the missing second recursive call after moving the nth disk.',
    bugDescription: 'Missing the second recursive call hanoi(n - 1, aux, dest, src) to move the remaining n-1 disks onto destination.',
    buggyCode: `def hanoi(n, src, dest, aux):
    if n == 0:
        return
    hanoi(n - 1, src, aux, dest)
    print(f"Move disk {n} from {src} to {dest}")
    # write the missing line here

n, a, b, c = input().split()
hanoi(int(n), a, b, c)`,
    correctSolution: `def hanoi(n, src, dest, aux):
    if n == 0:
        return
    hanoi(n - 1, src, aux, dest)
    print(f"Move disk {n} from {src} to {dest}")
    hanoi(n - 1, aux, dest, src)

n, a, b, c = input().split()
hanoi(int(n), a, b, c)`,
    expectedOutput: `Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C`,
    marks: 5,
    difficulty: 'Medium',
    timeLimitMinutes: 4,
    visibleTestCases: [
      {
        id: 'tc-r1-07-1',
        input: '3 A C B',
        expectedOutput: `Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C`,
        buggyOutput: `Move disk 1 from A to C
Move disk 2 from A to B
Move disk 3 from A to C`,
        description: '3 disks standard A to C via B'
      },
      {
        id: 'tc-r1-07-2',
        input: '2 A C B',
        expectedOutput: `Move disk 1 from A to B
Move disk 2 from A to C
Move disk 1 from B to C`,
        buggyOutput: `Move disk 1 from A to B
Move disk 2 from A to C`,
        description: '2 disks A to C via B'
      },
      {
        id: 'tc-r1-07-3',
        input: '2 A B C',
        expectedOutput: `Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B`,
        buggyOutput: `Move disk 1 from A to C
Move disk 2 from A to B`,
        description: '2 disks A to B via C'
      },
      {
        id: 'tc-r1-07-4',
        input: '1 A C B',
        expectedOutput: 'Move disk 1 from A to C',
        buggyOutput: 'Move disk 1 from A to C',
        description: 'Single disk base movement'
      },
      {
        id: 'tc-r1-07-5',
        input: '3 X Z Y',
        expectedOutput: `Move disk 1 from X to Z
Move disk 2 from X to Y
Move disk 1 from Z to Y
Move disk 3 from X to Z
Move disk 1 from Y to X
Move disk 2 from Y to Z
Move disk 1 from X to Z`,
        buggyOutput: `Move disk 1 from X to Z
Move disk 2 from X to Y
Move disk 3 from X to Z`,
        description: '3 disks custom peg labels X, Z, Y'
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-r1-07-6',
        input: '3 B A C',
        expectedOutput: `Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
Move disk 3 from B to A
Move disk 1 from C to B
Move disk 2 from C to A
Move disk 1 from B to A`,
        buggyOutput: `Move disk 1 from B to A
Move disk 2 from B to C
Move disk 3 from B to A`,
        description: '3 disks permutation B to A via C',
        isHidden: true
      }
    ],
    isPublished: true,
    author: 'BugFest Committee',
    topics: ['Recursion', 'Tower of Hanoi', 'Algorithms']
  }
];
