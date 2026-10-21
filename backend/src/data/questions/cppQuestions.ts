import { RawQuestionData } from './cQuestions';

export const CPP_QUESTIONS: RawQuestionData[] = [
  // --- LEVEL 1 (10 Questions: C++ Syntax, Stream I/O cin/cout, Operators, Conditionals) ---
  {
    title: 'C++ Stream Addition',
    slug: 'cpp-l1-stream-addition',
    description: 'Read two integers A and B using std::cin and print their sum using std::cout.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print the sum.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '12 8', output: '20' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 30', expectedOutput: '40', isHidden: false, order: 1 },
      { input: '-10 10', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '999 1', expectedOutput: '1000', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Absolute Value of Integer',
    slug: 'cpp-l1-absolute-value',
    description: 'Given an integer N, compute its absolute value using std::abs or conditional statement.',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print |N|.',
    constraints: '-10^9 <= N <= 10^9',
    examples: [{ input: '-45', output: '45' }, { input: '12', output: '12' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '-100', expectedOutput: '100', isHidden: false, order: 1 },
      { input: '0', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '55', expectedOutput: '55', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Vowel or Consonant',
    slug: 'cpp-l1-vowel-or-consonant',
    description: 'Given a lowercase English character ch, print "Vowel" if it is (a, e, i, o, u), otherwise print "Consonant".',
    inputFormat: 'A single character ch.',
    outputFormat: 'Print "Vowel" or "Consonant".',
    constraints: 'ch is a lowercase English letter.',
    examples: [{ input: 'e', output: 'Vowel' }, { input: 'b', output: 'Consonant' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: 'a', expectedOutput: 'Vowel', isHidden: false, order: 1 },
      { input: 'z', expectedOutput: 'Consonant', isHidden: true, order: 2 },
      { input: 'u', expectedOutput: 'Vowel', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Multiplication Table of N',
    slug: 'cpp-l1-multiplication-table',
    description: 'Print the first 5 multiples of N separated by spaces (N*1, N*2, N*3, N*4, N*5).',
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Five space-separated integers.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5', output: '5 10 15 20 25' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '3', expectedOutput: '3 6 9 12 15', isHidden: false, order: 1 },
      { input: '10', expectedOutput: '10 20 30 40 50', isHidden: true, order: 2 },
      { input: '1', expectedOutput: '1 2 3 4 5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Area and Perimeter of Rectangle',
    slug: 'cpp-l1-rectangle-area-perimeter',
    description: 'Given length L and width W of a rectangle, print Area and Perimeter separated by space.',
    inputFormat: 'Two space-separated integers L and W.',
    outputFormat: 'Print Area Perimeter.',
    constraints: '1 <= L, W <= 10^4',
    examples: [{ input: '4 5', output: '20 18' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 2', expectedOutput: '20 24', isHidden: false, order: 1 },
      { input: '7 7', expectedOutput: '49 28', isHidden: true, order: 2 },
      { input: '1 1', expectedOutput: '1 4', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Minimum of Three Integers',
    slug: 'cpp-l1-min-of-three',
    description: 'Given three integers A, B, and C, output the minimum of the three using std::min.',
    inputFormat: 'Three space-separated integers A, B, C.',
    outputFormat: 'Print the minimum integer.',
    constraints: '-10^6 <= A, B, C <= 10^6',
    examples: [{ input: '15 4 28', output: '4' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 20 30', expectedOutput: '10', isHidden: false, order: 1 },
      { input: '-5 -1 -10', expectedOutput: '-10', isHidden: true, order: 2 },
      { input: '7 7 7', expectedOutput: '7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Bitwise AND, OR, XOR',
    slug: 'cpp-l1-bitwise-operators',
    description: 'Given two integers A and B, print (A & B), (A | B), and (A ^ B) on a single line separated by space.',
    inputFormat: 'Two space-separated non-negative integers A and B.',
    outputFormat: 'Print three integers separated by space.',
    constraints: '0 <= A, B <= 1000',
    examples: [{ input: '5 3', output: '1 7 6' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '4 2', expectedOutput: '0 6 6', isHidden: false, order: 1 },
      { input: '7 7', expectedOutput: '7 7 0', isHidden: true, order: 2 },
      { input: '0 5', expectedOutput: '0 5 5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Number of Set Bits (Hamming Weight)',
    slug: 'cpp-l1-set-bits-count',
    description: 'Count the number of set bits (1s in binary representation) of a non-negative integer N.',
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'Print the count of 1 bits.',
    constraints: '0 <= N <= 10^9',
    examples: [{ input: '11', output: '3', explanation: '11 in binary is 1011 (3 ones).' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '7', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '16', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '0', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Power of Two',
    slug: 'cpp-l1-power-of-two',
    description: 'Determine if an integer N is a power of two. Print "True" if it is, otherwise "False".',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "True" or "False".',
    constraints: '-10^9 <= N <= 10^9',
    examples: [{ input: '16', output: 'True' }, { input: '18', output: 'False' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '1', expectedOutput: 'True', isHidden: false, order: 1 },
      { input: '0', expectedOutput: 'False', isHidden: true, order: 2 },
      { input: '64', expectedOutput: 'True', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Quotient and Remainder',
    slug: 'cpp-l1-quotient-remainder',
    description: 'Given dividend A and divisor B, print quotient followed by remainder separated by space.',
    inputFormat: 'Two positive integers A and B.',
    outputFormat: 'Print quotient remainder.',
    constraints: '1 <= A, B <= 10^6',
    examples: [{ input: '20 3', output: '6 2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '15 5', expectedOutput: '3 0', isHidden: false, order: 1 },
      { input: '7 10', expectedOutput: '0 7', isHidden: true, order: 2 },
      { input: '100 9', expectedOutput: '11 1', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 2 (10 Questions: Loops, Vectors & std::string) ---
  {
    title: 'Vector Sum and Average',
    slug: 'cpp-l2-vector-sum-average',
    description: 'Given N integers stored in std::vector, print their sum followed by integer average.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print sum average.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n10 20 30 40', output: '100 25' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n5 5 5', expectedOutput: '15 5', isHidden: false, order: 1 },
      { input: '2\n10 15', expectedOutput: '25 12', isHidden: true, order: 2 },
      { input: '1\n42', expectedOutput: '42 42', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Reverse a std::string',
    slug: 'cpp-l2-reverse-string',
    description: 'Given a string S, reverse it using std::reverse and print the result.',
    inputFormat: 'A single string S without spaces.',
    outputFormat: 'Print reversed string.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'college', output: 'egelloc' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'antigravity', expectedOutput: 'ytivargitna', isHidden: false, order: 1 },
      { input: 'radar', expectedOutput: 'radar', isHidden: true, order: 2 },
      { input: 'x', expectedOutput: 'x', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Rotate Vector Left by K Steps',
    slug: 'cpp-l2-rotate-vector-left',
    description: 'Rotate a vector of N integers to the left by K positions and print elements separated by space.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print rotated array elements separated by space.',
    constraints: '1 <= N <= 1000, 0 <= K <= 1000',
    examples: [{ input: '5 2\n1 2 3 4 5', output: '3 4 5 1 2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 1\n10 20 30 40', expectedOutput: '20 30 40 10', isHidden: false, order: 1 },
      { input: '3 3\n5 6 7', expectedOutput: '5 6 7', isHidden: true, order: 2 },
      { input: '3 0\n1 2 3', expectedOutput: '1 2 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Merge Two Sorted Vectors',
    slug: 'cpp-l2-merge-sorted-vectors',
    description: 'Given two sorted vectors of size N and M, merge them into one sorted vector and print separated by space.',
    inputFormat: 'First line N and M. Second line N integers. Third line M integers.',
    outputFormat: 'Print merged sorted elements.',
    constraints: '1 <= N, M <= 500',
    examples: [{ input: '3 3\n1 4 7\n2 5 8', output: '1 2 4 5 7 8' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 2\n10 30\n20 40', expectedOutput: '10 20 30 40', isHidden: false, order: 1 },
      { input: '1 2\n5\n1 9', expectedOutput: '1 5 9', isHidden: true, order: 2 },
      { input: '3 1\n1 2 3\n0', expectedOutput: '0 1 2 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Anagram of Two Strings',
    slug: 'cpp-l2-anagram-check',
    description: 'Determine if two lowercase strings S1 and S2 are anagrams. Print "Anagram" or "Not Anagram".',
    inputFormat: 'Two space-separated strings S1 and S2.',
    outputFormat: 'Print "Anagram" or "Not Anagram".',
    constraints: '1 <= |S1|, |S2| <= 1000',
    examples: [{ input: 'listen silent', output: 'Anagram' }, { input: 'apple pale', output: 'Not Anagram' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'triangle integral', expectedOutput: 'Anagram', isHidden: false, order: 1 },
      { input: 'cat rat', expectedOutput: 'Not Anagram', isHidden: true, order: 2 },
      { input: 'a a', expectedOutput: 'Anagram', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Find Missing Number 1 to N',
    slug: 'cpp-l2-find-missing-number',
    description: 'Given an array of N-1 distinct integers in range 1 to N, find the missing integer.',
    inputFormat: 'First line N. Second line N-1 space-separated integers.',
    outputFormat: 'Print the missing integer.',
    constraints: '2 <= N <= 10^5',
    examples: [{ input: '5\n1 2 4 5', output: '3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n2 3 4', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '3\n1 2', expectedOutput: '3', isHidden: true, order: 2 },
      { input: '6\n1 3 4 5 6', expectedOutput: '2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Matrix Row with Maximum Sum',
    slug: 'cpp-l2-matrix-max-row-sum',
    description: 'Given an R x C matrix, output the 0-based index of the row with the largest sum of elements.',
    inputFormat: 'First line R and C. Following R lines contain C integers each.',
    outputFormat: 'Print the 0-based row index.',
    constraints: '1 <= R, C <= 50',
    examples: [{ input: '3 2\n1 2\n5 6\n3 4', output: '1' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 2\n10 20\n5 5', expectedOutput: '0', isHidden: false, order: 1 },
      { input: '3 1\n5\n15\n10', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '1 3\n1 2 3', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Substring Search in C++',
    slug: 'cpp-l2-substring-search',
    description: 'Given main string S and substring P, print the 0-based starting index of P in S, or -1 if not found.',
    inputFormat: 'Two space-separated strings S and P.',
    outputFormat: 'Print 0-based index or -1.',
    constraints: '1 <= |S|, |P| <= 1000',
    examples: [{ input: 'assessment sess', output: '2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'coding ding', expectedOutput: '3', isHidden: false, order: 1 },
      { input: 'hello world', expectedOutput: '-1', isHidden: true, order: 2 },
      { input: 'banana an', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Remove Element from Vector',
    slug: 'cpp-l2-remove-element-vector',
    description: 'Given vector of N integers and value X, remove all occurrences of X and print remaining elements separated by space.',
    inputFormat: 'First line N and X. Second line N space-separated integers.',
    outputFormat: 'Print remaining elements separated by space (or empty line).',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5 3\n3 2 2 3 5', output: '2 2 5' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 1\n1 2 3 1', expectedOutput: '2 3', isHidden: false, order: 1 },
      { input: '3 9\n9 9 9', expectedOutput: '', isHidden: true, order: 2 },
      { input: '3 5\n1 2 3', expectedOutput: '1 2 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Count Words in Sentence',
    slug: 'cpp-l2-count-words-sentence',
    description: 'Given a line of text, count the total number of whitespace-separated words.',
    inputFormat: 'A single line containing words separated by single spaces.',
    outputFormat: 'Print word count.',
    constraints: '1 <= length <= 1000',
    examples: [{ input: 'antigravity college assessment portal', output: '4' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'hello world', expectedOutput: '2', isHidden: false, order: 1 },
      { input: 'one', expectedOutput: '1', isHidden: true, order: 2 },
      { input: 'the quick brown fox jumps', expectedOutput: '5', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 3 (10 Questions: OOP, Classes, Constructors & Operator Overloading) ---
  {
    title: 'Complex Number Class Operator+',
    slug: 'cpp-l3-complex-operator-plus',
    description: 'Define class Complex { int real, imag; } with operator+ overloaded. Add two complex numbers and print in format "a+bi" or "a-bi".',
    inputFormat: '4 integers: r1 i1 r2 i2.',
    outputFormat: 'Print sum in format "a+bi" (or "a-bi" if negative).',
    constraints: '-100 <= r1, i1, r2, i2 <= 100',
    examples: [{ input: '2 3 4 5', output: '6+8i' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 -2 3 4', expectedOutput: '4+2i', isHidden: false, order: 1 },
      { input: '5 2 -3 -5', expectedOutput: '2-3i', isHidden: true, order: 2 },
      { input: '0 0 0 0', expectedOutput: '0+0i', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Bank Account Class Transaction',
    slug: 'cpp-l3-bank-account-class',
    description: 'Class BankAccount starts with balance 0. Process Q commands: "D X" (deposit X), "W X" (withdraw X if balance >= X). Print final balance.',
    inputFormat: 'First line Q. Next Q lines contain command.',
    outputFormat: 'Print final integer balance.',
    constraints: '1 <= Q <= 100',
    examples: [{ input: '3\nD 100\nW 30\nD 50', output: '120' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2\nD 50\nW 60', expectedOutput: '50', isHidden: false, order: 1 },
      { input: '1\nD 500', expectedOutput: '500', isHidden: true, order: 2 },
      { input: '3\nD 200\nW 100\nW 50', expectedOutput: '50', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Rectangle Class IsSquare Check',
    slug: 'cpp-l3-rectangle-issquare',
    description: 'Create Rectangle class with length and breadth. Print Area and "Square" if length == breadth, else "Rectangle".',
    inputFormat: 'Two integers L and B.',
    outputFormat: 'Print Area Type (e.g. "25 Square").',
    constraints: '1 <= L, B <= 1000',
    examples: [{ input: '5 5', output: '25 Square' }, { input: '4 6', output: '24 Rectangle' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '10 10', expectedOutput: '100 Square', isHidden: false, order: 1 },
      { input: '2 8', expectedOutput: '16 Rectangle', isHidden: true, order: 2 },
      { input: '1 1', expectedOutput: '1 Square', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Time Class Addition',
    slug: 'cpp-l3-time-addition',
    description: 'Add two times represented by (hours, minutes). Normalize minutes >= 60 into hours. Print "H M".',
    inputFormat: '4 integers: h1 m1 h2 m2.',
    outputFormat: 'Print total hours and minutes separated by space.',
    constraints: '0 <= h1, h2 <= 23, 0 <= m1, m2 <= 59',
    examples: [{ input: '2 45 1 30', output: '4 15' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 10 2 20', expectedOutput: '3 30', isHidden: false, order: 1 },
      { input: '0 50 0 10', expectedOutput: '1 0', isHidden: true, order: 2 },
      { input: '5 40 3 40', expectedOutput: '9 20', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Fraction Simplification Class',
    slug: 'cpp-l3-fraction-simplification',
    description: 'Given numerator N and denominator D, simplify fraction N/D using GCD and print "N/D" (or integer if D=1).',
    inputFormat: 'Two integers N and D.',
    outputFormat: 'Print simplified fraction.',
    constraints: '1 <= N, D <= 10^5',
    examples: [{ input: '6 8', output: '3/4' }, { input: '10 5', output: '2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '14 21', expectedOutput: '2/3', isHidden: false, order: 1 },
      { input: '7 7', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '5 10', expectedOutput: '1/2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Point2D Distance Squared',
    slug: 'cpp-l3-point2d-distance',
    description: 'Create Point2D class with (x, y). Calculate squared Euclidean distance between two points: (x2-x1)^2 + (y2-y1)^2.',
    inputFormat: '4 integers: x1 y1 x2 y2.',
    outputFormat: 'Print squared distance integer.',
    constraints: '-1000 <= coordinates <= 1000',
    examples: [{ input: '0 0 3 4', output: '25' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 1 4 5', expectedOutput: '25', isHidden: false, order: 1 },
      { input: '0 0 0 5', expectedOutput: '25', isHidden: true, order: 2 },
      { input: '-2 -2 2 2', expectedOutput: '32', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Student Grade Inheritance Class',
    slug: 'cpp-l3-student-inheritance',
    description: 'Base class Person has name. Derived class Student has marks. Given student name and marks, print "Name Grade" (>=90: A, >=75: B, >=50: C, else F).',
    inputFormat: 'String name and integer marks.',
    outputFormat: 'Print Name Grade.',
    constraints: '0 <= marks <= 100',
    examples: [{ input: 'Sarah 95', output: 'Sarah A' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'Alex 80', expectedOutput: 'Alex B', isHidden: false, order: 1 },
      { input: 'Dan 45', expectedOutput: 'Dan F', isHidden: true, order: 2 },
      { input: 'Mia 60', expectedOutput: 'Mia C', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Operator Overloading Matrix Addition',
    slug: 'cpp-l3-matrix-operator-plus',
    description: 'Define 2x2 Matrix class with operator+ overloaded. Add two matrices and print result.',
    inputFormat: '4 integers for matrix 1, followed by 4 integers for matrix 2.',
    outputFormat: 'Print 2 lines of 2 integers each.',
    constraints: '-100 <= values <= 100',
    examples: [{ input: '1 2 3 4\n5 6 7 8', output: '6 8\n10 12' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 0 0 1\n2 3 4 5', expectedOutput: '3 3\n4 6', isHidden: false, order: 1 },
      { input: '0 0 0 0\n1 1 1 1', expectedOutput: '1 1\n1 1', isHidden: true, order: 2 },
      { input: '-1 -2 -3 -4\n1 2 3 4', expectedOutput: '0 0\n0 0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Safe Array Wrapper with Bounds Checking',
    slug: 'cpp-l3-safe-array',
    description: 'Class SafeArray holds N integers. Query index i: if 0 <= i < N print element, else print "OutOfBounds".',
    inputFormat: 'First line N and Q. Second line N integers. Next Q lines contain index i.',
    outputFormat: 'Print query results on separate lines.',
    constraints: '1 <= N, Q <= 100',
    examples: [{ input: '3 2\n10 20 30\n1\n5', output: '20\nOutOfBounds' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 2\n5 15\n0\n-1', expectedOutput: '5\nOutOfBounds', isHidden: false, order: 1 },
      { input: '1 1\n42\n0', expectedOutput: '42', isHidden: true, order: 2 },
      { input: '3 1\n1 2 3\n3', expectedOutput: 'OutOfBounds', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Static Counter in C++ Class',
    slug: 'cpp-l3-static-counter',
    description: 'Class Item tracks total created objects using a static member variable. Given N, simulate creating N objects and print static count.',
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Print the static count.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '5', output: '5' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '12', expectedOutput: '12', isHidden: false, order: 1 },
      { input: '100', expectedOutput: '100', isHidden: true, order: 2 },
      { input: '1', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 4 (10 Questions: STL Containers: vector, list, stack, queue, map) ---
  {
    title: 'Balanced Parentheses with std::stack',
    slug: 'cpp-l4-balanced-brackets-stack',
    description: 'Check if brackets string is balanced using std::stack. Print "YES" or "NO".',
    inputFormat: 'A string of brackets ()[]{}.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= length <= 1000',
    examples: [{ input: '{[()]}', output: 'YES' }, { input: '{[(])}', output: 'NO' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '()', expectedOutput: 'YES', isHidden: false, order: 1 },
      { input: '({', expectedOutput: 'NO', isHidden: true, order: 2 },
      { input: '[]{}()', expectedOutput: 'YES', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Frequency Counter using std::map',
    slug: 'cpp-l4-map-frequency-counter',
    description: 'Given an array of N integers, print each unique integer and its frequency count in sorted order of integers.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print "key: count" for each unique integer in ascending order.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n2 3 2 4 3', output: '2: 2\n3: 2\n4: 1' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 1 1', expectedOutput: '1: 3', isHidden: false, order: 1 },
      { input: '4\n5 2 5 2', expectedOutput: '2: 2\n5: 2', isHidden: true, order: 2 },
      { input: '1\n10', expectedOutput: '10: 1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'First Unique Character (std::unordered_map)',
    slug: 'cpp-l4-first-unique-char',
    description: 'Find first non-repeating character in a lowercase string S. Print character or "-1" if none.',
    inputFormat: 'A string S without spaces.',
    outputFormat: 'Print character or -1.',
    constraints: '1 <= |S| <= 10^5',
    examples: [{ input: 'leetcode', output: 'l' }, { input: 'loveleetcode', output: 'v' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'aabb', expectedOutput: '-1', isHidden: false, order: 1 },
      { input: 'abcab', expectedOutput: 'c', isHidden: true, order: 2 },
      { input: 'z', expectedOutput: 'z', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sort Pairs with Custom Comparator',
    slug: 'cpp-l4-sort-pairs-comparator',
    description: 'Given N pairs of (name, score), sort them in descending order of score. If scores equal, sort alphabetically by name.',
    inputFormat: 'First line N. Next N lines contain name and score.',
    outputFormat: 'Print sorted pairs on separate lines.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '3\nBob 80\nAlice 90\nCharlie 80', output: 'Alice 90\nBob 80\nCharlie 80' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2\nJohn 50\nJane 70', expectedOutput: 'Jane 70\nJohn 50', isHidden: false, order: 1 },
      { input: '2\nB 10\nA 10', expectedOutput: 'A 10\nB 10', isHidden: true, order: 2 },
      { input: '1\nSingle 100', expectedOutput: 'Single 100', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Top K Frequent Elements (priority_queue)',
    slug: 'cpp-l4-top-k-frequent',
    description: 'Given an array of N integers and integer K, print the K most frequent elements in descending order of frequency.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print K elements separated by space.',
    constraints: '1 <= K <= unique elements <= 1000',
    examples: [{ input: '6 2\n1 1 1 2 2 3', output: '1 2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 1\n4 4 4 1', expectedOutput: '4', isHidden: false, order: 1 },
      { input: '5 2\n10 10 20 20 30', expectedOutput: '10 20', isHidden: true, order: 2 },
      { input: '1 1\n7', expectedOutput: '7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Intersection of Two Arrays (std::set)',
    slug: 'cpp-l4-intersection-arrays-set',
    description: 'Given two arrays of size N and M, print their common distinct elements in ascending order.',
    inputFormat: 'First line N and M. Second line N integers. Third line M integers.',
    outputFormat: 'Print common distinct elements separated by space.',
    constraints: '1 <= N, M <= 1000',
    examples: [{ input: '4 5\n1 2 2 1\n2 2 3 4 1', output: '1 2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3 3\n4 9 5\n9 4 9', expectedOutput: '4 9', isHidden: false, order: 1 },
      { input: '2 2\n1 2\n3 4', expectedOutput: '', isHidden: true, order: 2 },
      { input: '1 2\n5\n5 5', expectedOutput: '5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sliding Window Maximum (std::deque)',
    slug: 'cpp-l4-sliding-window-maximum',
    description: 'Given array of N integers and window size K, find the maximum for each sliding window of size K from left to right.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print maximums separated by space.',
    constraints: '1 <= K <= N <= 1000',
    examples: [{ input: '8 3\n1 3 -1 -3 5 3 6 7', output: '3 3 5 5 6 7' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 2\n1 2 3 4', expectedOutput: '2 3 4', isHidden: false, order: 1 },
      { input: '3 3\n5 2 1', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '5 1\n10 20 30 40 50', expectedOutput: '10 20 30 40 50', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Min Stack Design',
    slug: 'cpp-l4-min-stack',
    description: 'Design a stack that retrieves the minimum element in O(1). Process Q queries: 1 X (push X), 2 (pop), 3 (print current minimum).',
    inputFormat: 'First line Q. Next Q lines contain query.',
    outputFormat: 'Print result of each type 3 query on a new line.',
    constraints: '1 <= Q <= 1000',
    examples: [{ input: '5\n1 -2\n1 0\n1 -3\n3\n2', output: '-3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n1 5\n1 2\n3\n2', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '3\n1 10\n3\n3', expectedOutput: '10\n10', isHidden: true, order: 2 },
      { input: '5\n1 4\n1 1\n1 2\n3\n2', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Evaluate Infix Expression',
    slug: 'cpp-l4-evaluate-infix',
    description: 'Evaluate an infix expression consisting of single-digit numbers and operators +, -, * with parentheses.',
    inputFormat: 'A valid infix expression string without spaces.',
    outputFormat: 'Print the evaluated integer.',
    constraints: '1 <= length <= 50',
    examples: [{ input: '(2+3)*4', output: '20' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1+2*3', expectedOutput: '7', isHidden: false, order: 1 },
      { input: '(5-2)*(3+1)', expectedOutput: '12', isHidden: true, order: 2 },
      { input: '8', expectedOutput: '8', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Queue using Two Stacks',
    slug: 'cpp-l4-queue-using-stacks',
    description: 'Implement a FIFO queue using two std::stack instances. Process Q queries: 1 X (enqueue X), 2 (dequeue and print front).',
    inputFormat: 'First line Q. Next Q lines contain query.',
    outputFormat: 'Print dequeued values on new lines.',
    constraints: '1 <= Q <= 500',
    examples: [{ input: '4\n1 10\n1 20\n2\n2', output: '10\n20' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 5\n2\n1 10', expectedOutput: '5', isHidden: false, order: 1 },
      { input: '4\n1 1\n1 2\n2\n2', expectedOutput: '1\n2', isHidden: true, order: 2 },
      { input: '2\n1 42\n2', expectedOutput: '42', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 5 (10 Questions: Trees, Heaps & Advanced STL) ---
  {
    title: 'Binary Tree Level Order Traversal',
    slug: 'cpp-l5-level-order-traversal',
    description: 'Construct a BST by inserting N integers, then print its level order traversal (breadth-first) using std::queue.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print level order nodes separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '5 3 7 2 4' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n10 5 15 2', expectedOutput: '10 5 15 2', isHidden: false, order: 1 },
      { input: '3\n2 1 3', expectedOutput: '2 1 3', isHidden: true, order: 2 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Diameter of Binary Search Tree',
    slug: 'cpp-l5-tree-diameter',
    description: 'Insert N integers into a BST. Calculate the diameter (number of edges on the longest path between any two nodes).',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print the diameter as an integer.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 1 3', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '4\n1 2 3 4', expectedOutput: '3', isHidden: true, order: 2 },
      { input: '1\n10', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Median of Stream (Two Heaps)',
    slug: 'cpp-l5-median-stream-heaps',
    description: 'Given N integers, maintain the median after inserting each element using two priority_queues. Print integer floor of median after each insertion.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print N space-separated integer medians.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n5 15 1 3', output: '5 10 5 4' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 4 6', expectedOutput: '2 3 4', isHidden: false, order: 1 },
      { input: '1\n10', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '2\n1 3', expectedOutput: '1 2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Path Sum in BST',
    slug: 'cpp-l5-path-sum-bst',
    description: 'Insert N integers into a BST. Given target sum S, determine if there exists a root-to-leaf path summing to S. Print "YES" or "NO".',
    inputFormat: 'First line N and S. Second line N space-separated integers.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5 10\n5 3 7 2 4', output: 'YES', explanation: 'Path 5->3->2 sums to 10.' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 5\n2 1 3', expectedOutput: 'YES', isHidden: false, order: 1 },
      { input: '3 20\n2 1 3', expectedOutput: 'NO', isHidden: true, order: 2 },
      { input: '1 42\n42', expectedOutput: 'YES', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Invert Binary Tree',
    slug: 'cpp-l5-invert-binary-tree',
    description: 'Insert N integers into a BST. Invert the tree (swap left and right child of every node), then print its inorder traversal.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print inorder traversal of the inverted tree.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '7 5 4 3 2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 1 3', expectedOutput: '3 2 1', isHidden: false, order: 1 },
      { input: '1\n10', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '4\n10 5 15 2', expectedOutput: '15 10 5 2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sorted Array to Balanced BST',
    slug: 'cpp-l5-sorted-array-to-bst',
    description: 'Given a sorted array of N integers, convert it into a height-balanced BST and print the root element value.',
    inputFormat: 'First line N. Second line N sorted space-separated integers.',
    outputFormat: 'Print root value.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n1 2 3 4 5', output: '3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '20', isHidden: false, order: 1 },
      { input: '1\n99', expectedOutput: '99', isHidden: true, order: 2 },
      { input: '4\n1 2 3 4', expectedOutput: '2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Kth Largest Element in Array (Min-Heap)',
    slug: 'cpp-l5-kth-largest-heap',
    description: 'Find the K-th largest element in an array of N integers using std::priority_queue.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print the K-th largest element.',
    constraints: '1 <= K <= N <= 10^5',
    examples: [{ input: '6 2\n3 2 1 5 6 4', output: '5' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '5 1\n7 10 4 3 20', expectedOutput: '20', isHidden: false, order: 1 },
      { input: '3 3\n5 10 15', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '1 1\n42', expectedOutput: '42', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Subtree of Another Tree',
    slug: 'cpp-l5-check-subtree',
    description: 'Insert N1 integers into Tree1 and N2 integers into Tree2. Determine if Tree2 is identical to Tree1. Print "YES" or "NO".',
    inputFormat: 'First line N1 and N2. Second line N1 integers. Third line N2 integers.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N1, N2 <= 200',
    examples: [{ input: '3 3\n2 1 3\n2 1 3', output: 'YES' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 3\n2 1 3\n2 3 1', expectedOutput: 'YES', isHidden: false, order: 1 },
      { input: '2 2\n1 2\n2 1', expectedOutput: 'NO', isHidden: true, order: 2 },
      { input: '1 1\n5\n5', expectedOutput: 'YES', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Custom Heap with Merge Operation',
    slug: 'cpp-l5-merge-k-sorted-arrays',
    description: 'Given K sorted arrays each of size N, merge them into a single sorted array of size K*N using a priority queue.',
    inputFormat: 'First line K and N. Next K lines contain N sorted integers each.',
    outputFormat: 'Print merged sorted elements separated by space.',
    constraints: '1 <= K, N <= 100',
    examples: [{ input: '2 3\n1 4 5\n1 3 4', output: '1 1 3 4 4 5' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '2 2\n10 20\n5 15', expectedOutput: '5 10 15 20', isHidden: false, order: 1 },
      { input: '1 3\n2 4 6', expectedOutput: '2 4 6', isHidden: true, order: 2 },
      { input: '3 1\n3\n1\n2', expectedOutput: '1 2 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Zigzag Level Order Traversal',
    slug: 'cpp-l5-zigzag-traversal',
    description: 'Insert N integers into a BST. Print nodes level-by-level in zigzag order (left-to-right, then right-to-left, alternating).',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print nodes separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '5 7 3 2 4' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 1 3', expectedOutput: '2 3 1', isHidden: false, order: 1 },
      { input: '1\n10', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '4\n10 5 15 2', expectedOutput: '10 15 5 2', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 6 (10 Questions: Graph Algorithms & Advanced DP in C++) ---
  {
    title: 'Shortest Path in Unweighted Graph (BFS)',
    slug: 'cpp-l6-unweighted-shortest-path',
    description: 'Given an unweighted graph with V vertices and E edges, find the shortest distance from vertex 0 to vertex V-1. Print -1 if unreachable.',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print shortest distance integer or -1.',
    constraints: '2 <= V <= 100, 0 <= E <= 500',
    examples: [{ input: '4 4\n0 1\n0 2\n1 3\n2 3', output: '2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n0 1\n1 2', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '3 1\n0 1', expectedOutput: '-1', isHidden: true, order: 2 },
      { input: '2 1\n0 1', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Dijkstra with std::priority_queue',
    slug: 'cpp-l6-dijkstra-priority-queue',
    description: 'Given a directed weighted graph with V vertices (0 to V-1) and E edges (u, v, w), find shortest path from 0 to V-1 using Dijkstra.',
    inputFormat: 'First line V and E. Next E lines contain u, v, w.',
    outputFormat: 'Print minimum cost integer or -1.',
    constraints: '2 <= V <= 500, 1 <= E <= 2000',
    examples: [{ input: '3 3\n0 1 4\n0 2 2\n2 1 1', output: '3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4 4\n0 1 1\n1 2 2\n2 3 3\n0 3 10', expectedOutput: '6', isHidden: false, order: 1 },
      { input: '2 1\n0 1 5', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '3 1\n0 1 2', expectedOutput: '-1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Number of Islands (Grid BFS/DFS)',
    slug: 'cpp-l6-number-of-islands',
    description: 'Given an R x C grid of 1s (land) and 0s (water), count the number of islands (connected horizontally or vertically).',
    inputFormat: 'First line R and C. Next R lines contain C characters (0 or 1).',
    outputFormat: 'Print number of islands.',
    constraints: '1 <= R, C <= 50',
    examples: [{ input: '3 3\n110\n100\n001', output: '2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '2 2\n11\n11', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '2 2\n00\n00', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '3 3\n101\n010\n101', expectedOutput: '5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Longest Increasing Subsequence (O(N log N))',
    slug: 'cpp-l6-lis-binary-search',
    description: 'Find length of the longest strictly increasing subsequence in an array of N integers using std::lower_bound.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print length of LIS.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '6\n10 9 2 5 3 7', output: '3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n0 1 0 3', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '5\n7 7 7 7 7', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '5\n1 2 3 4 5', expectedOutput: '5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Minimum Spanning Tree (Kruskal with DSU)',
    slug: 'cpp-l6-kruskal-mst',
    description: 'Given connected undirected graph with V vertices and E weighted edges, compute the minimum weight of a spanning tree.',
    inputFormat: 'First line V and E. Next E lines contain u, v, w.',
    outputFormat: 'Print MST total weight.',
    constraints: '2 <= V <= 100, 1 <= E <= 500',
    examples: [{ input: '3 3\n0 1 1\n1 2 2\n0 2 3', output: '3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4', expectedOutput: '19', isHidden: false, order: 1 },
      { input: '2 1\n0 1 7', expectedOutput: '7', isHidden: true, order: 2 },
      { input: '3 2\n0 1 3\n1 2 4', expectedOutput: '7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Course Schedule (Kahn Topological Sort)',
    slug: 'cpp-l6-course-schedule-kahn',
    description: 'There are N courses (0 to N-1). Given M prerequisites [a, b] (take b before a), determine if it is possible to finish all courses. Print "YES" or "NO".',
    inputFormat: 'First line N and M. Next M lines contain a and b.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 500, 0 <= M <= 1000',
    examples: [{ input: '2 1\n1 0', output: 'YES' }, { input: '2 2\n1 0\n0 1', output: 'NO' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n1 0\n2 1', expectedOutput: 'YES', isHidden: false, order: 1 },
      { input: '3 3\n1 0\n2 1\n0 2', expectedOutput: 'NO', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: 'YES', isHidden: true, order: 3 }
    ]
  },
  {
    title: '0/1 Knapsack Space Optimized',
    slug: 'cpp-l6-knapsack-space-opt',
    description: 'Solve 0/1 Knapsack with N items, values V, weights W, and capacity C using a 1D vector DP table.',
    inputFormat: 'First line N and C. Second line N values. Third line N weights.',
    outputFormat: 'Print max value.',
    constraints: '1 <= N <= 100, 1 <= C <= 1000',
    examples: [{ input: '3 4\n1 2 3\n4 5 1', output: '3' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 50\n60 100 120\n10 20 30', expectedOutput: '220', isHidden: false, order: 1 },
      { input: '1 10\n40\n5', expectedOutput: '40', isHidden: true, order: 2 },
      { input: '2 5\n10 10\n6 7', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Word Break Problem (DP)',
    slug: 'cpp-l6-word-break-dp',
    description: 'Given string S and a dictionary of D words, determine if S can be segmented into a space-separated sequence of dictionary words. Print "YES" or "NO".',
    inputFormat: 'First line string S. Second line D. Next D lines contain dictionary words.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= |S| <= 100, 1 <= D <= 50',
    examples: [{ input: 'leetcode\n2\nleet\ncode', output: 'YES' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: 'applepenapple\n2\napple\npen', expectedOutput: 'YES', isHidden: false, order: 1 },
      { input: 'catsandog\n3\ncats\ndog\nsand', expectedOutput: 'NO', isHidden: true, order: 2 },
      { input: 'a\n1\na', expectedOutput: 'YES', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Matrix Chain Multiplication',
    slug: 'cpp-l6-matrix-chain-mult',
    description: 'Given sequence of matrix dimensions arr of size N, find minimum scalar multiplications needed to multiply matrices (dimensions are arr[i-1] x arr[i]).',
    inputFormat: 'First line N. Second line N space-separated dimension integers.',
    outputFormat: 'Print minimum multiplications count.',
    constraints: '3 <= N <= 50',
    examples: [{ input: '4\n10 20 30 40', output: '18000' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n10 30 5', expectedOutput: '1500', isHidden: false, order: 1 },
      { input: '4\n40 20 30 10', expectedOutput: '26000', isHidden: true, order: 2 },
      { input: '5\n1 2 3 4 3', expectedOutput: '30', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Disjoint Set Union (Connected Components)',
    slug: 'cpp-l6-dsu-components',
    description: 'Given V vertices and E union operations, print the final number of connected components in the graph.',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print number of connected components.',
    constraints: '1 <= V <= 500, 0 <= E <= 1000',
    examples: [{ input: '5 3\n0 1\n1 2\n3 4', output: '2' }],
    allowedLanguages: ['cpp'],
    courseSlug: 'cpp',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4 1\n0 1', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '3 0', expectedOutput: '3', isHidden: true, order: 2 },
      { input: '3 2\n0 1\n1 2', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  }
];

