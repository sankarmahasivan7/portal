import { RawQuestionData } from './cQuestions';

export const PYTHON_QUESTIONS: RawQuestionData[] = [
  // --- LEVEL 1 (10 Questions: Python Basics, Input & Formatting, Conditionals) ---
  {
    title: 'Python Input Sum',
    slug: 'py-l1-input-sum',
    description: 'Read two integers A and B from standard input (via input() or sys.stdin) and print their sum.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print the sum integer.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '4 9', output: '13' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 20', expectedOutput: '30', isHidden: false, order: 1 },
      { input: '-5 15', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '0 0', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Even or Odd in Python',
    slug: 'py-l1-even-odd',
    description: 'Given an integer N, print "Even" if N is divisible by 2, else "Odd".',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "Even" or "Odd".',
    constraints: '-10^9 <= N <= 10^9',
    examples: [{ input: '8', output: 'Even' }, { input: '13', output: 'Odd' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: 'Even', isHidden: false, order: 1 },
      { input: '-7', expectedOutput: 'Odd', isHidden: true, order: 2 },
      { input: '100', expectedOutput: 'Even', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Maximum of Two Numbers',
    slug: 'py-l1-max-two-numbers',
    description: 'Given two integers A and B, print the maximum value using max().',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print maximum value.',
    constraints: '-10^9 <= A, B <= 10^9',
    examples: [{ input: '45 32', output: '45' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 20', expectedOutput: '20', isHidden: false, order: 1 },
      { input: '-10 -5', expectedOutput: '-5', isHidden: true, order: 2 },
      { input: '7 7', expectedOutput: '7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Convert Minutes to Hours and Minutes',
    slug: 'py-l1-minutes-to-hours',
    description: 'Given total minutes M, convert to hours and remaining minutes: "H hour(s) M minute(s)".',
    inputFormat: 'A non-negative integer M.',
    outputFormat: 'Print "H hour(s) M minute(s)".',
    constraints: '0 <= M <= 10000',
    examples: [{ input: '130', output: '2 hour(s) 10 minute(s)' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '60', expectedOutput: '1 hour(s) 0 minute(s)', isHidden: false, order: 1 },
      { input: '45', expectedOutput: '0 hour(s) 45 minute(s)', isHidden: true, order: 2 },
      { input: '185', expectedOutput: '3 hour(s) 5 minute(s)', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Percentage Calculator',
    slug: 'py-l1-percentage-calc',
    description: 'Given marks obtained and total marks, print percentage rounded down to integer.',
    inputFormat: 'Two positive integers obtained and total.',
    outputFormat: 'Print integer percentage.',
    constraints: '1 <= obtained <= total <= 1000',
    examples: [{ input: '80 100', output: '80' }, { input: '45 90', output: '50' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '75 100', expectedOutput: '75', isHidden: false, order: 1 },
      { input: '33 100', expectedOutput: '33', isHidden: true, order: 2 },
      { input: '100 100', expectedOutput: '100', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Leap Year in Python',
    slug: 'py-l1-leap-year',
    description: 'Check if year Y is a leap year. Print "Leap Year" or "Not Leap Year".',
    inputFormat: 'A single integer year Y.',
    outputFormat: 'Print "Leap Year" or "Not Leap Year".',
    constraints: '1000 <= Y <= 9999',
    examples: [{ input: '2024', output: 'Leap Year' }, { input: '2022', output: 'Not Leap Year' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '2000', expectedOutput: 'Leap Year', isHidden: false, order: 1 },
      { input: '1900', expectedOutput: 'Not Leap Year', isHidden: true, order: 2 },
      { input: '2020', expectedOutput: 'Leap Year', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Square and Cube of Number',
    slug: 'py-l1-square-cube',
    description: 'Given an integer N, print N^2 and N^3 separated by space.',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print N^2 N^3.',
    constraints: '-100 <= N <= 100',
    examples: [{ input: '3', output: '9 27' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '5', expectedOutput: '25 125', isHidden: false, order: 1 },
      { input: '-2', expectedOutput: '4 -8', isHidden: true, order: 2 },
      { input: '0', expectedOutput: '0 0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Absolute Difference Between Numbers',
    slug: 'py-l1-abs-diff',
    description: 'Given two integers A and B, print the absolute difference |A - B|.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print absolute difference.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '15 40', output: '25' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 5', expectedOutput: '5', isHidden: false, order: 1 },
      { input: '-10 20', expectedOutput: '30', isHidden: true, order: 2 },
      { input: '5 5', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Multiplication Table in Python',
    slug: 'py-l1-multiplication-table',
    description: 'Print the first 5 multiples of N separated by space.',
    inputFormat: 'A positive integer N.',
    outputFormat: 'Five space-separated integers.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4', output: '4 8 12 16 20' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '2', expectedOutput: '2 4 6 8 10', isHidden: false, order: 1 },
      { input: '7', expectedOutput: '7 14 21 28 35', isHidden: true, order: 2 },
      { input: '1', expectedOutput: '1 2 3 4 5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sum of Natural Numbers (Formula)',
    slug: 'py-l1-sum-natural',
    description: 'Calculate sum of first N natural numbers: N * (N + 1) // 2.',
    inputFormat: 'A positive integer N.',
    outputFormat: 'Print sum.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '5', output: '15' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10', expectedOutput: '55', isHidden: false, order: 1 },
      { input: '100', expectedOutput: '5050', isHidden: true, order: 2 },
      { input: '1', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 2 (10 Questions: Loops, Lists, Tuples & String Slicing) ---
  {
    title: 'Reverse a List with Slicing',
    slug: 'py-l2-reverse-list',
    description: 'Given a list of N space-separated integers, reverse it using slicing [::-1] and print separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print reversed integers separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 2 3 4', output: '4 3 2 1' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '30 20 10', isHidden: false, order: 1 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 2 },
      { input: '5\n5 4 3 2 1', expectedOutput: '1 2 3 4 5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Filter Even Numbers from List',
    slug: 'py-l2-filter-even-numbers',
    description: 'Given an array of N integers, print all even numbers in original order separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print even numbers separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n1 2 3 4 5', output: '2 4' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n2 4 6 8', expectedOutput: '2 4 6 8', isHidden: false, order: 1 },
      { input: '3\n1 3 5', expectedOutput: '', isHidden: true, order: 2 },
      { input: '4\n0 10 15 20', expectedOutput: '0 10 20', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Count Vowels in String',
    slug: 'py-l2-count-vowels',
    description: 'Count the number of vowels (a, e, i, o, u) in a lowercase string S.',
    inputFormat: 'A string S without spaces.',
    outputFormat: 'Print vowel count.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'python', output: '1' }, { input: 'education', output: '5' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'hello', expectedOutput: '2', isHidden: false, order: 1 },
      { input: 'rhythm', expectedOutput: '0', isHidden: true, order: 2 },
      { input: 'aeiou', expectedOutput: '5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Palindrome String via Slicing',
    slug: 'py-l2-palindrome-slicing',
    description: 'Check if string S == S[::-1]. Print "True" or "False".',
    inputFormat: 'A string S without spaces.',
    outputFormat: 'Print "True" or "False".',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'racecar', output: 'True' }, { input: 'python', output: 'False' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'madam', expectedOutput: 'True', isHidden: false, order: 1 },
      { input: 'world', expectedOutput: 'False', isHidden: true, order: 2 },
      { input: 'a', expectedOutput: 'True', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Find Unique Elements in List',
    slug: 'py-l2-unique-elements',
    description: 'Given a list of N integers, print elements that appear exactly once in ascending order.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print unique elements separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '6\n1 2 2 3 4 4', output: '1 3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '5\n1 1 2 2 3', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '3\n5 10 15', expectedOutput: '5 10 15', isHidden: true, order: 2 },
      { input: '4\n1 1 1 1', expectedOutput: '', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Second Largest in Python List',
    slug: 'py-l2-second-largest',
    description: 'Given list of N distinct integers, print second largest.',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print second largest integer.',
    constraints: '2 <= N <= 1000',
    examples: [{ input: '4\n10 20 30 40', output: '30' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n5 9 1', expectedOutput: '5', isHidden: false, order: 1 },
      { input: '2\n100 50', expectedOutput: '50', isHidden: true, order: 2 },
      { input: '4\n-1 -5 -2 -10', expectedOutput: '-2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Cumulative Sum of List',
    slug: 'py-l2-cumulative-sum',
    description: 'Compute running prefix sum of list: output[i] = sum(arr[0..i]). Print elements separated by space.',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print prefix sums separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 2 3 4', output: '1 3 6 10' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '10 30 60', isHidden: false, order: 1 },
      { input: '1\n5', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '4\n1 -1 1 -1', expectedOutput: '1 0 1 0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Remove Vowels from String',
    slug: 'py-l2-remove-vowels',
    description: 'Given lowercase string S, remove all vowels (a, e, i, o, u) and print the remaining string.',
    inputFormat: 'A lowercase string S.',
    outputFormat: 'Print string without vowels.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'antigravity', output: 'ntgrvty' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'apple', expectedOutput: 'ppl', isHidden: false, order: 1 },
      { input: 'aeiou', expectedOutput: '', isHidden: true, order: 2 },
      { input: 'sky', expectedOutput: 'sky', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Count Occurrences in List',
    slug: 'py-l2-count-occurrences',
    description: 'Given list of N integers and target X, print how many times X appears using list.count(X).',
    inputFormat: 'First line N and X. Second line N integers.',
    outputFormat: 'Print occurrence count.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5 3\n1 3 2 3 3', output: '3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 5\n5 5 5 5', expectedOutput: '4', isHidden: false, order: 1 },
      { input: '3 9\n1 2 3', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '1 7\n7', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Merge and Sort Two Lists',
    slug: 'py-l2-merge-sort-lists',
    description: 'Given two lists of size N and M, concatenate and print the combined sorted list separated by space.',
    inputFormat: 'First line N and M. Second line N integers. Third line M integers.',
    outputFormat: 'Print sorted combined list.',
    constraints: '1 <= N, M <= 500',
    examples: [{ input: '2 2\n3 1\n4 2', output: '1 2 3 4' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3 1\n5 2 8\n1', expectedOutput: '1 2 5 8', isHidden: false, order: 1 },
      { input: '1 1\n10\n5', expectedOutput: '5 10', isHidden: true, order: 2 },
      { input: '2 2\n0 0\n1 1', expectedOutput: '0 0 1 1', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 3 (10 Questions: Functions, Dictionaries, Sets & Lambda) ---
  {
    title: 'Word Frequency with Dict',
    slug: 'py-l3-word-frequency-dict',
    description: 'Count word frequencies in a line using a dictionary. Print "word: count" in alphabetical order of words.',
    inputFormat: 'A single line of text with space-separated words.',
    outputFormat: 'Print "word: count" on separate lines.',
    constraints: '1 <= length <= 1000',
    examples: [{ input: 'apple banana apple orange', output: 'apple: 2\nbanana: 1\norange: 1' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'cat dog cat', expectedOutput: 'cat: 2\ndog: 1', isHidden: false, order: 1 },
      { input: 'z z', expectedOutput: 'z: 2', isHidden: true, order: 2 },
      { input: 'one', expectedOutput: 'one: 1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Two Sum Problem with Dict Lookup',
    slug: 'py-l3-two-sum-dict',
    description: 'Find two 0-based indices i and j (i < j) such that arr[i] + arr[j] == target using dict lookup in O(N).',
    inputFormat: 'First line N and Target. Second line N space-separated integers.',
    outputFormat: 'Print i and j separated by space.',
    constraints: '2 <= N <= 10^5',
    examples: [{ input: '4 9\n2 7 11 15', output: '0 1' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3 6\n3 2 4', expectedOutput: '1 2', isHidden: false, order: 1 },
      { input: '2 6\n3 3', expectedOutput: '0 1', isHidden: true, order: 2 },
      { input: '4 10\n1 5 5 9', expectedOutput: '0 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Anagram Checker with Counter',
    slug: 'py-l3-anagram-counter',
    description: 'Check if two strings S1 and S2 are anagrams using collections.Counter. Print "True" or "False".',
    inputFormat: 'Two space-separated strings S1 and S2.',
    outputFormat: 'Print "True" or "False".',
    constraints: '1 <= |S1|, |S2| <= 1000',
    examples: [{ input: 'anagram nagaram', output: 'True' }, { input: 'rat car', output: 'False' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'listen silent', expectedOutput: 'True', isHidden: false, order: 1 },
      { input: 'hello world', expectedOutput: 'False', isHidden: true, order: 2 },
      { input: 'a a', expectedOutput: 'True', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Set Intersection and Union Sizes',
    slug: 'py-l3-set-operations',
    description: 'Given two lists of integers, convert to sets and print the size of their intersection followed by size of union separated by space.',
    inputFormat: 'First line N and M. Second line N integers. Third line M integers.',
    outputFormat: 'Print intersection_size union_size.',
    constraints: '1 <= N, M <= 1000',
    examples: [{ input: '4 4\n1 2 3 4\n3 4 5 6', output: '2 6' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3 3\n1 2 3\n4 5 6', expectedOutput: '0 6', isHidden: false, order: 1 },
      { input: '2 2\n5 5\n5 5', expectedOutput: '1 1', isHidden: true, order: 2 },
      { input: '1 2\n10\n10 20', expectedOutput: '1 2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Flatten 2D List with Comprehension',
    slug: 'py-l3-flatten-2d-list',
    description: 'Given R rows of C integers, flatten into a single 1D list using list comprehension and print separated by space.',
    inputFormat: 'First line R and C. Following R lines contain C integers each.',
    outputFormat: 'Print flattened integers separated by space.',
    constraints: '1 <= R, C <= 50',
    examples: [{ input: '2 3\n1 2 3\n4 5 6', output: '1 2 3 4 5 6' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 2\n10 20\n30 40', expectedOutput: '10 20 30 40', isHidden: false, order: 1 },
      { input: '3 1\n5\n10\n15', expectedOutput: '5 10 15', isHidden: true, order: 2 },
      { input: '1 3\n7 8 9', expectedOutput: '7 8 9', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Dictionary Key with Maximum Value',
    slug: 'py-l3-dict-max-key',
    description: 'Given N (name, score) pairs stored in a dict, find and print the name with the maximum score.',
    inputFormat: 'First line N. Next N lines contain name and score.',
    outputFormat: 'Print name with maximum score.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '3\nAlice 85\nBob 95\nCharlie 75', output: 'Bob' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2\nJohn 60\nJane 80', expectedOutput: 'Jane', isHidden: false, order: 1 },
      { input: '1\nSolo 100', expectedOutput: 'Solo', isHidden: true, order: 2 },
      { input: '3\nA 10\nB 30\nC 20', expectedOutput: 'B', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Recursive Fibonacci in Python',
    slug: 'py-l3-fibonacci-recursion',
    description: 'Compute the Nth Fibonacci number recursively (F(0)=0, F(1)=1).',
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'Print Nth Fibonacci number.',
    constraints: '0 <= N <= 25',
    examples: [{ input: '7', output: '13' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Filter Prime Numbers in Range',
    slug: 'py-l3-filter-primes',
    description: 'Given integers L and R (L <= R), print all prime numbers in range [L, R] separated by space.',
    inputFormat: 'Two space-separated integers L and R.',
    outputFormat: 'Print prime numbers separated by space (or empty).',
    constraints: '1 <= L <= R <= 1000',
    examples: [{ input: '10 20', output: '11 13 17 19' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 10', expectedOutput: '2 3 5 7', isHidden: false, order: 1 },
      { input: '20 22', expectedOutput: '', isHidden: true, order: 2 },
      { input: '2 3', expectedOutput: '2 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Group Elements by Parity',
    slug: 'py-l3-group-by-parity',
    description: 'Given list of N integers, print all even integers followed by all odd integers, separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print even numbers then odd numbers.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n3 1 2 4', output: '2 4 3 1' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 3 5', expectedOutput: '1 3 5', isHidden: false, order: 1 },
      { input: '3\n2 4 6', expectedOutput: '2 4 6', isHidden: true, order: 2 },
      { input: '4\n5 2 9 4', expectedOutput: '2 4 5 9', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Lambda Sort by Key Length',
    slug: 'py-l3-lambda-sort-length',
    description: 'Given N words, sort them by length using sorted(words, key=lambda x: (len(x), x)). Print separated by space.',
    inputFormat: 'First line N. Next N lines contain one word each.',
    outputFormat: 'Print sorted words separated by space.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '4\nbanana\nfig\napple\nkiwi', output: 'fig kiwi apple banana' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\ndog\ncat\nelephant', expectedOutput: 'cat dog elephant', isHidden: false, order: 1 },
      { input: '2\nbeta\nalfa', expectedOutput: 'alfa beta', isHidden: true, order: 2 },
      { input: '1\none', expectedOutput: 'one', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 4 (10 Questions: Data Structures: Stacks/Queues via deque, Sorting, Two Pointers) ---
  {
    title: 'Valid Parentheses in Python',
    slug: 'py-l4-valid-parentheses',
    description: 'Given string of brackets ()[]{}, check if valid using list as stack. Print "True" or "False".',
    inputFormat: 'A string of brackets.',
    outputFormat: 'Print "True" or "False".',
    constraints: '1 <= length <= 1000',
    examples: [{ input: '{[()]}', output: 'True' }, { input: '{[(])}', output: 'False' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '()', expectedOutput: 'True', isHidden: false, order: 1 },
      { input: '((', expectedOutput: 'False', isHidden: true, order: 2 },
      { input: '[]{}()', expectedOutput: 'True', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Queue Implementation with collections.deque',
    slug: 'py-l4-deque-queue',
    description: 'Process Q queries on queue: 1 X (append X), 2 (popleft and print, or -1 if empty).',
    inputFormat: 'First line Q. Next Q lines contain query.',
    outputFormat: 'Print popped items on new lines.',
    constraints: '1 <= Q <= 1000',
    examples: [{ input: '4\n1 10\n1 20\n2\n2', output: '10\n20' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 5\n2\n2', expectedOutput: '5\n-1', isHidden: false, order: 1 },
      { input: '2\n2\n2', expectedOutput: '-1\n-1', isHidden: true, order: 2 },
      { input: '3\n1 1\n1 2\n2', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Merge Overlapping Intervals',
    slug: 'py-l4-merge-intervals',
    description: 'Given N intervals [start, end], merge all overlapping intervals and print count of merged intervals.',
    inputFormat: 'First line N. Next N lines contain start and end.',
    outputFormat: 'Print count of merged intervals.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 3\n2 6\n8 10\n15 18', output: '3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2\n1 4\n4 5', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '3\n1 2\n3 4\n5 6', expectedOutput: '3', isHidden: true, order: 2 },
      { input: '1\n1 10', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Subarray Sum Equals K',
    slug: 'py-l4-subarray-sum-k',
    description: 'Find total number of continuous subarrays whose sum equals K using prefix sum hash map.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print count of subarrays.',
    constraints: '1 <= N <= 10^4',
    examples: [{ input: '3 2\n1 1 1', output: '2' }, { input: '3 3\n1 2 3', output: '2' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 0\n1 -1 1 -1', expectedOutput: '4', isHidden: false, order: 1 },
      { input: '3 5\n1 2 3', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '1 5\n5', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Rotate Matrix 90 Degrees',
    slug: 'py-l4-rotate-matrix',
    description: 'Rotate an N x N matrix 90 degrees clockwise in place and print the resulting matrix.',
    inputFormat: 'First line N. Following N lines contain N integers each.',
    outputFormat: 'Print rotated matrix (N lines of N integers).',
    constraints: '1 <= N <= 30',
    examples: [{ input: '2\n1 2\n3 4', output: '3 1\n4 2' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '7 4 1\n8 5 2\n9 6 3', isHidden: false, order: 1 },
      { input: '1\n5', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '2\n0 1\n1 0', expectedOutput: '1 0\n0 1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'py-l4-longest-unique-substr',
    description: 'Find the length of the longest substring without repeating characters using sliding window.',
    inputFormat: 'A single string S without spaces.',
    outputFormat: 'Print maximum substring length.',
    constraints: '0 <= |S| <= 10^4',
    examples: [{ input: 'abcabcbb', output: '3' }, { input: 'bbbbb', output: '1' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'pwwkew', expectedOutput: '3', isHidden: false, order: 1 },
      { input: 'abcdef', expectedOutput: '6', isHidden: true, order: 2 },
      { input: 'a', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Daily Temperatures (Monotonic Stack)',
    slug: 'py-l4-daily-temperatures',
    description: 'Given daily temperatures for N days, print how many days you would have to wait until a warmer temperature. If none, print 0.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print waiting days separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n73 74 75 71', output: '1 1 0 0' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n30 40 50', expectedOutput: '1 1 0', isHidden: false, order: 1 },
      { input: '3\n50 40 30', expectedOutput: '0 0 0', isHidden: true, order: 2 },
      { input: '1\n60', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Top K Frequent Words (heapq)',
    slug: 'py-l4-top-k-words',
    description: 'Given N words and integer K, return the K most frequent words sorted by frequency (descending) and alphabetically for ties.',
    inputFormat: 'First line N and K. Next N lines contain one word each.',
    outputFormat: 'Print K words separated by space.',
    constraints: '1 <= K <= unique words <= 500',
    examples: [{ input: '6 2\ni\nlove\nleetcode\ni\nlove\ncoding', output: 'i love' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 1\napple\nbanana\napple\norange', expectedOutput: 'apple', isHidden: false, order: 1 },
      { input: '3 2\na\nb\nc', expectedOutput: 'a b', isHidden: true, order: 2 },
      { input: '2 1\nz\nz', expectedOutput: 'z', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Trapping Rain Water (Two Pointers)',
    slug: 'py-l4-trapping-rain-water',
    description: 'Given N non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print total trapped water units.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '6\n0 1 0 2 1 0', output: '1' }, { input: '6\n4 2 0 3 2 5', output: '9' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n3 0 2', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '3\n1 2 3', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '5\n2 0 2 0 2', expectedOutput: '4', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Find Minimum in Rotated Sorted Array',
    slug: 'py-l4-find-min-rotated',
    description: 'Given a sorted rotated array of N distinct integers, find the minimum element in O(log N).',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print minimum element.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n3 4 5 1 2', output: '1' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n4 5 6 7', expectedOutput: '4', isHidden: false, order: 1 },
      { input: '3\n2 3 1', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '1\n10', expectedOutput: '10', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 5 (10 Questions: Trees, Heaps & Recursion in Python) ---
  {
    title: 'Binary Tree Inorder in Python',
    slug: 'py-l5-bst-inorder',
    description: 'Insert N integers into a BST. Print its inorder traversal separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print inorder elements.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '2 3 4 5 7' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n10 5 15 2', expectedOutput: '2 5 10 15', isHidden: false, order: 1 },
      { input: '3\n2 1 3', expectedOutput: '1 2 3', isHidden: true, order: 2 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Max Depth of Binary Tree',
    slug: 'py-l5-max-depth',
    description: 'Insert N integers into a BST and calculate its maximum depth.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print maximum depth integer.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Validate BST in Python',
    slug: 'py-l5-validate-bst',
    description: 'Given preorder traversal of N integers, check if it forms a strictly valid BST. Print "True" or "False".',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print "True" or "False".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '3\n2 1 3', output: 'True' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n1 3 2', expectedOutput: 'True', isHidden: false, order: 1 },
      { input: '4\n40 30 35 80', expectedOutput: 'True', isHidden: true, order: 2 },
      { input: '1\n10', expectedOutput: 'True', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Lowest Common Ancestor in BST',
    slug: 'py-l5-lca-bst',
    description: 'Insert N integers into BST. Find the LCA of keys N1 and N2.',
    inputFormat: 'First line N, N1, and N2. Second line N space-separated integers.',
    outputFormat: 'Print LCA value.',
    constraints: '2 <= N <= 500',
    examples: [{ input: '6 2 8\n6 2 8 0 4 7', output: '6' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Kth Smallest Element in BST',
    slug: 'py-l5-kth-smallest',
    description: 'Insert N integers into a BST and return the K-th smallest element.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print K-th smallest value.',
    constraints: '1 <= K <= N <= 500',
    examples: [{ input: '5 3\n5 3 7 2 4', output: '4' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Path Sum Target in BST',
    slug: 'py-l5-path-sum',
    description: 'Insert N integers into a BST. Check if there exists a root-to-leaf path summing to Target S. Print "True" or "False".',
    inputFormat: 'First line N and S. Second line N integers.',
    outputFormat: 'Print "True" or "False".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5 10\n5 3 7 2 4', output: 'True' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 5\n2 1 3', expectedOutput: 'True', isHidden: false, order: 1 },
      { input: '3 20\n2 1 3', expectedOutput: 'False', isHidden: true, order: 2 },
      { input: '1 42\n42', expectedOutput: 'True', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Invert Binary Tree in Python',
    slug: 'py-l5-invert-tree',
    description: 'Insert N integers into BST. Invert left and right children recursively and print inorder traversal.',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print inorder elements of inverted tree.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '7 5 4 3 2' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Find Median from Data Stream (heapq)',
    slug: 'py-l5-median-stream',
    description: 'Maintain running median of N stream integers using two heaps. Print integer floor of median after each insertion separated by space.',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print N medians separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n5 15 1 3', output: '5 10 5 4' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Binary Tree Level Order Traversal',
    slug: 'py-l5-level-order',
    description: 'Insert N integers into BST. Print level order traversal using collections.deque.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print level order nodes separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '5 3 7 2 4' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Count Leaf Nodes in Python',
    slug: 'py-l5-count-leaves',
    description: 'Insert N integers into BST and print the number of leaf nodes.',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print leaf count.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 1 3', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '1\n10', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '4\n10 20 30 40', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 6 (10 Questions: Graph Traversal, DP & Advanced Algorithms in Python) ---
  {
    title: 'Graph BFS in Python (deque)',
    slug: 'py-l6-graph-bfs',
    description: 'Given graph with V vertices (0 to V-1) and E edges, print BFS traversal from vertex 0 using collections.deque.',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print BFS nodes separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 4\n0 1\n0 2\n1 2\n2 3', output: '0 1 2 3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Graph DFS in Python',
    slug: 'py-l6-graph-dfs',
    description: 'Print DFS traversal starting from vertex 0 visiting lowest numerical neighbor first.',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print DFS nodes separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 3\n0 1\n0 2\n1 3', output: '0 1 3 2' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Longest Increasing Subsequence in Python',
    slug: 'py-l6-lis-python',
    description: 'Find length of the longest strictly increasing subsequence in an array of N integers.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print length of LIS.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '6\n10 9 2 5 3 7', output: '3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: '0/1 Knapsack Problem in Python',
    slug: 'py-l6-knapsack-python',
    description: 'Given N items with values V, weights W, and knapsack capacity C, find maximum attainable value.',
    inputFormat: 'First line N and C. Second line N values. Third line N weights.',
    outputFormat: 'Print max value.',
    constraints: '1 <= N <= 100, 1 <= C <= 500',
    examples: [{ input: '3 50\n60 100 120\n10 20 30', output: '220' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Coin Change Minimum Coins in Python',
    slug: 'py-l6-coin-change',
    description: 'Find minimum number of coins from N denominations to form total amount V. If impossible, print -1.',
    inputFormat: 'First line N and V. Second line N coin values.',
    outputFormat: 'Print minimum coins or -1.',
    constraints: '1 <= N <= 50, 1 <= V <= 1000',
    examples: [{ input: '3 11\n1 2 5', output: '3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Longest Palindromic Substring',
    slug: 'py-l6-longest-palindrome-substr',
    description: 'Find the length of the longest palindromic substring in S.',
    inputFormat: 'A string S without spaces.',
    outputFormat: 'Print maximum length.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'babad', output: '3' }, { input: 'cbbd', output: '2' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: 'racecar', expectedOutput: '7', isHidden: false, order: 1 },
      { input: 'a', expectedOutput: '1', isHidden: true, order: 2 },
      { input: 'forgeeksskeegfor', expectedOutput: '10', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Course Schedule Cycle Detection',
    slug: 'py-l6-course-schedule',
    description: 'N courses (0 to N-1). Given M prerequisites [a, b], print "True" if all courses can be finished without cycle, else "False".',
    inputFormat: 'First line N and M. Next M lines contain a and b.',
    outputFormat: 'Print "True" or "False".',
    constraints: '1 <= N <= 500, 0 <= M <= 1000',
    examples: [{ input: '2 1\n1 0', output: 'True' }, { input: '2 2\n1 0\n0 1', output: 'False' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n1 0\n2 1', expectedOutput: 'True', isHidden: false, order: 1 },
      { input: '3 3\n1 0\n2 1\n0 2', expectedOutput: 'False', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: 'True', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Dijkstra with heapq in Python',
    slug: 'py-l6-dijkstra-heapq',
    description: 'Given directed weighted graph with V vertices and E edges (u, v, w), find shortest path cost from 0 to V-1 using heapq.',
    inputFormat: 'First line V and E. Next E lines contain u, v, w.',
    outputFormat: 'Print shortest path distance or -1.',
    constraints: '2 <= V <= 500, 1 <= E <= 2000',
    examples: [{ input: '3 3\n0 1 4\n0 2 2\n2 1 1', output: '3' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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
    title: 'Minimum Path Sum in Grid',
    slug: 'py-l6-min-path-sum',
    description: 'Given an R x C grid filled with non-negative numbers, find a path from top left to bottom right which minimizes the sum of all numbers along its path.',
    inputFormat: 'First line R and C. Following R lines contain C integers each.',
    outputFormat: 'Print minimum path sum.',
    constraints: '1 <= R, C <= 50',
    examples: [{ input: '3 3\n1 3 1\n1 5 1\n4 2 1', output: '7' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '12', isHidden: false, order: 1 },
      { input: '1 2\n1 2', expectedOutput: '3', isHidden: true, order: 2 },
      { input: '2 2\n1 1\n1 1', expectedOutput: '3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Number of Connected Components',
    slug: 'py-l6-connected-components',
    description: 'Given undirected graph with V vertices and E edges, compute total number of connected components.',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print number of connected components.',
    constraints: '1 <= V <= 500, 0 <= E <= 1000',
    examples: [{ input: '5 3\n0 1\n1 2\n3 4', output: '2' }],
    allowedLanguages: ['python'],
    courseSlug: 'python',
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

