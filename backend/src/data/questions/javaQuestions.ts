import { RawQuestionData } from './cQuestions';

export const JAVA_QUESTIONS: RawQuestionData[] = [
  // --- LEVEL 1 (10 Questions: Java Syntax, Scanner, Primitive Types, Conditionals) ---
  {
    title: 'Java Scanner Addition',
    slug: 'java-l1-scanner-addition',
    description: 'Read two integers A and B from System.in using Scanner and print their sum to System.out.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print the sum integer.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '7 14', output: '21' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '15 25', expectedOutput: '40', isHidden: false, order: 1 },
      { input: '-50 50', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '1000 234', expectedOutput: '1234', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Positive, Negative or Zero',
    slug: 'java-l1-check-sign',
    description: 'Given an integer N, print "Positive", "Negative", or "Zero".',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "Positive", "Negative", or "Zero".',
    constraints: '-10^9 <= N <= 10^9',
    examples: [{ input: '5', output: 'Positive' }, { input: '-3', output: 'Negative' }, { input: '0', output: 'Zero' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '42', expectedOutput: 'Positive', isHidden: false, order: 1 },
      { input: '-99', expectedOutput: 'Negative', isHidden: true, order: 2 },
      { input: '0', expectedOutput: 'Zero', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Largest of Two Numbers (Math.max)',
    slug: 'java-l1-largest-two-numbers',
    description: 'Given two integers X and Y, output the larger number using Math.max.',
    inputFormat: 'Two space-separated integers X and Y.',
    outputFormat: 'Print the larger value.',
    constraints: '-10^9 <= X, Y <= 10^9',
    examples: [{ input: '15 28', output: '28' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '50 20', expectedOutput: '50', isHidden: false, order: 1 },
      { input: '-5 -1', expectedOutput: '-1', isHidden: true, order: 2 },
      { input: '10 10', expectedOutput: '10', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Simple Interest Calculator',
    slug: 'java-l1-simple-interest',
    description: 'Calculate simple interest (P * R * T) / 100 given principal P, rate R, and time T. Print the integer part of the interest.',
    inputFormat: 'Three space-separated integers P, R, and T.',
    outputFormat: 'Print integer simple interest.',
    constraints: '1 <= P <= 10^6, 1 <= R <= 50, 1 <= T <= 30',
    examples: [{ input: '1000 5 2', output: '100' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '2000 10 3', expectedOutput: '600', isHidden: false, order: 1 },
      { input: '500 4 1', expectedOutput: '20', isHidden: true, order: 2 },
      { input: '10000 7 5', expectedOutput: '3500', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Divisibility by 5 and 11',
    slug: 'java-l1-divisibility-check',
    description: 'Check if integer N is divisible by both 5 and 11. Print "YES" or "NO".',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 10^9',
    examples: [{ input: '55', output: 'YES' }, { input: '25', output: 'NO' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '110', expectedOutput: 'YES', isHidden: false, order: 1 },
      { input: '33', expectedOutput: 'NO', isHidden: true, order: 2 },
      { input: '550', expectedOutput: 'YES', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Grade Calculator',
    slug: 'java-l1-grade-calculator',
    description: 'Given score (0-100), print: "A" for >=90, "B" for >=80, "C" for >=70, "D" for >=60, otherwise "F".',
    inputFormat: 'A single integer score.',
    outputFormat: 'Print the letter grade.',
    constraints: '0 <= score <= 100',
    examples: [{ input: '85', output: 'B' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '95', expectedOutput: 'A', isHidden: false, order: 1 },
      { input: '72', expectedOutput: 'C', isHidden: true, order: 2 },
      { input: '45', expectedOutput: 'F', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Number to Word (Single Digit 0-9)',
    slug: 'java-l1-digit-to-word',
    description: 'Convert a single digit (0-9) to its English word using switch statement (Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine).',
    inputFormat: 'A single digit integer D (0 <= D <= 9).',
    outputFormat: 'Print the English word.',
    constraints: '0 <= D <= 9',
    examples: [{ input: '4', output: 'Four' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '0', expectedOutput: 'Zero', isHidden: false, order: 1 },
      { input: '7', expectedOutput: 'Seven', isHidden: true, order: 2 },
      { input: '9', expectedOutput: 'Nine', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Sum of Digits in Integer',
    slug: 'java-l1-sum-of-digits',
    description: 'Given a non-negative integer N, calculate the sum of its digits.',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the sum of digits.',
    constraints: '0 <= N <= 10^9',
    examples: [{ input: '1234', output: '10' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '99', expectedOutput: '18', isHidden: false, order: 1 },
      { input: '5', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '10005', expectedOutput: '6', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Alphabet Character',
    slug: 'java-l1-is-letter-check',
    description: 'Given a character ch, print "Alphabet" if Character.isLetter(ch) is true, otherwise "Not Alphabet".',
    inputFormat: 'A single character ch.',
    outputFormat: 'Print "Alphabet" or "Not Alphabet".',
    constraints: 'Any ASCII character.',
    examples: [{ input: 'G', output: 'Alphabet' }, { input: '9', output: 'Not Alphabet' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: 'z', expectedOutput: 'Alphabet', isHidden: false, order: 1 },
      { input: '$', expectedOutput: 'Not Alphabet', isHidden: true, order: 2 },
      { input: 'A', expectedOutput: 'Alphabet', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Swap Two Variables in Java',
    slug: 'java-l1-swap-numbers',
    description: 'Read two integers A and B, swap them, and print B and A separated by space.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print swapped integers B and A separated by space.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [{ input: '3 7', output: '7 3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    testCases: [
      { input: '100 200', expectedOutput: '200 100', isHidden: false, order: 1 },
      { input: '-1 1', expectedOutput: '1 -1', isHidden: true, order: 2 },
      { input: '0 5', expectedOutput: '5 0', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 2 (10 Questions: Loops, Arrays & String Manipulation) ---
  {
    title: 'Reverse an Array in Java',
    slug: 'java-l2-reverse-array',
    description: 'Given an array of N integers, print the elements in reverse order separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print reversed array.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n1 2 3 4', output: '4 3 2 1' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n10 20 30', expectedOutput: '30 20 10', isHidden: false, order: 1 },
      { input: '1\n5', expectedOutput: '5', isHidden: true, order: 2 },
      { input: '5\n5 4 3 2 1', expectedOutput: '1 2 3 4 5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Find Second Smallest Element',
    slug: 'java-l2-second-smallest',
    description: 'Given an array of N distinct integers, find and print the second smallest element.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print second smallest integer.',
    constraints: '2 <= N <= 1000',
    examples: [{ input: '5\n12 1 35 10 34', output: '10' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n9 3 7 1', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '2\n100 50', expectedOutput: '100', isHidden: true, order: 2 },
      { input: '3\n-10 -20 -5', expectedOutput: '-10', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'String Compression (Run-Length)',
    slug: 'java-l2-string-compression',
    description: 'Compress consecutive duplicate characters in string S: "aabcccccaaa" -> "a2b1c5a3". Print compressed string.',
    inputFormat: 'A string S of lowercase letters.',
    outputFormat: 'Print compressed string.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'aabcccccaaa', output: 'a2b1c5a3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'abc', expectedOutput: 'a1b1c1', isHidden: false, order: 1 },
      { input: 'aaaa', expectedOutput: 'a4', isHidden: true, order: 2 },
      { input: 'a', expectedOutput: 'a1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Two Sum Target Problem',
    slug: 'java-l2-two-sum',
    description: 'Given an array of N integers and target T, find two distinct 0-based indices i and j such that arr[i] + arr[j] == T. Print "i j".',
    inputFormat: 'First line N and T. Second line N space-separated integers.',
    outputFormat: 'Print i and j separated by space (i < j).',
    constraints: '2 <= N <= 1000',
    examples: [{ input: '4 9\n2 7 11 15', output: '0 1' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3 6\n3 2 4', expectedOutput: '1 2', isHidden: false, order: 1 },
      { input: '2 6\n3 3', expectedOutput: '0 1', isHidden: true, order: 2 },
      { input: '4 10\n1 5 5 9', expectedOutput: '0 3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Matrix Addition in Java',
    slug: 'java-l2-matrix-addition',
    description: 'Add two R x C matrices and print the resulting matrix.',
    inputFormat: 'First line R and C. Next R lines matrix 1. Next R lines matrix 2.',
    outputFormat: 'Print sum matrix (R lines of C integers each).',
    constraints: '1 <= R, C <= 50',
    examples: [{ input: '2 2\n1 2\n3 4\n5 6\n7 8', output: '6 8\n10 12' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 2\n5 10\n2 3', expectedOutput: '7 13', isHidden: false, order: 1 },
      { input: '2 1\n3\n4\n1\n2', expectedOutput: '4\n6', isHidden: true, order: 2 },
      { input: '2 2\n0 0\n0 0\n1 1\n1 1', expectedOutput: '1 1\n1 1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Palindrome Words Count',
    slug: 'java-l2-count-palindrome-words',
    description: 'Given a sentence of whitespace-separated words, count how many words are palindromes.',
    inputFormat: 'A single line of text with lowercase words.',
    outputFormat: 'Print count of palindrome words.',
    constraints: '1 <= length <= 1000',
    examples: [{ input: 'madam speaks civic language radar', output: '3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'racecar level noon', expectedOutput: '3', isHidden: false, order: 1 },
      { input: 'hello world', expectedOutput: '0', isHidden: true, order: 2 },
      { input: 'a b c', expectedOutput: '3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Rotate Array Right by K Steps',
    slug: 'java-l2-rotate-array-right',
    description: 'Rotate an array of N integers to the right by K positions and print elements separated by space.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print rotated array.',
    constraints: '1 <= N <= 1000, 0 <= K <= 1000',
    examples: [{ input: '5 2\n1 2 3 4 5', output: '4 5 1 2 3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4 1\n10 20 30 40', expectedOutput: '40 10 20 30', isHidden: false, order: 1 },
      { input: '3 0\n1 2 3', expectedOutput: '1 2 3', isHidden: true, order: 2 },
      { input: '3 3\n5 6 7', expectedOutput: '5 6 7', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Longest Word in Sentence',
    slug: 'java-l2-longest-word',
    description: 'Find and print the longest word in a sentence. If ties, print the first one.',
    inputFormat: 'A single line of text.',
    outputFormat: 'Print the longest word.',
    constraints: '1 <= length <= 1000',
    examples: [{ input: 'Welcome to Java assessment portal', output: 'assessment' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'Coding in Java is super fun', expectedOutput: 'Coding', isHidden: false, order: 1 },
      { input: 'Short word', expectedOutput: 'Short', isHidden: true, order: 2 },
      { input: 'One', expectedOutput: 'One', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Check Digits Only in String',
    slug: 'java-l2-digits-only-string',
    description: 'Check if string S contains only numerical digits (0-9). Print "Yes" or "No".',
    inputFormat: 'A single string S without spaces.',
    outputFormat: 'Print "Yes" or "No".',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: '12345', output: 'Yes' }, { input: '12a45', output: 'No' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '98701', expectedOutput: 'Yes', isHidden: false, order: 1 },
      { input: 'hello', expectedOutput: 'No', isHidden: true, order: 2 },
      { input: '0', expectedOutput: 'Yes', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Character Frequency Array',
    slug: 'java-l2-char-frequency-hash',
    description: 'Count frequencies of all lowercase characters in string S. Print characters and counts in alphabetical order format "c:count".',
    inputFormat: 'A lowercase string S.',
    outputFormat: 'Print each character frequency on a new line.',
    constraints: '1 <= |S| <= 1000',
    examples: [{ input: 'banana', output: 'a:3\nb:1\nn:2' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'cba', expectedOutput: 'a:1\nb:1\nc:1', isHidden: false, order: 1 },
      { input: 'test', expectedOutput: 'e:1\ns:1\nt:2', isHidden: true, order: 2 },
      { input: 'z', expectedOutput: 'z:1', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 3 (10 Questions: OOP, Methods, Inheritance & Interfaces) ---
  {
    title: 'Employee Salary Calculator Class',
    slug: 'java-l3-employee-salary-class',
    description: 'Class Employee has basicSalary. Total salary = basicSalary + 20% HRA + 10% DA. Print total integer salary.',
    inputFormat: 'A single integer basicSalary.',
    outputFormat: 'Print total salary integer.',
    constraints: '1000 <= basicSalary <= 10^6',
    examples: [{ input: '10000', output: '13000' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '20000', expectedOutput: '26000', isHidden: false, order: 1 },
      { input: '50000', expectedOutput: '65000', isHidden: true, order: 2 },
      { input: '1000', expectedOutput: '1300', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Vehicle and Car Inheritance',
    slug: 'java-l3-vehicle-inheritance',
    description: 'Base class Vehicle has speed. Derived class Car adds modelName. Given modelName and speed, print "Car modelName running at speed km/h".',
    inputFormat: 'String modelName and integer speed.',
    outputFormat: 'Print description string.',
    constraints: '0 <= speed <= 300',
    examples: [{ input: 'Sedan 120', output: 'Car Sedan running at 120 km/h' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'Tesla 150', expectedOutput: 'Car Tesla running at 150 km/h', isHidden: false, order: 1 },
      { input: 'Beetle 80', expectedOutput: 'Car Beetle running at 80 km/h', isHidden: true, order: 2 },
      { input: 'Kart 40', expectedOutput: 'Car Kart running at 40 km/h', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Bank Transfer Simulation',
    slug: 'java-l3-bank-transfer',
    description: 'Account A has balance1, Account B has balance2. Transfer amount X from A to B if balance1 >= X. Print "balance1 balance2".',
    inputFormat: 'Three integers balance1 balance2 X.',
    outputFormat: 'Print final balance1 balance2.',
    constraints: '0 <= balances, X <= 10^6',
    examples: [{ input: '500 200 150', output: '350 350' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '100 50 150', expectedOutput: '100 50', isHidden: false, order: 1 },
      { input: '1000 0 1000', expectedOutput: '0 1000', isHidden: true, order: 2 },
      { input: '300 200 50', expectedOutput: '250 250', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Overloaded Area Method',
    slug: 'java-l3-overloaded-area',
    description: 'Overload area(): area(int side) for square; area(int l, int b) for rectangle. Given code (1 for square, 2 for rectangle) followed by dimensions, print area.',
    inputFormat: 'Integer code (1 or 2) followed by dimensions.',
    outputFormat: 'Print computed area.',
    constraints: '1 <= dimensions <= 1000',
    examples: [{ input: '1 5', output: '25' }, { input: '2 4 6', output: '24' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 10', expectedOutput: '100', isHidden: false, order: 1 },
      { input: '2 3 8', expectedOutput: '24', isHidden: true, order: 2 },
      { input: '1 1', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Custom Age Exception Validation',
    slug: 'java-l3-age-exception',
    description: 'If age < 18, throw InvalidAgeException and print "Underage"; otherwise print "Eligible".',
    inputFormat: 'A single integer age.',
    outputFormat: 'Print "Underage" or "Eligible".',
    constraints: '0 <= age <= 120',
    examples: [{ input: '21', output: 'Eligible' }, { input: '15', output: 'Underage' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '18', expectedOutput: 'Eligible', isHidden: false, order: 1 },
      { input: '17', expectedOutput: 'Underage', isHidden: true, order: 2 },
      { input: '65', expectedOutput: 'Eligible', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Comparable Student Sort by GPA',
    slug: 'java-l3-comparable-student',
    description: 'Implement Comparable<Student>. Given N students with name and GPA, sort in descending order of GPA. Print sorted names on separate lines.',
    inputFormat: 'First line N. Next N lines contain name and GPA (integer percentage).',
    outputFormat: 'Print student names in sorted order.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '3\nAlice 85\nBob 95\nCharlie 75', output: 'Bob\nAlice\nCharlie' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '2\nJohn 70\nJane 80', expectedOutput: 'Jane\nJohn', isHidden: false, order: 1 },
      { input: '1\nSolo 100', expectedOutput: 'Solo', isHidden: true, order: 2 },
      { input: '3\nA 10\nB 30\nC 20', expectedOutput: 'B\nC\nA', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Singleton Pattern Counter',
    slug: 'java-l3-singleton-counter',
    description: 'Singleton class Counter has value starting at 0 and method increment(). Given N, increment N times and print getInstance().getValue().',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print final counter value.',
    constraints: '1 <= N <= 10^5',
    examples: [{ input: '5', output: '5' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '10', expectedOutput: '10', isHidden: false, order: 1 },
      { input: '100', expectedOutput: '100', isHidden: true, order: 2 },
      { input: '1', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Polymorphic Shape Area',
    slug: 'java-l3-polymorphic-shape',
    description: 'Abstract class Shape has getArea(). Circle has radius R (area = 3 * R * R); Square has side S (area = S * S). Code 1 = Circle, 2 = Square.',
    inputFormat: 'Integer code (1 or 2) and dimension.',
    outputFormat: 'Print integer area.',
    constraints: '1 <= dimension <= 1000',
    examples: [{ input: '1 5', output: '75' }, { input: '2 4', output: '16' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '1 10', expectedOutput: '300', isHidden: false, order: 1 },
      { input: '2 8', expectedOutput: '64', isHidden: true, order: 2 },
      { input: '1 1', expectedOutput: '3', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Encapsulation with Getters & Setters',
    slug: 'java-l3-encapsulation',
    description: 'Class User has private String name and private int age. If age < 0, age is set to 0. Given name and age, print "Name: name, Age: age".',
    inputFormat: 'String name and integer age.',
    outputFormat: 'Print formatted user info.',
    constraints: '-100 <= age <= 150',
    examples: [{ input: 'Alice 25', output: 'Name: Alice, Age: 25' }, { input: 'Bob -5', output: 'Name: Bob, Age: 0' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'Charlie 0', expectedOutput: 'Name: Charlie, Age: 0', isHidden: false, order: 1 },
      { input: 'Diana 30', expectedOutput: 'Name: Diana, Age: 30', isHidden: true, order: 2 },
      { input: 'Eve -10', expectedOutput: 'Name: Eve, Age: 0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Interface Callback Simulation',
    slug: 'java-l3-interface-callback',
    description: 'Interface NotificationListener has onNotify(String msg). Implement listener that prints "ALERT: msg". Given msg, invoke callback.',
    inputFormat: 'A string message without spaces.',
    outputFormat: 'Print "ALERT: msg".',
    constraints: '1 <= |msg| <= 100',
    examples: [{ input: 'SystemReady', output: 'ALERT: SystemReady' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 3,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: 'FireEmergency', expectedOutput: 'ALERT: FireEmergency', isHidden: false, order: 1 },
      { input: 'ExamStarted', expectedOutput: 'ALERT: ExamStarted', isHidden: true, order: 2 },
      { input: 'OK', expectedOutput: 'ALERT: OK', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 4 (10 Questions: Java Collections Framework) ---
  {
    title: 'Reverse a LinkedList in Java',
    slug: 'java-l4-reverse-linkedlist',
    description: 'Given N integers inserted into java.util.LinkedList, reverse using Collections.reverse() and print separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print reversed LinkedList elements.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n10 20 30 40', output: '40 30 20 10' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '3 2 1', isHidden: false, order: 1 },
      { input: '1\n99', expectedOutput: '99', isHidden: true, order: 2 },
      { input: '5\n5 10 15 20 25', expectedOutput: '25 20 15 10 5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Word Frequency with HashMap',
    slug: 'java-l4-word-frequency-hashmap',
    description: 'Given N words, use HashMap<String, Integer> to count frequencies. Print words and frequencies in alphabetical order.',
    inputFormat: 'First line N. Next N lines contain one word each.',
    outputFormat: 'Print "word: count" in alphabetical order.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\napple\nbanana\napple\norange', output: 'apple: 2\nbanana: 1\norange: 1' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\ncat\ndog\ncat', expectedOutput: 'cat: 2\ndog: 1', isHidden: false, order: 1 },
      { input: '2\nz\nz', expectedOutput: 'z: 2', isHidden: true, order: 2 },
      { input: '1\nhello', expectedOutput: 'hello: 1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Parentheses Matching with Stack',
    slug: 'java-l4-stack-parentheses',
    description: 'Validate brackets string using java.util.Stack<Character>. Print "true" or "false".',
    inputFormat: 'A string containing ()[]{}.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= length <= 1000',
    examples: [{ input: '()[]{}', output: 'true' }, { input: '(]', output: 'false' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '{[()]}', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '([)]', expectedOutput: 'false', isHidden: true, order: 2 },
      { input: '(', expectedOutput: 'false', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Remove Duplicates with LinkedHashSet',
    slug: 'java-l4-remove-duplicates-set',
    description: 'Given N integers, preserve original first-occurrence order while removing duplicates using LinkedHashSet. Print elements separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print distinct elements separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '6\n4 5 4 2 5 1', output: '4 5 2 1' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '5\n1 1 1 1 1', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '4\n10 20 30 40', expectedOutput: '10 20 30 40', isHidden: true, order: 2 },
      { input: '4\n3 2 3 2', expectedOutput: '3 2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'PriorityQueue Kth Smallest Element',
    slug: 'java-l4-kth-smallest-pq',
    description: 'Find the K-th smallest element in an array of N integers using java.util.PriorityQueue.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print K-th smallest element.',
    constraints: '1 <= K <= N <= 1000',
    examples: [{ input: '6 3\n7 10 4 3 20 15', output: '7' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '5 1\n5 4 3 2 1', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '4 4\n10 20 30 40', expectedOutput: '40', isHidden: true, order: 2 },
      { input: '1 1\n42', expectedOutput: '42', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Group Anagrams (HashMap)',
    slug: 'java-l4-group-anagrams',
    description: 'Given N words, group anagrams together and print the size of the largest group.',
    inputFormat: 'First line N. Next N lines contain one word each.',
    outputFormat: 'Print size of largest anagram group.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '6\neat\ntea\ntan\nate\nnat\nbat', output: '3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\na\nb\nc', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '4\nab\nba\nab\nba', expectedOutput: '4', isHidden: true, order: 2 },
      { input: '1\nhello', expectedOutput: '1', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Queue Simulation with ArrayDeque',
    slug: 'java-l4-arraydeque-queue',
    description: 'Process Q queries on ArrayDeque: 1 X (offer X), 2 (poll and print polled value, or -1 if empty).',
    inputFormat: 'First line Q. Next Q lines contain query.',
    outputFormat: 'Print output of poll operations on new lines.',
    constraints: '1 <= Q <= 1000',
    examples: [{ input: '4\n1 10\n1 20\n2\n2', output: '10\n20' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\n1 5\n2\n2', expectedOutput: '5\n-1', isHidden: false, order: 1 },
      { input: '2\n2\n2', expectedOutput: '-1\n-1', isHidden: true, order: 2 },
      { input: '3\n1 100\n1 200\n2', expectedOutput: '100', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Custom Comparator Sort by Length',
    slug: 'java-l4-comparator-string-length',
    description: 'Given N words, sort them in ascending order of length using Comparator. If equal length, sort alphabetically.',
    inputFormat: 'First line N. Next N lines contain one word each.',
    outputFormat: 'Print sorted words separated by space.',
    constraints: '1 <= N <= 100',
    examples: [{ input: '4\nbanana\napple\nfig\nkiwi', output: 'fig kiwi apple banana' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3\ncat\ndog\nelephant', expectedOutput: 'cat dog elephant', isHidden: false, order: 1 },
      { input: '2\nbeta\nalfa', expectedOutput: 'alfa beta', isHidden: true, order: 2 },
      { input: '1\none', expectedOutput: 'one', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Find Duplicates in Array (HashSet)',
    slug: 'java-l4-find-duplicates-set',
    description: 'Print all numbers that appear more than once in an array of N integers in ascending order.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print duplicate integers separated by space (or empty if none).',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '6\n1 2 3 2 1 4', output: '1 2' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '4\n5 5 5 5', expectedOutput: '5', isHidden: false, order: 1 },
      { input: '3\n1 2 3', expectedOutput: '', isHidden: true, order: 2 },
      { input: '5\n10 20 10 30 20', expectedOutput: '10 20', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'TreeMap Range Query',
    slug: 'java-l4-treemap-range',
    description: 'Given N (key, value) pairs, use TreeMap. Given query key K, print closest key <= K (floorKey) or -1 if none.',
    inputFormat: 'First line N and K. Next N lines contain key and value.',
    outputFormat: 'Print floor key or -1.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '3 25\n10 A\n20 B\n30 C', output: '20' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 4,
    difficulty: 'Medium',
    marks: 100,
    testCases: [
      { input: '3 5\n10 X\n20 Y\n30 Z', expectedOutput: '-1', isHidden: false, order: 1 },
      { input: '2 50\n50 Alpha\n60 Beta', expectedOutput: '50', isHidden: true, order: 2 },
      { input: '1 100\n50 Test', expectedOutput: '50', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 5 (10 Questions: Trees, BST & Advanced Collections) ---
  {
    title: 'BST Inorder Traversal in Java',
    slug: 'java-l5-bst-inorder',
    description: 'Insert N integers into a BST. Print its inorder traversal separated by space.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print inorder elements.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '2 3 4 5 7' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Maximum Depth of Binary Tree',
    slug: 'java-l5-max-depth-tree',
    description: 'Insert N integers into a BST and calculate its maximum depth (number of nodes from root down to furthest leaf).',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print maximum depth integer.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Search in BST in Java',
    slug: 'java-l5-search-bst',
    description: 'Insert N integers into a BST. Given key K, print "true" if K is present, else "false".',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5 4\n5 3 7 2 4', output: 'true' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '4 8\n10 5 15 2', expectedOutput: 'false', isHidden: false, order: 1 },
      { input: '3 30\n20 10 30', expectedOutput: 'true', isHidden: true, order: 2 },
      { input: '1 5\n5', expectedOutput: 'true', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Lowest Common Ancestor in BST',
    slug: 'java-l5-lca-bst',
    description: 'Given N elements in a BST, find the Lowest Common Ancestor (LCA) node of keys N1 and N2.',
    inputFormat: 'First line N, N1, and N2. Second line N space-separated integers.',
    outputFormat: 'Print the LCA node value.',
    constraints: '2 <= N <= 500',
    examples: [{ input: '6 2 8\n6 2 8 0 4 7', output: '6' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Check Symmetric Tree',
    slug: 'java-l5-symmetric-tree',
    description: 'Given binary tree in level order format (-1 represents null), check if tree is a mirror of itself. Print "true" or "false".',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= N <= 100',
    examples: [{ input: '7\n1 2 2 3 4 4 3', output: 'true' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '5\n1 2 2 -1 3 -1 3', expectedOutput: 'false', isHidden: false, order: 1 },
      { input: '1\n1', expectedOutput: 'true', isHidden: true, order: 2 },
      { input: '3\n1 2 2', expectedOutput: 'true', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Validate Binary Search Tree in Java',
    slug: 'java-l5-validate-bst',
    description: 'Given preorder traversal of N integers, verify if it forms a strictly valid BST. Print "Valid" or "Invalid".',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print "Valid" or "Invalid".',
    constraints: '1 <= N <= 500',
    examples: [{ input: '3\n2 1 3', output: 'Valid' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n1 3 2', expectedOutput: 'Valid', isHidden: false, order: 1 },
      { input: '4\n40 30 35 80', expectedOutput: 'Valid', isHidden: true, order: 2 },
      { input: '1\n10', expectedOutput: 'Valid', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Merge Two Binary Trees',
    slug: 'java-l5-merge-two-trees',
    description: 'Given two BSTs of size N1 and N2, compute the sum of all node values across both trees.',
    inputFormat: 'First line N1 and N2. Second line N1 integers. Third line N2 integers.',
    outputFormat: 'Print combined total sum.',
    constraints: '1 <= N1, N2 <= 500',
    examples: [{ input: '2 2\n1 2\n3 4', output: '10' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 3\n5 10 15\n2 4 6', expectedOutput: '42', isHidden: false, order: 1 },
      { input: '1 1\n10\n20', expectedOutput: '30', isHidden: true, order: 2 },
      { input: '2 1\n1 3\n5', expectedOutput: '9', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Kth Smallest Element in BST',
    slug: 'java-l5-kth-smallest-bst',
    description: 'Insert N integers into a BST and return the K-th smallest element.',
    inputFormat: 'First line N and K. Second line N space-separated integers.',
    outputFormat: 'Print K-th smallest value.',
    constraints: '1 <= K <= N <= 500',
    examples: [{ input: '5 3\n5 3 7 2 4', output: '4' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Count Nodes in Complete Binary Tree',
    slug: 'java-l5-count-complete-nodes',
    description: 'Insert N integers into a BST and count how many nodes have both left and right children.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print count of full nodes.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '2', explanation: 'Nodes 5 and 3 have both children.' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 1 3', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '3\n1 2 3', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '1\n10', expectedOutput: '0', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Top View of Binary Tree',
    slug: 'java-l5-top-view-tree',
    description: 'Insert N integers into a BST. Print the top view of the binary tree from left to right horizontal distance.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print top view values separated by space.',
    constraints: '1 <= N <= 500',
    examples: [{ input: '5\n5 3 7 2 4', output: '2 3 5 7' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 5,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n2 1 3', expectedOutput: '1 2 3', isHidden: false, order: 1 },
      { input: '1\n42', expectedOutput: '42', isHidden: true, order: 2 },
      { input: '4\n10 5 15 2', expectedOutput: '2 5 10 15', isHidden: true, order: 3 }
    ]
  },

  // --- LEVEL 6 (10 Questions: Graphs, Dynamic Programming & BigInteger in Java) ---
  {
    title: 'Graph BFS Traversal in Java',
    slug: 'java-l6-graph-bfs',
    description: 'Given undirected graph with V vertices (0 to V-1) and E edges, print BFS traversal starting from vertex 0 using Queue<Integer>.',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print BFS nodes separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 4\n0 1\n0 2\n1 2\n2 3', output: '0 1 2 3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Graph DFS Traversal in Java',
    slug: 'java-l6-graph-dfs',
    description: 'Given graph with V vertices and E edges, print DFS traversal starting from vertex 0 (visiting lowest index neighbor first).',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print DFS nodes separated by space.',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '4 3\n0 1\n0 2\n1 3', output: '0 1 3 2' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Factorial of Large Numbers (BigInteger)',
    slug: 'java-l6-biginteger-factorial',
    description: 'Calculate the factorial of integer N using java.math.BigInteger.',
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'Print N! as a string.',
    constraints: '0 <= N <= 50',
    examples: [{ input: '20', output: '2432902008176640000' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '5', expectedOutput: '120', isHidden: false, order: 1 },
      { input: '0', expectedOutput: '1', isHidden: true, order: 2 },
      { input: '25', expectedOutput: '15511210043330985984000000', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Longest Common Subsequence in Java',
    slug: 'java-l6-lcs-dp',
    description: 'Find length of LCS between two strings S1 and S2 using dynamic programming.',
    inputFormat: 'Two lines, S1 and S2.',
    outputFormat: 'Print LCS length.',
    constraints: '1 <= |S1|, |S2| <= 200',
    examples: [{ input: 'AGGTAB\nGXTXAYB', output: '4' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: 'ABCDGH\nAEDFHR', expectedOutput: '3', isHidden: false, order: 1 },
      { input: 'ABC\nDEF', expectedOutput: '0', isHidden: true, order: 2 },
      { input: 'JAVA\nJAVA', expectedOutput: '4', isHidden: true, order: 3 }
    ]
  },
  {
    title: '0/1 Knapsack with DP Table',
    slug: 'java-l6-knapsack-dp',
    description: 'Given N items with values V and weights W, and knapsack capacity C, find maximum total value.',
    inputFormat: 'First line N and C. Second line N values. Third line N weights.',
    outputFormat: 'Print maximum value.',
    constraints: '1 <= N <= 100, 1 <= C <= 500',
    examples: [{ input: '3 50\n60 100 120\n10 20 30', output: '220' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Coin Change Minimum Coins',
    slug: 'java-l6-coin-change-dp',
    description: 'Given N coin values and total amount V, find minimum coins needed to make amount V. If impossible, print -1.',
    inputFormat: 'First line N and V. Second line N coin values.',
    outputFormat: 'Print minimum coins or -1.',
    constraints: '1 <= N <= 50, 1 <= V <= 1000',
    examples: [{ input: '3 11\n1 2 5', output: '3' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Dijkstra Shortest Path in Java',
    slug: 'java-l6-dijkstra-java',
    description: 'Given V vertices and an adjacency matrix of edge weights (0 means no edge), find shortest distance from vertex 0 to V-1.',
    inputFormat: 'First line V. Next V lines contain V integers each.',
    outputFormat: 'Print shortest path distance.',
    constraints: '2 <= V <= 30',
    examples: [{ input: '3\n0 4 2\n4 0 1\n2 1 0', output: '2' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
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
    title: 'Rotten Oranges (Grid BFS)',
    slug: 'java-l6-rotten-oranges',
    description: 'In an R x C grid, 0=empty, 1=fresh orange, 2=rotten orange. Every minute, rotten oranges rot adjacent fresh oranges. Print minimum minutes until no fresh orange remains, or -1 if impossible.',
    inputFormat: 'First line R and C. Next R lines contain C integers (0, 1, or 2).',
    outputFormat: 'Print minimum minutes or -1.',
    constraints: '1 <= R, C <= 30',
    examples: [{ input: '3 3\n2 1 1\n1 1 0\n0 1 1', output: '4' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 3\n2 1 1\n0 1 1\n1 0 1', expectedOutput: '-1', isHidden: false, order: 1 },
      { input: '1 2\n0 2', expectedOutput: '0', isHidden: true, order: 2 },
      { input: '2 2\n2 1\n1 1', expectedOutput: '2', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Maximum Subarray Product',
    slug: 'java-l6-max-subarray-product',
    description: 'Find the contiguous subarray within an array of N integers that has the largest product.',
    inputFormat: 'First line N. Second line N space-separated integers.',
    outputFormat: 'Print maximum product integer.',
    constraints: '1 <= N <= 1000',
    examples: [{ input: '4\n2 3 -2 4', output: '6' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3\n-2 0 -1', expectedOutput: '0', isHidden: false, order: 1 },
      { input: '4\n-2 3 -4 -1', expectedOutput: '24', isHidden: true, order: 2 },
      { input: '1\n-5', expectedOutput: '-5', isHidden: true, order: 3 }
    ]
  },
  {
    title: 'Detect Cycle in Undirected Graph',
    slug: 'java-l6-cycle-undirected-graph',
    description: 'Given undirected graph with V vertices and E edges, determine if it contains a cycle. Print "Cycle" or "No Cycle".',
    inputFormat: 'First line V and E. Next E lines contain (u, v).',
    outputFormat: 'Print "Cycle" or "No Cycle".',
    constraints: '1 <= V <= 50, 0 <= E <= 100',
    examples: [{ input: '3 3\n0 1\n1 2\n2 0', output: 'Cycle' }],
    allowedLanguages: ['java'],
    courseSlug: 'java',
    targetLevel: 6,
    difficulty: 'Hard',
    marks: 100,
    testCases: [
      { input: '3 2\n0 1\n1 2', expectedOutput: 'No Cycle', isHidden: false, order: 1 },
      { input: '4 4\n0 1\n1 2\n2 3\n3 0', expectedOutput: 'Cycle', isHidden: true, order: 2 },
      { input: '1 0', expectedOutput: 'No Cycle', isHidden: true, order: 3 }
    ]
  }
];

