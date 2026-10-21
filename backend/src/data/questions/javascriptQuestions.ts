import { RawQuestionData } from './cQuestions';

export const JAVASCRIPT_QUESTIONS: RawQuestionData[] = [
  // --- LEVEL 1 (10 Questions: JS Basics, Numbers, Strings, Conditionals) ---
  {
    title: 'JavaScript Stdin Sum',
    slug: 'js-l1-stdin-sum',
    description: 'Read two integers A and B from stdin using fs.readFileSync(0, "utf-8") and print their sum using console.log.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print the sum integer.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '3 8', output: '11' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 20', expectedOutput: '30', isHidden: false, order: 1 },
      { input: '-5 5', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '123 456', expectedOutput: '579', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Odd or Even in JavaScript',
    slug: 'js-l1-odd-even',
    description: 'Given an integer N, print "Even" if N is divisible by 2, otherwise "Odd".',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "Even" or "Odd".',
    constraints: '-10^9 <= N <= 10^9',
    examples: [{ input: '4', output: 'Even' }, { input: '9', output: 'Odd' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: 'Even', isHidden: false, order: 1 },
      { input: '-11', expectedOutput: 'Odd', isHidden: true, order: 2 },
      { input: '100', expectedOutput: 'Even', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Maximum of Three Numbers in JS',
    slug: 'js-l1-max-of-three',
    description: 'Given three integers A, B, and C, output the maximum using Math.max.',
    inputFormat: 'Three space-separated integers A, B, C.',
    outputFormat: 'Print maximum value.',
    constraints: '-10^6 <= A, B, C <= 10^6',
    examples: [{ input: '12 45 32', output: '45' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 20 30', expectedOutput: '30', isHidden: false, order: 1 },
      { input: '-10 -5 -20', expectedOutput: '-5', isHidden: true, order: 2 },
      { input: '7 7 7', expectedOutput: '7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Convert Hours to Seconds',
    slug: 'js-l1-hours-to-seconds',
    description: 'Given non-negative hours H, convert to total seconds (H * 3600).',
    inputFormat: 'A non-negative integer H.',
    outputFormat: 'Print total seconds.',
    constraints: '0 <= H <= 1000',
    examples: [{ input: '2', output: '7200' }, { input: '1', output: '3600' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: '0', isHidden: false, order: 1 },
      { input: '5', expectedOutput: '18000', isHidden: true, order: 2 },
      { input: '24', expectedOutput: '86400', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Number Sign (Math.sign)',
    slug: 'js-l1-number-sign',
    description: 'Given an integer N, print "Positive" if N > 0, "Negative" if N < 0, or "Zero" if N == 0.',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "Positive", "Negative", or "Zero".',
    constraints: '-10^9 <= N <= 10^9',
    examples: [{ input: '15', output: 'Positive' }, { input: '-7', output: 'Negative' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: 'Zero', isHidden: false, order: 1 },
      { input: '100', expectedOutput: 'Positive', isHidden: true, order: 2 },
      { input: '-50', expectedOutput: 'Negative', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Leap Year Checker in JS',
    slug: 'js-l1-leap-year',
    description: 'Determine if year Y is a leap year. Print "Leap Year" or "Not Leap Year".',
    inputFormat: 'A single integer year Y.',
    outputFormat: 'Print "Leap Year" or "Not Leap Year".',
    constraints: '1000 <= Y <= 9999',
    examples: [{ input: '2024', output: 'Leap Year' }, { input: '1900', output: 'Not Leap Year' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
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
    title: 'Area of Triangle (Base * Height / 2)',
    slug: 'js-l1-triangle-area',
    description: 'Given base B and height H of a triangle, print the integer floor area: Math.floor((B * H) / 2).',
    inputFormat: 'Two space-separated integers B and H.',
    outputFormat: 'Print integer floor area.',
    constraints: '1 <= B, H <= 1000',
    examples: [{ input: '3 4', output: '6' }, { input: '5 7', output: '17' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '10 10', expectedOutput: '50', isHidden: false, order: 1 },
      { input: '1 1', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '6 8', expectedOutput: '24', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'String Concatenation and Length',
    slug: 'js-l1-string-concat-length',
    description: 'Given two strings S1 and S2, print their concatenated result followed by the total length separated by space.',
    inputFormat: 'Two space-separated strings S1 and S2.',
    outputFormat: 'Print concatenated_string length.',
    constraints: '1 <= |S1|, |S2| <= 100',
    examples: [{ input: 'hello world', output: 'helloworld 10' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: 'code js', expectedOutput: 'codejs 6', isHidden: false, order: 1 },
      { input: 'a b', expectedOutput: 'ab 2', isHidden: true, order: 2 },
      { input: 'super portal', expectedOutput: 'superportal 11', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check FizzBuzz Divisibility',
    slug: 'js-l1-fizzbuzz-check',
    description: 'Given integer N: print "FizzBuzz" if divisible by 15, "Fizz" if divisible by 3, "Buzz" if divisible by 5, else print N.',
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Print result string or integer.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '15', output: 'FizzBuzz' }, { input: '9', output: 'Fizz' }, { input: '10', output: 'Buzz' }, { input: '7', output: '7' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '30', expectedOutput: 'FizzBuzz', isHidden: false, order: 1 },
      { input: '6', expectedOutput: 'Fizz', isHidden: true, order: 2 },
      { input: '2', expectedOutput: '2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Simple Calculator in JavaScript',
    slug: 'js-l1-simple-calculator',
    description: 'Read integers A, B and operator op (+, -, *). Print the calculated integer result.',
    inputFormat: 'Integer A, integer B, and character op separated by space.',
    outputFormat: 'Print result integer.',
    constraints: '-1000 <= A, B <= 1000',
    examples: [{ input: '12 4 +', output: '16' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '20 5 -', expectedOutput: '15', isHidden: false, order: 1 },
      { input: '6 7 *', expectedOutput: '42', isHidden: true, order: 2 },
      { input: '-3 5 +', expectedOutput: '2', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 2 (10 Questions: Loops, Arrays, Objects & String Methods) ---
  {
    title: 'Reverse an Array in JS',
    slug: 'js-l2-reverse-array',
    description: 'Given an array of N integers, print the elements in reverse order separated by space without using built-in reverse().',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print reversed integers separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 2 3 4', output: '4 3 2 1' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
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
    title: 'Find Maximum and Minimum in Array',
    slug: 'js-l2-max-min-array',
    description: 'Given an array of N integers, find maximum and minimum elements. Print "max min".',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print max min.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n10 50 3 20 90', output: '90 3' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '3 1', isHidden: false, order: 1 },
      { input: '1\n5', expectedOutput: '5 5', isHidden: true, order: 2 },
      { input: '4\n-10 -20 -5 -1', expectedOutput: '-1 -20', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Palindrome String in JS',
    slug: 'js-l2-palindrome-string',
    description: 'Check if string S is a palindrome. Print "true" or "false".',
    inputFormat: 'A single string S without spaces.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'racecar', output: 'true' }, { input: 'javascript', output: 'false' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'madam', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: 'hello', expectedOutput: 'false', isHidden: true, order: 2 },
      { input: 'a', expectedOutput: 'true', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Count Character Frequency',
    slug: 'js-l2-char-frequency',
    description: 'Count how many times character C appears in lowercase string S.',
    inputFormat: 'First line string S. Second line character C.',
    outputFormat: 'Print frequency count.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'banana\na', output: '3' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
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
    title: 'Sum of Array Elements with reduce',
    slug: 'js-l2-array-sum-reduce',
    description: 'Given an array of N integers, compute their sum using Array.prototype.reduce.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print total sum.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 2 3 4', output: '10' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '60', isHidden: false, order: 1 },
      { input: '1\n99', expectedOutput: '99', isHidden: true, order: 2 },
      { input: '4\n-5 5 -10 10', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Filter Even Numbers with Array.filter',
    slug: 'js-l2-array-filter-even',
    description: 'Given an array of N integers, filter and print all even numbers separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print even numbers separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5\n1 2 3 4 5', output: '2 4' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
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
    title: 'Find Index of Target Element',
    slug: 'js-l2-array-index-of',
    description: 'Given an array of N integers and target X, print the 0-based index of first occurrence of X, or -1 if not found.',
    inputFormat: 'First line N and X. Second line N space-separated integers.',
    outputFormat: 'Print 0-based index or -1.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5 30\n10 20 30 40 50', output: '2' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
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
    title: 'Flatten 2D Array by One Level',
    slug: 'js-l2-flatten-2d-array',
    description: 'Given an R x C 2D array, flatten into a 1D array using flat() or concat() and print elements separated by space.',
    inputFormat: 'First line R and C. Following R lines contain C integers each.',
    outputFormat: 'Print flattened array elements separated by space.',
    constraints: '1 <= R, C <= 50',
    examples: [{ input: '2 3\n1 2 3\n4 5 6', output: '1 2 3 4 5 6' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2 2\n10 20\n30 40', expectedOutput: '10 20 30 40', isHidden: false, order: 1 },
      { input: '3 1\n5\n10\n15', expectedOutput: '5 10 15', isHidden: true, order: 2 },
      { input: '1 3\n7 8 9', expectedOutput: '7 8 9', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Object Key-Value Inversion',
    slug: 'js-l2-object-inversion',
    description: 'Given N (key, value) pairs where all keys and values are unique strings, invert mapping to value->key and print in alphabetical order of new keys.',
    inputFormat: 'First line N. Next N lines contain key and value.',
    outputFormat: 'Print "new_key: new_value" on separate lines.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '2\na 1\nb 2', output: '1: a\n2: b' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\nfirst 1\nsecond 2\nthird 3', expectedOutput: '1: first\n2: second\n3: third', isHidden: false, order: 1 },
      { input: '1\nx y', expectedOutput: 'y: x', isHidden: true, order: 2 },
      { input: '2\nalpha A\nbeta B', expectedOutput: 'A: alpha\nB: beta', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Title Case a Sentence',
    slug: 'js-l2-title-case-sentence',
    description: 'Capitalize the first letter of each word in a lowercase sentence S and print the title-cased sentence.',
    inputFormat: 'A line of lowercase words separated by space.',
    outputFormat: 'Print title-cased string.',
    constraints: '1 <= length <= 1000',
    examples: [{ input: 'college assessment portal', output: 'College Assessment Portal' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'hello world', expectedOutput: 'Hello World', isHidden: false, order: 1 },
      { input: 'javascript is awesome', expectedOutput: 'Javascript Is Awesome', isHidden: true, order: 2 },
      { input: 'code', expectedOutput: 'Code', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 3 (10 Questions: Closures, Higher-Order Functions, Sets & Maps) ---
  {
    title: 'Custom Map Function Implementation',
    slug: 'js-l3-custom-map',
    description: 'Implement a function myMap(arr, fn). Given an array of N integers, multiply each by 2 using myMap and print separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print transformed elements separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 2 3 4', output: '2 4 6 8' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '20 40 60', isHidden: false, order: 1 },
      { input: '1\n5', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '4\n0 -2 5 10', expectedOutput: '0 -4 10 20', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Find Unique Elements using Set',
    slug: 'js-l3-unique-set',
    description: 'Given N integers, use new Set() to find unique elements and print them in ascending order separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print unique elements in sorted order.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '6\n4 2 4 5 2 1', output: '1 2 4 5' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '5\n1 1 1 1 1', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '4\n10 20 30 40', expectedOutput: '10 20 30 40', isHidden: true, order: 2 },
      { input: '4\n3 2 3 2', expectedOutput: '2 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Two Sum Problem with Map',
    slug: 'js-l3-two-sum-map',
    description: 'Find two 0-based indices i and j (i < j) such that arr[i] + arr[j] == target using new Map() in O(N).',
    inputFormat: 'First line N and Target. Second line N space-separated integers.',
    outputFormat: 'Print i and j separated by space.',
    constraints: '2 <= N <= 10^5',
    examples: [{ input: '4 9\n2 7 11 15', output: '0 1' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
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
    title: 'Group By Property with reduce',
    slug: 'js-l3-group-by-reduce',
    description: 'Given N items with (name, category), group names by category. Print each category and its count in format "category: count" in alphabetical order.',
    inputFormat: 'First line N. Next N lines contain name and category.',
    outputFormat: 'Print "category: count" on separate lines.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '4\napple fruit\ncarrot veg\nbanana fruit\nspinach veg', output: 'fruit: 2\nveg: 2' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\na cat\nb cat\nc dog', expectedOutput: 'cat: 2\ndog: 1', isHidden: false, order: 1 },
      { input: '2\nx red\ny red', expectedOutput: 'red: 2', isHidden: true, order: 2 },
      { input: '1\nsolo test', expectedOutput: 'test: 1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Function Composition (pipe)',
    slug: 'js-l3-function-composition',
    description: 'Given initial integer X, apply two functions: f(x) = x * 2, then g(x) = x + 3. Print the composed result g(f(X)).',
    inputFormat: 'A single integer X.',
    outputFormat: 'Print result integer.',
    constraints: '-1000 <= X <= 1000',
    examples: [{ input: '5', output: '13', explanation: 'f(5) = 10; g(10) = 13.' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '10', expectedOutput: '23', isHidden: true, order: 2 },
      { input: '-4', expectedOutput: '-5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Memoize Fibonacci in JavaScript',
    slug: 'js-l3-memoize-fibonacci',
    description: 'Compute the Nth Fibonacci number using a memoized function cache.',
    inputFormat: 'A non-negative integer N.',
    outputFormat: 'Print Nth Fibonacci number.',
    constraints: '0 <= N <= 35',
    examples: [{ input: '10', output: '55' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: '0', isHidden: false, order: 1 },
      { input: '15', expectedOutput: '610', isHidden: true, order: 2 },
      { input: '20', expectedOutput: '6765', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Chunk Array into Subarrays of Size K',
    slug: 'js-l3-chunk-array',
    description: 'Given an array of N integers and chunk size K, divide the array into chunks of size K. Print the number of chunks formed.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print number of chunks.',
    constraints: '1 <= K <= N <= 1000',
    examples: [{ input: '5 2\n1 2 3 4 5', output: '3', explanation: 'Chunks: [1,2], [3,4], [5].' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '6 3\n1 2 3 4 5 6', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '4 5\n1 2 3 4', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '10 1\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '10', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Deep Clone Object Simulation',
    slug: 'js-l3-deep-clone',
    description: 'Parse a JSON string representing an object, clone it, add a property "cloned: true", and output the serialized result.',
    inputFormat: 'A valid single-line JSON string.',
    outputFormat: 'Print JSON string with "cloned":true added.',
    constraints: 'Valid JSON string <= 500 chars.',
    examples: [{ input: '{"name":"Alex","age":25}', output: '{"name":"Alex","age":25,"cloned":true}' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '{"score":100}', expectedOutput: '{"score":100,"cloned":true}', isHidden: false, order: 1 },
      { input: '{"id":"A1"}', expectedOutput: '{"id":"A1","cloned":true}', isHidden: true, order: 2 },
      { input: '{}', expectedOutput: '{"cloned":true}', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Custom Filter Function',
    slug: 'js-l3-custom-filter',
    description: 'Implement myFilter(arr, predicate). Filter elements > X and print them separated by space.',
    inputFormat: 'First line N and X. Second line N space-separated integers.',
    outputFormat: 'Print filtered integers separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '5 10\n5 12 8 20 15', output: '12 20 15' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 0\n-5 2 -1 3', expectedOutput: '2 3', isHidden: false, order: 1 },
      { input: '3 50\n10 20 30', expectedOutput: '', isHidden: true, order: 2 },
      { input: '3 5\n6 7 8', expectedOutput: '6 7 8', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Currying Addition Function',
    slug: 'js-l3-currying-addition',
    description: 'Implement a curried addition function add(a)(b)(c). Given three integers A, B, and C, compute and print add(A)(B)(C).',
    inputFormat: 'Three space-separated integers A, B, and C.',
    outputFormat: 'Print total sum.',
    constraints: '-10^6 <= A, B, C <= 10^6',
    examples: [{ input: '1 2 3', output: '6' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '10 20 30', expectedOutput: '60', isHidden: false, order: 1 },
      { input: '-5 5 10', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '0 0 0', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 4 (10 Questions: Complex Data Structures & Algorithms in JS) ---
  {
    title: 'Valid Parentheses Checker in JS',
    slug: 'js-l4-valid-parentheses',
    description: 'Determine if string of brackets ()[]{} is valid using an array as stack. Print "true" or "false".',
    inputFormat: 'A string of brackets.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= length <= 1000',
    examples: [{ input: '{[()]}', output: 'true' }, { input: '{[(])}', output: 'false' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '()', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '((', expectedOutput: 'false', isHidden: true, order: 2 },
      { input: '[]{}()', expectedOutput: 'true', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Binary Search in Sorted Array',
    slug: 'js-l4-binary-search',
    description: 'Find target X in sorted array of N integers using binary search in O(log N). Print 0-based index or -1.',
    inputFormat: 'First line N and X. Second line N sorted space-separated integers.',
    outputFormat: 'Print 0-based index or -1.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '5 30\n10 20 30 40 50', output: '2' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4 7\n1 3 7 9', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '3 99\n10 20 30', expectedOutput: '-1', isHidden: true, order: 2 },
      { input: '5 5\n1 2 3 4 5', expectedOutput: '4', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Longest Common Prefix in JS',
    slug: 'js-l4-longest-common-prefix',
    description: 'Given N strings, find the longest common prefix. If none, print empty line.',
    inputFormat: 'First line N. Next N lines contain one string each.',
    outputFormat: 'Print the longest common prefix string.',
    constraints: '1 <= N <= 200',
    examples: [{ input: '3\nflower\nflow\nflight', output: 'fl' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\ndog\nracecar\ncar', expectedOutput: '', isHidden: false, order: 1 },
      { input: '2\napple\napp', expectedOutput: 'app', isHidden: true, order: 2 },
      { input: '1\nsingle', expectedOutput: 'single', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Merge Two Sorted Arrays in JS',
    slug: 'js-l4-merge-sorted-arrays',
    description: 'Given two sorted arrays of size N and M, merge into one sorted array and print separated by space.',
    inputFormat: 'First line N and M. Second line N integers. Third line M integers.',
    outputFormat: 'Print merged sorted elements.',
    constraints: '1 <= N, M <= 500',
    examples: [{ input: '3 3\n1 3 5\n2 4 6', output: '1 2 3 4 5 6' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '2 2\n5 10\n2 8', expectedOutput: '2 5 8 10', isHidden: false, order: 1 },
      { input: '1 2\n1\n2 3', expectedOutput: '1 2 3', isHidden: true, order: 2 },
      { input: '3 1\n10 20 30\n5', expectedOutput: '5 10 20 30', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Maximum Subarray Sum (Kadane in JS)',
    slug: 'js-l4-kadane-max-subarray',
    description: 'Find the maximum subarray sum in an array of N integers using Kadane algorithm.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print maximum subarray sum.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '8\n-2 -3 4 -1 -2 1 5 -3', output: '7' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1', isHidden: false, order: 1 },
      { input: '3\n1 2 3', expectedOutput: '6', isHidden: true, order: 2 },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isHidden: true, order: 3 }
    ]
  },
  {
    title: '0/1 Knapsack Problem in JS',
    slug: 'js-l4-knapsack-js',
    description: 'Given N items with values V and weights W, and capacity C, calculate maximum value using DP.',
    inputFormat: 'First line N and C. Second line N values. Third line N weights.',
    outputFormat: 'Print max value.',
    constraints: '1 <= N <= 100, 1 <= C <= 500',
    examples: [{ input: '3 50\n60 100 120\n10 20 30', output: '220' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 4\n1 2 3\n4 5 1', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '2 3\n10 20\n3 4', expectedOutput: '10', isHidden: true, order: 2 },
      { input: '1 10\n50\n5', expectedOutput: '50', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Breadth-First Search on Adjacency List',
    slug: 'js-l4-bfs-adjacency-list',
    description: 'Given graph with V vertices (0 to V-1) and E edges, print BFS traversal from vertex 0.',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print BFS nodes separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 4\n0 1\n0 2\n1 2\n2 3', output: '0 1 2 3' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n0 1\n0 2', expectedOutput: '0 1 2', isHidden: false, order: 1 },
      { input: '4 3\n0 1\n1 2\n2 3', expectedOutput: '0 1 2 3', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters in JS',
    slug: 'js-l4-longest-unique-substring',
    description: 'Find length of the longest substring without repeating characters in S.',
    inputFormat: 'A string S without spaces.',
    outputFormat: 'Print max length integer.',
    constraints: '0 <= |S| <= 10^4',
    examples: [{ input: 'abcabcbb', output: '3' }, { input: 'bbbbb', output: '1' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: 'pwwkew', expectedOutput: '3', isHidden: false, order: 1 },
      { input: 'abcdef', expectedOutput: '6', isHidden: true, order: 2 },
      { input: 'a', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Coin Change Minimum Coins in JS',
    slug: 'js-l4-coin-change-js',
    description: 'Given N coin values and target V, find minimum coins needed or -1 if impossible.',
    inputFormat: 'First line N and V. Second line N coin values.',
    outputFormat: 'Print minimum coins or -1.',
    constraints: '1 <= N <= 50, 1 <= V <= 1000',
    examples: [{ input: '3 11\n1 2 5', output: '3' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '1 2\n3', expectedOutput: '-1', isHidden: false, order: 1 },
      { input: '4 30\n1 5 10 25', expectedOutput: '2', isHidden: true, order: 2 },
      { input: '3 0\n1 2 5', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Stack Implementation in JS',
    slug: 'js-l4-stack-class',
    description: 'Implement a Stack class (push, pop). Process Q queries: 1 X (push X), 2 (pop and print, or -1 if empty).',
    inputFormat: 'First line Q. Next Q lines contain query.',
    outputFormat: 'Print output of pop operations on new lines.',
    constraints: '1 <= Q <= 1000',
    examples: [{ input: '4\n1 10\n1 20\n2\n2', output: '20\n10' }],
    allowedLanguages: ['javascript'],
    courseSlug: 'javascript',
    targetLevel: 4,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n1 5\n2\n2', expectedOutput: '5\n-1', isHidden: false, order: 1 },
      { input: '4\n1 1\n1 2\n1 3\n2', expectedOutput: '3', isHidden: true, order: 2 },
      { input: '2\n2\n2', expectedOutput: '-1\n-1', isHidden: true, order: 3 }
    ]
  }
];

