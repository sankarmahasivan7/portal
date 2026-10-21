export interface RawQuestionData {
  title: string;
  slug: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: { input: string; output: string; explanation?: string }[];
  allowedLanguages: string[];
  courseSlug: string;
  targetLevel: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  testCases: { input: string; expectedOutput: string; isHidden: boolean; weight?: number; order?: number }[];
}

export const C_QUESTIONS: RawQuestionData[] = [
  // --- LEVEL 1 (10 Questions: Fundamentals, Syntax & Standard I/O) ---
  {
    title: 'Sum of Two Numbers',
    slug: 'c-l1-sum-of-two-numbers',
    description: 'Write a program in C that takes two space-separated integers A and B from standard input and prints their sum.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print a single integer: the sum of A and B.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '3 5', output: '8', explanation: '3 + 5 = 8' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '4 7', expectedOutput: '11', isHidden: false, order: 1 },
      { input: '100 250', expectedOutput: '350', isHidden: true, order: 2 },
      { input: '-50 20', expectedOutput: '-30', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Maximum of Three Numbers',
    slug: 'c-l1-maximum-of-three-numbers',
    description: 'Given three integers X, Y, and Z, determine and output the maximum among them.',
    inputFormat: 'Three space-separated integers X, Y, and Z.',
    outputFormat: 'Print the maximum integer value.',
    constraints: '-10^5 <= X, Y, Z <= 10^5',
    examples: [{ input: '12 45 32', output: '45', explanation: '45 is the largest.' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 25 15', expectedOutput: '25', isHidden: false, order: 1 },
      { input: '99 105 4', expectedOutput: '105', isHidden: true, order: 2 },
      { input: '-10 -5 -20', expectedOutput: '-5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Even or Odd',
    slug: 'c-l1-check-even-or-odd',
    description: 'Given an integer N, print "Even" if N is divisible by 2, otherwise print "Odd".',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "Even" or "Odd".',
    constraints: '-10^9 <= N <= 10^9',
    examples: [{ input: '4', output: 'Even' }, { input: '7', output: 'Odd' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '12', expectedOutput: 'Even', isHidden: false, order: 1 },
      { input: '99', expectedOutput: 'Odd', isHidden: true, order: 2 },
      { input: '0', expectedOutput: 'Even', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Factorial Calculation',
    slug: 'c-l1-factorial-calculation',
    description: 'Calculate the factorial of a given non-negative integer N (N!).',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the value of N!.',
    constraints: '0 <= N <= 12',
    examples: [{ input: '5', output: '120', explanation: '5! = 120' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '4', expectedOutput: '24', isHidden: false, order: 1 },
      { input: '0', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '6', expectedOutput: '720', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Count Digits in Integer',
    slug: 'c-l1-count-digits-in-integer',
    description: 'Given a non-negative integer N, count and print the total number of digits in N.',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the number of digits.',
    constraints: '0 <= N <= 10^9',
    examples: [{ input: '5842', output: '4' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '12345', expectedOutput: '5', isHidden: false, order: 1 },
      { input: '7', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '1000000', expectedOutput: '7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Celsius to Fahrenheit',
    slug: 'c-l1-celsius-to-fahrenheit',
    description: 'Given temperature in Celsius as an integer C, convert it to Fahrenheit using formula F = (C * 9 / 5) + 32.',
    inputFormat: 'A single integer C.',
    outputFormat: 'Print the resulting Fahrenheit temperature rounded to integer.',
    constraints: '-100 <= C <= 200',
    examples: [{ input: '0', output: '32' }, { input: '100', output: '212' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '25', expectedOutput: '77', isHidden: false, order: 1 },
      { input: '-40', expectedOutput: '-40', isHidden: true, order: 2 },
      { input: '37', expectedOutput: '98', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Leap Year Checker',
    slug: 'c-l1-leap-year-checker',
    description: 'Determine if a given year Y is a leap year. Print "Leap Year" if it is, otherwise print "Not Leap Year".',
    inputFormat: 'A single integer year Y.',
    outputFormat: 'Print "Leap Year" or "Not Leap Year".',
    constraints: '1000 <= Y <= 9999',
    examples: [{ input: '2024', output: 'Leap Year' }, { input: '1900', output: 'Not Leap Year' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '2000', expectedOutput: 'Leap Year', isHidden: false, order: 1 },
      { input: '2023', expectedOutput: 'Not Leap Year', isHidden: true, order: 2 },
      { input: '2400', expectedOutput: 'Leap Year', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Simple Arithmetic Calculator',
    slug: 'c-l1-simple-calculator',
    description: 'Read two integers A and B followed by an operator (+, -, *). Print the calculated result.',
    inputFormat: 'Integer A, integer B, and character op separated by space.',
    outputFormat: 'Print the integer result.',
    constraints: '-1000 <= A, B <= 1000',
    examples: [{ input: '10 5 +', output: '15' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '20 4 -', expectedOutput: '16', isHidden: false, order: 1 },
      { input: '7 8 *', expectedOutput: '56', isHidden: true, order: 2 },
      { input: '-5 3 +', expectedOutput: '-2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sum of First N Natural Numbers',
    slug: 'c-l1-sum-of-natural-numbers',
    description: 'Given positive integer N, compute the sum of integers from 1 to N using formula or loop.',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the sum.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '5', output: '15' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10', expectedOutput: '55', isHidden: false, order: 1 },
      { input: '100', expectedOutput: '5050', isHidden: true, order: 2 },
      { input: '1', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Swap Two Variables',
    slug: 'c-l1-swap-variables',
    description: 'Read two integers A and B, swap their values, and print the swapped pair separated by space.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print swapped integers B and A separated by space.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '10 20', output: '20 10' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '5 9', expectedOutput: '9 5', isHidden: false, order: 1 },
      { input: '-15 42', expectedOutput: '42 -15', isHidden: true, order: 2 },
      { input: '0 100', expectedOutput: '100 0', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 2 (10 Questions: Loops, 1D & 2D Arrays, Strings) ---
  {
    title: 'Reverse an Array',
    slug: 'c-l2-reverse-array',
    description: 'Given an array of N integers, print the elements in reverse order separated by space.',
    inputFormat: 'First line integer N. Second line N space-separated integers.',
    outputFormat: 'Print the array elements in reverse order.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n1 2 3 4 5', output: '5 4 3 2 1' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n10 20 30 40', expectedOutput: '40 30 20 10', isHidden: false, order: 1 },
      { input: '3\n-5 0 5', expectedOutput: '5 0 -5', isHidden: true, order: 2 },
      { input: '1\n99', expectedOutput: '99', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Second Largest in Array',
    slug: 'c-l2-second-largest',
    description: 'Given an array of N distinct integers, find and print the second largest element.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the second largest element.',
    constraints: '2 <= N <= 1000',
    examples: [{ input: '5\n12 35 1 10 34', output: '34' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n5 1 9 3', expectedOutput: '5', isHidden: false, order: 1 },
      { input: '3\n100 200 50', expectedOutput: '100', isHidden: true, order: 2 },
      { input: '5\n-10 -20 -5 -1 -30', expectedOutput: '-5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Count Vowels and Consonants',
    slug: 'c-l2-count-vowels-consonants',
    description: 'Given a lowercase string S without spaces, print the count of vowels followed by count of consonants separated by space.',
    inputFormat: 'A lowercase string S.',
    outputFormat: 'Two integers: vowel_count consonant_count.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'hello', output: '2 3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'programming', expectedOutput: '3 8', isHidden: false, order: 1 },
      { input: 'aeiou', expectedOutput: '5 0', isHidden: true, order: 2 },
      { input: 'sky', expectedOutput: '0 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Palindrome String Checker',
    slug: 'c-l2-palindrome-string',
    description: 'Check if a given string S is a palindrome (reads same forwards and backwards). Print "Yes" or "No".',
    inputFormat: 'A single string S without spaces.',
    outputFormat: 'Print "Yes" or "No".',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'racecar', output: 'Yes' }, { input: 'hello', output: 'No' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'madam', expectedOutput: 'Yes', isHidden: false, order: 1 },
      { input: 'world', expectedOutput: 'No', isHidden: true, order: 2 },
      { input: 'a', expectedOutput: 'Yes', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Matrix Transpose',
    slug: 'c-l2-matrix-transpose',
    description: 'Given an R x C matrix of integers, output its transpose matrix (C x R).',
    inputFormat: 'First line R and C. Following R lines contain C space-separated integers.',
    outputFormat: 'Print C lines with R integers each.',
    constraints: '1 <= R, C <= 50',
    examples: [{ input: '2 3\n1 2 3\n4 5 6', output: '1 4\n2 5\n3 6' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 2\n1 2\n3 4', expectedOutput: '1 3\n2 4', isHidden: false, order: 1 },
      { input: '3 1\n7\n8\n9', expectedOutput: '7 8 9', isHidden: true, order: 2 },
      { input: '1 3\n4 5 6', expectedOutput: '4\n5\n6', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sum of Matrix Diagonals',
    slug: 'c-l2-matrix-diagonal-sum',
    description: 'Given an N x N square matrix, calculate the sum of its main diagonal elements.',
    inputFormat: 'First line integer N. Next N lines each contain N space-separated integers.',
    outputFormat: 'Print the diagonal sum.',
    constraints: '1 <= N <= 50',
    examples: [{ input: '3\n1 2 3\n4 5 6\n7 8 9', output: '15' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2\n3 5\n2 4', expectedOutput: '7', isHidden: false, order: 1 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 2 },
      { input: '3\n10 0 0\n0 20 0\n0 0 30', expectedOutput: '60', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Character Frequency in String',
    slug: 'c-l2-char-frequency',
    description: 'Given a lowercase string S and a character C, print how many times C appears in S.',
    inputFormat: 'First line string S. Second line character C.',
    outputFormat: 'Print the frequency count.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'banana\na', output: '3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'mississippi\ns', expectedOutput: '4', isHidden: false, order: 1 },
      { input: 'apple\nz', expectedOutput: '0', isHidden: true, order: 2 },
      { input: 'test\nt', expectedOutput: '2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    slug: 'c-l2-remove-duplicates-sorted',
    description: 'Given a sorted array of N integers, print the distinct elements separated by space in order.',
    inputFormat: 'First line N. Second line N sorted space-separated integers.',
    outputFormat: 'Print distinct elements separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '6\n1 1 2 2 3 4', output: '1 2 3 4' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '5\n2 2 2 2 2', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', isHidden: true, order: 2 },
      { input: '7\n0 0 1 1 2 3 3', expectedOutput: '0 1 2 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Linear Search with Index',
    slug: 'c-l2-linear-search',
    description: 'Given an array of N integers and target X, find the 0-based index of first occurrence of X. If not found, print -1.',
    inputFormat: 'First line N and X. Second line N space-separated integers.',
    outputFormat: 'Print the 0-based index or -1.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5 30\n10 20 30 40 50', output: '2' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 7\n1 3 7 9', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '3 99\n10 20 30', expectedOutput: '-1', isHidden: true, order: 2 },
      { input: '5 5\n5 5 5 5 5', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Bubble Sort in Ascending Order',
    slug: 'c-l2-bubble-sort',
    description: 'Sort an array of N integers in non-decreasing order using bubble sort.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the sorted array elements separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 1 4 2 8', output: '1 2 4 5 8' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n3 1 2 0', expectedOutput: '0 1 2 3', isHidden: false, order: 1 },
      { input: '3\n-5 10 -2', expectedOutput: '-5 -2 10', isHidden: true, order: 2 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 3 (10 Questions: Functions, Recursion, Pointers & Structs) ---
  {
    title: 'Recursive Fibonacci Number',
    slug: 'c-l3-recursive-fibonacci',
    description: 'Calculate the Nth Fibonacci number recursively (F(0)=0, F(1)=1, F(N)=F(N-1)+F(N-2)).',
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'Print the Nth Fibonacci number.',
    constraints: '0 <= N <= 25',
    examples: [{ input: '6', output: '8' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: '0', isHidden: false, order: 1 },
      { input: '10', expectedOutput: '55', isHidden: true, order: 2 },
      { input: '15', expectedOutput: '610', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Greatest Common Divisor (GCD)',
    slug: 'c-l3-gcd-euclidean',
    description: 'Compute the Greatest Common Divisor of two positive integers A and B using Euclidean algorithm.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print the GCD.',
    constraints: '1 <= A, B <= 10^9',
    examples: [{ input: '56 98', output: '14' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '48 18', expectedOutput: '6', isHidden: false, order: 1 },
      { input: '101 103', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '250 500', expectedOutput: '250', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Swap Two Integers Using Pointers',
    slug: 'c-l3-pointer-swap',
    description: 'Implement a void function swap(int *a, int *b) and output the swapped values.',
    inputFormat: 'Two integers X and Y.',
    outputFormat: 'Print Y and X separated by space.',
    constraints: '-10^6 <= X, Y <= 10^6',
    examples: [{ input: '15 30', output: '30 15' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 2', expectedOutput: '2 1', isHidden: false, order: 1 },
      { input: '-10 20', expectedOutput: '20 -10', isHidden: true, order: 2 },
      { input: '100 0', expectedOutput: '0 100', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Array Sum via Pointer Arithmetic',
    slug: 'c-l3-pointer-array-sum',
    description: 'Traverse an array of N integers using pointer arithmetic (*(ptr + i)) and print the total sum.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the sum.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 2 3 4', output: '10' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '5\n10 20 30 40 50', expectedOutput: '150', isHidden: false, order: 1 },
      { input: '3\n-5 5 10', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '1\n7', expectedOutput: '7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Power Function (x^n) Recursion',
    slug: 'c-l3-power-recursion',
    description: 'Given base X and non-negative exponent N, compute X^N recursively.',
    inputFormat: 'Two space-separated integers X and N.',
    outputFormat: 'Print the value of X^N.',
    constraints: '-10 <= X <= 10, 0 <= N <= 10',
    examples: [{ input: '2 5', output: '32' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3 3', expectedOutput: '27', isHidden: false, order: 1 },
      { input: '5 0', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '-2 4', expectedOutput: '16', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'String Length using Pointer',
    slug: 'c-l3-strlen-pointer',
    description: 'Calculate the length of string S using a pointer without calling strlen().',
    inputFormat: 'A string S without spaces.',
    outputFormat: 'Print the length of S.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'antigravity', output: '11' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'portal', expectedOutput: '6', isHidden: false, order: 1 },
      { input: 'c', expectedOutput: '1', isHidden: true, order: 2 },
      { input: 'algorithms', expectedOutput: '10', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Prime Number Verification',
    slug: 'c-l3-prime-check',
    description: 'Check whether a positive integer N is prime using an efficient function up to sqrt(N). Print "Prime" or "Not Prime".',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "Prime" or "Not Prime".',
    constraints: '1 <= N <= 10^7',
    examples: [{ input: '17', output: 'Prime' }, { input: '1', output: 'Not Prime' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '29', expectedOutput: 'Prime', isHidden: false, order: 1 },
      { input: '100', expectedOutput: 'Not Prime', isHidden: true, order: 2 },
      { input: '2', expectedOutput: 'Prime', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Structure Student Highest Marks',
    slug: 'c-l3-student-struct',
    description: 'Define struct Student { char name[50]; int marks; }. Given N students, print the name of the student with the highest marks.',
    inputFormat: 'First line N. Next N lines each contain name and marks.',
    outputFormat: 'Print the name of student with maximum marks.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '3\nAlice 85\nBob 92\nCharlie 78', output: 'Bob' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2\nJohn 90\nDoe 95', expectedOutput: 'Doe', isHidden: false, order: 1 },
      { input: '1\nSolo 100', expectedOutput: 'Solo', isHidden: true, order: 2 },
      { input: '3\nA 50\nB 99\nC 80', expectedOutput: 'B', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Tower of Hanoi Moves Count',
    slug: 'c-l3-tower-of-hanoi',
    description: 'Calculate the minimum number of moves required to solve Tower of Hanoi puzzle with N disks (2^N - 1).',
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Print minimum moves.',
    constraints: '1 <= N <= 30',
    examples: [{ input: '3', output: '7' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '4', expectedOutput: '15', isHidden: true, order: 2 },
      { input: '10', expectedOutput: '1023', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Matrix Multiplication',
    slug: 'c-l3-matrix-multiplication',
    description: 'Multiply two 2x2 matrices A and B and print the resulting 2x2 matrix.',
    inputFormat: '4 integers for matrix A (row-wise), followed by 4 integers for matrix B (row-wise).',
    outputFormat: 'Print 2 lines with 2 space-separated integers each.',
    constraints: '-50 <= elements <= 50',
    examples: [{ input: '1 2\n3 4\n5 6\n7 8', output: '19 22\n43 50' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 0\n0 1\n3 4\n5 6', expectedOutput: '3 4\n5 6', isHidden: false, order: 1 },
      { input: '2 0\n0 2\n1 2\n3 4', expectedOutput: '2 4\n6 8', isHidden: true, order: 2 },
      { input: '0 0\n0 0\n1 2\n3 4', expectedOutput: '0 0\n0 0', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 4 (10 Questions: Linear Data Structures: Linked Lists, Stacks, Queues) ---
  {
    title: 'Singly Linked List Insertion & Print',
    slug: 'c-l4-linked-list-insertion',
    description: 'Implement a singly linked list. Insert N integers at the end and print all elements separated by "->".',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print elements separated by "->".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '3\n10 20 30', output: '10->20->30' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n1 2 3 4', expectedOutput: '1->2->3->4', isHidden: false, order: 1 },
      { input: '1\n99', expectedOutput: '99', isHidden: true, order: 2 },
      { input: '3\n5 15 25', expectedOutput: '5->15->25', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Reverse a Linked List',
    slug: 'c-l4-reverse-linked-list',
    description: 'Reverse a singly linked list in-place and print the new list elements separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print reversed elements separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '4\n1 2 3 4', output: '4 3 2 1' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '30 20 10', isHidden: false, order: 1 },
      { input: '1\n5', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '5\n100 200 300 400 500', expectedOutput: '500 400 300 200 100', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Valid Parentheses Checker using Stack',
    slug: 'c-l4-valid-parentheses-stack',
    description: 'Given a string containing only brackets "()[]{}", determine if input string is valid. Print "Valid" or "Invalid".',
    inputFormat: 'A single string of brackets.',
    outputFormat: 'Print "Valid" or "Invalid".',
    constraints: '1 <= length <= 1000',
    examples: [{ input: '()[]{}', output: 'Valid' }, { input: '(]', output: 'Invalid' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '{[()]}', expectedOutput: 'Valid', isHidden: false, order: 1 },
      { input: '([)]', expectedOutput: 'Invalid', isHidden: true, order: 2 },
      { input: '((()', expectedOutput: 'Invalid', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Stack Implementation via Array',
    slug: 'c-l4-stack-array',
    description: 'Process Q operations on a stack: 1 X (push X), 2 (pop and print popped value, or -1 if empty).',
    inputFormat: 'First line Q. Next Q lines each contain an operation.',
    outputFormat: 'Print output of each pop operation on a new line.',
    constraints: '1 <= Q <= 1000',
    examples: [{ input: '4\n1 10\n1 20\n2\n2', output: '20\n10' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n2\n1 5\n2', expectedOutput: '-1\n5', isHidden: false, order: 1 },
      { input: '4\n1 1\n1 2\n1 3\n2', expectedOutput: '3', isHidden: true, order: 2 },
      { input: '2\n2\n2', expectedOutput: '-1\n-1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Queue Implementation via Array',
    slug: 'c-l4-queue-array',
    description: 'Process Q operations on a queue: 1 X (enqueue X), 2 (dequeue and print dequeued value, or -1 if empty).',
    inputFormat: 'First line Q. Next Q lines contain operations.',
    outputFormat: 'Print output of each dequeue on a new line.',
    constraints: '1 <= Q <= 1000',
    examples: [{ input: '4\n1 10\n1 20\n2\n2', output: '10\n20' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 5\n2\n2', expectedOutput: '5\n-1', isHidden: false, order: 1 },
      { input: '4\n1 1\n1 2\n2\n1 3', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '2\n2\n2', expectedOutput: '-1\n-1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Evaluate Postfix Expression',
    slug: 'c-l4-postfix-evaluation',
    description: 'Evaluate a postfix expression consisting of single-digit operands and operators (+, -, *). Print result.',
    inputFormat: 'A string representing the postfix expression without spaces.',
    outputFormat: 'Print the evaluated integer result.',
    constraints: '1 <= length <= 50',
    examples: [{ input: '231*+9-', output: '-4' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '45+2*', expectedOutput: '18', isHidden: false, order: 1 },
      { input: '53-2*', expectedOutput: '4', isHidden: true, order: 2 },
      { input: '82/', expectedOutput: '4', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Merge Two Sorted Linked Lists',
    slug: 'c-l4-merge-sorted-lists',
    description: 'Given two sorted lists of size N and M, merge them into one sorted list and print elements separated by space.',
    inputFormat: 'First line N and M. Second line N integers. Third line M integers.',
    outputFormat: 'Print merged sorted elements separated by space.',
    constraints: '1 <= N, M <= 500',
    examples: [{ input: '3 3\n1 3 5\n2 4 6', output: '1 2 3 4 5 6' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 2\n5 10\n2 8', expectedOutput: '2 5 8 10', isHidden: false, order: 1 },
      { input: '1 2\n1\n2 3', expectedOutput: '1 2 3', isHidden: true, order: 2 },
      { input: '3 1\n10 20 30\n5', expectedOutput: '5 10 20 30', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Next Greater Element',
    slug: 'c-l4-next-greater-element',
    description: 'For each element in an array of N integers, find next greater element to its right. If none, print -1.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print next greater elements separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n4 5 2 25', output: '5 25 25 -1' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n13 7 6 12', expectedOutput: '-1 12 12 -1', isHidden: false, order: 1 },
      { input: '3\n1 2 3', expectedOutput: '2 3 -1', isHidden: true, order: 2 },
      { input: '3\n3 2 1', expectedOutput: '-1 -1 -1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Middle Element of Linked List',
    slug: 'c-l4-middle-linked-list',
    description: 'Find the middle element of a singly linked list. If two middle nodes, print the second one.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the middle element value.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n1 2 3 4 5', output: '3' }, { input: '6\n1 2 3 4 5 6', output: '4' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '20', isHidden: false, order: 1 },
      { input: '1\n99', expectedOutput: '99', isHidden: true, order: 2 },
      { input: '4\n2 4 6 8', expectedOutput: '6', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Circular Queue Count',
    slug: 'c-l4-circular-queue',
    description: 'Implement a circular queue of capacity K. Count elements remaining after a series of enqueues and dequeues.',
    inputFormat: 'First line K and Q. Next Q lines contain 1 X (enqueue) or 2 (dequeue).',
    outputFormat: 'Print the number of elements remaining in the queue.',
    constraints: '1 <= K, Q <= 100',
    examples: [{ input: '3 4\n1 5\n1 10\n2\n1 15', output: '2' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 3\n1 1\n1 2\n2', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '5 2\n1 10\n1 20', expectedOutput: '2', isHidden: true, order: 2 },
      { input: '3 2\n2\n2', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 5 (10 Questions: Trees, Binary Search Trees & Heaps) ---
  {
    title: 'Inorder Traversal of Binary Tree',
    slug: 'c-l5-bst-inorder',
    description: 'Construct a Binary Search Tree (BST) by inserting N integers, then output its inorder traversal.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the inorder traversal elements separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '2 3 4 5 7' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n10 5 15 2', expectedOutput: '2 5 10 15', isHidden: false, order: 1 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 2 },
      { input: '3\n20 10 30', expectedOutput: '10 20 30', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Height of a Binary Search Tree',
    slug: 'c-l5-bst-height',
    description: 'Insert N integers into a BST and calculate the height of the tree (number of nodes along the longest path).',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the height as an integer.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '3\n2 1 3', expectedOutput: '2', isHidden: true, order: 2 },
      { input: '1\n10', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Search in Binary Search Tree',
    slug: 'c-l5-search-bst',
    description: 'Insert N integers into a BST. Given key K, print "Found" if K exists in the BST, otherwise print "Not Found".',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print "Found" or "Not Found".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5 4\n5 3 7 2 4', output: 'Found' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4 9\n10 5 15 2', expectedOutput: 'Not Found', isHidden: false, order: 1 },
      { input: '3 30\n20 10 30', expectedOutput: 'Found', isHidden: true, order: 2 },
      { input: '1 5\n5', expectedOutput: 'Found', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Lowest Common Ancestor in BST',
    slug: 'c-l5-lca-bst',
    description: 'Given N elements inserted into a BST, find the Lowest Common Ancestor (LCA) of two distinct keys N1 and N2.',
    inputFormat: 'First line N, N1, and N2. Second line N space-separated integers.',
    outputFormat: 'Print the LCA node value.',
    constraints: '2 <= N <= 500',
    examples: [{ input: '6 2 8\n6 2 8 0 4 7', output: '6' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '6 2 4\n6 2 8 0 4 7', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '3 1 3\n2 1 3', expectedOutput: '2', isHidden: true, order: 2 },
      { input: '4 5 15\n10 5 15 2', expectedOutput: '10', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Count Leaf Nodes in BST',
    slug: 'c-l5-count-leaves-bst',
    description: 'Insert N integers into a BST and count how many leaf nodes (nodes with 0 children) exist in the tree.',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print the leaf node count.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 1 3', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '1\n10', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '4\n10 20 30 40', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Max Heap Insertion & Root',
    slug: 'c-l5-max-heap-root',
    description: 'Insert N integers into a Max Heap and print the maximum element (the root of the heap).',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the maximum element.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n3 10 12 8 2', output: '12' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n5 9 1 3', expectedOutput: '9', isHidden: false, order: 1 },
      { input: '1\n100', expectedOutput: '100', isHidden: true, order: 2 },
      { input: '3\n-5 -2 -10', expectedOutput: '-2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Valid BST',
    slug: 'c-l5-validate-bst',
    description: 'Given the preorder traversal of a binary tree, determine if it represents a valid BST. Print "Valid" or "Invalid".',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print "Valid" or "Invalid".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '3\n2 1 3', output: 'Valid' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n1 3 2', expectedOutput: 'Valid', isHidden: false, order: 1 },
      { input: '3\n5 7 6', expectedOutput: 'Valid', isHidden: true, order: 2 },
      { input: '4\n40 30 35 80', expectedOutput: 'Valid', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Kth Smallest Element in BST',
    slug: 'c-l5-kth-smallest-bst',
    description: 'Insert N integers into a BST and find the K-th smallest element (1-based index).',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print the K-th smallest value.',
    constraints: '1 <= K <= N <= 500',
    examples: [{ input: '5 3\n5 3 7 2 4', output: '4' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4 1\n10 5 15 2', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '3 3\n20 10 30', expectedOutput: '30', isHidden: true, order: 2 },
      { input: '5 5\n1 2 3 4 5', expectedOutput: '5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sum of All Nodes in Binary Tree',
    slug: 'c-l5-tree-node-sum',
    description: 'Insert N integers into a BST and compute the sum of all values stored across all nodes.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the sum.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '4\n1 2 3 4', output: '10' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '60', isHidden: false, order: 1 },
      { input: '1\n5', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '5\n5 3 7 2 4', expectedOutput: '21', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Heap Sort Ascending',
    slug: 'c-l5-heap-sort',
    description: 'Implement Heap Sort to sort an array of N integers in ascending order.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print sorted array elements separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n12 11 13 5 6', output: '5 6 11 12 13' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n4 10 3 5', expectedOutput: '3 4 5 10', isHidden: false, order: 1 },
      { input: '3\n9 1 5', expectedOutput: '1 5 9', isHidden: true, order: 2 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 6 (10 Questions: Graph Algorithms, Dynamic Programming & Advanced Algorithms) ---
  {
    title: 'Breadth-First Search (BFS) Traversal',
    slug: 'c-l6-bfs-traversal',
    description: 'Given an undirected graph with V vertices (0 to V-1) and E edges, print BFS traversal starting from vertex 0.',
    inputFormat: 'First line V and E. Next E lines each contain two integers u and v.',
    outputFormat: 'Print BFS traversal nodes separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 4\n0 1\n0 2\n1 2\n2 3', output: '0 1 2 3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n0 1\n0 2', expectedOutput: '0 1 2', isHidden: false, order: 1 },
      { input: '4 3\n0 1\n1 2\n2 3', expectedOutput: '0 1 2 3', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Depth-First Search (DFS) Traversal',
    slug: 'c-l6-dfs-traversal',
    description: 'Given an undirected graph with V vertices and E edges, print DFS traversal starting from vertex 0 (visiting lowest neighbor first).',
    inputFormat: 'First line V and E. Next E lines each contain edge (u, v).',
    outputFormat: 'Print DFS traversal nodes separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 3\n0 1\n0 2\n1 3', output: '0 1 3 2' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n0 1\n1 2', expectedOutput: '0 1 2', isHidden: false, order: 1 },
      { input: '4 4\n0 1\n0 2\n1 3\n2 3', expectedOutput: '0 1 3 2', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: '0/1 Knapsack Problem (DP)',
    slug: 'c-l6-01-knapsack',
    description: 'Given N items with values V[i] and weights W[i], find maximum value that can be put in a knapsack of capacity C.',
    inputFormat: 'First line N and C. Second line N values. Third line N weights.',
    outputFormat: 'Print maximum attainable value.',
    constraints: '1 <= N <= 100, 1 <= C <= 500',
    examples: [{ input: '3 50\n60 100 120\n10 20 30', output: '220' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 4\n1 2 3\n4 5 1', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '2 3\n10 20\n3 4', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '1 10\n50\n5', expectedOutput: '50', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Longest Common Subsequence (LCS)',
    slug: 'c-l6-lcs-problem',
    description: 'Given two strings S1 and S2, find the length of their longest common subsequence.',
    inputFormat: 'Two lines, S1 and S2.',
    outputFormat: 'Print the length of LCS.',
    constraints: '1 <= |S1|, |S2| <= 200',
    examples: [{ input: 'AGGTAB\nGXTXAYB', output: '4' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: 'ABCDGH\nAEDFHR', expectedOutput: '3', isHidden: false, order: 1 },
      { input: 'ABC\nDEF', expectedOutput: '0', isHidden: true, order: 2 },
      { input: 'SAME\nSAME', expectedOutput: '4', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Coin Change Problem (Min Coins)',
    slug: 'c-l6-coin-change-min',
    description: 'Given N coin denominations and target amount V, find minimum number of coins needed to make amount V. If impossible, print -1.',
    inputFormat: 'First line N and V. Second line N coin denominations.',
    outputFormat: 'Print minimum coins or -1.',
    constraints: '1 <= N <= 50, 1 <= V <= 1000',
    examples: [{ input: '3 11\n1 2 5', output: '3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '1 2\n3', expectedOutput: '-1', isHidden: false, order: 1 },
      { input: '4 30\n1 5 10 25', expectedOutput: '2', isHidden: true, order: 2 },
      { input: '3 0\n1 2 5', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Maximum Subarray Sum (Kadane)',
    slug: 'c-l6-kadane-max-subarray',
    description: 'Find the contiguous subarray with the largest sum in an array of N integers.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the maximum subarray sum.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '8\n-2 -3 4 -1 -2 1 5 -3', output: '7' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1', isHidden: false, order: 1 },
      { input: '3\n1 2 3', expectedOutput: '6', isHidden: true, order: 2 },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Dijkstra Shortest Path Matrix',
    slug: 'c-l6-dijkstra-shortest-path',
    description: 'Given V vertices and an adjacency matrix of edge weights (0 means no edge), find shortest path distance from vertex 0 to vertex V-1.',
    inputFormat: 'First line V. Next V lines contain V integers each.',
    outputFormat: 'Print the shortest distance.',
    constraints: '2 <= V <= 30',
    examples: [{ input: '3\n0 4 2\n4 0 1\n2 1 0', output: '2' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n0 1 4 0\n1 0 2 5\n4 2 0 1\n0 5 1 0', expectedOutput: '4', isHidden: false, order: 1 },
      { input: '2\n0 7\n7 0', expectedOutput: '7', isHidden: true, order: 2 },
      { input: '3\n0 10 0\n10 0 5\n0 5 0', expectedOutput: '15', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Detect Cycle in Directed Graph',
    slug: 'c-l6-detect-cycle-directed',
    description: 'Given a directed graph with V vertices and E edges, determine if it contains a cycle. Print "Cycle" or "No Cycle".',
    inputFormat: 'First line V and E. Next E lines contain directed edge (u, v).',
    outputFormat: 'Print "Cycle" or "No Cycle".',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 4\n0 1\n1 2\n2 3\n3 1', output: 'Cycle' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n0 1\n1 2', expectedOutput: 'No Cycle', isHidden: false, order: 1 },
      { input: '2 2\n0 1\n1 0', expectedOutput: 'Cycle', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: 'No Cycle', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Edit Distance (Levenshtein)',
    slug: 'c-l6-edit-distance',
    description: 'Given two strings S1 and S2, find minimum operations (insert, delete, replace) required to convert S1 to S2.',
    inputFormat: 'Two lines S1 and S2.',
    outputFormat: 'Print minimum operations count.',
    constraints: '0 <= |S1|, |S2| <= 100',
    examples: [{ input: 'horse\nros', output: '3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: 'intention\nexecution', expectedOutput: '5', isHidden: false, order: 1 },
      { input: 'cat\nhat', expectedOutput: '1', isHidden: true, order: 2 },
      { input: 'abc\nabc', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Topological Sort Verification',
    slug: 'c-l6-topological-sort',
    description: 'Given a DAG with V vertices and E edges, output a valid topological ordering of vertices separated by space.',
    inputFormat: 'First line V and E. Next E lines contain directed edge (u, v).',
    outputFormat: 'Print vertices in topological order separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 3\n0 1\n1 2\n2 3', output: '0 1 2 3' }],
    allowedLanguages: ['c'],
    courseSlug: 'c',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n0 1\n0 2', expectedOutput: '0 1 2', isHidden: false, order: 1 },
      { input: '2 1\n1 0', expectedOutput: '1 0', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  }
];

