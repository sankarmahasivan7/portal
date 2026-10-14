export interface CourseVideo {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  description: string;
  topics: string[];
}

export interface LevelCurriculum {
  title: string;
  description: string;
  topics: string[];
  videos: CourseVideo[];
  studyNotes: string[];
}

export const COURSE_CURRICULUM_DATA: Record<string, Record<number, LevelCurriculum>> = {
  // C Programming
  c: {
    1: {
      title: 'Level 1: Fundamentals, Syntax & Standard I/O',
      description: 'Master the core foundational concepts of C: program structure, data types, standard input/output formatting with printf and scanf, and basic conditional branching.',
      topics: [
        'C Program Structure & Compilation with GCC',
        'Variables, Primitive Data Types & Format Specifiers (%d, %f, %c, %s)',
        'Standard I/O: printf, scanf, getchar, putchar',
        'Arithmetic Operators, Precedence & Associativity',
        'Relational & Logical Operators',
        'Conditional Control: if, if-else, nested if & switch-case'
      ],
      studyNotes: [
        'Always check the return value of scanf when reading formatted inputs in automated grading tests.',
        'Beware of leftover newline characters in the input buffer when reading characters with %c; use " %c" with a leading whitespace.',
        'Remember that C array indices are 0-based and string literals are null-terminated with \\0.'
      ],
      videos: [
        {
          id: 'c-l1-v1',
          title: 'Lecture 1: Introduction to C & GCC Compilation Pipeline',
          duration: '18:45',
          url: 'https://www.youtube-nocookie.com/embed/KJgsSFOSQv0',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          description: 'Understand the anatomy of a C program, the role of preprocessors, header files, compiler phases, and main return codes.',
          topics: ['Header files (#include <stdio.h>)', 'main() entrypoint', 'Exit codes (return 0)']
        },
        {
          id: 'c-l1-v2',
          title: 'Lecture 2: Standard I/O, Data Types & Format Specifiers',
          duration: '22:10',
          url: 'https://www.youtube-nocookie.com/embed/zuegQmMdy8M',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'Comprehensive guide to reading from stdin and writing to stdout using printf, scanf, and handling formatting precision.',
          topics: ['scanf buffer handling', 'float vs double precision', 'Type casting']
        },
        {
          id: 'c-l1-v3',
          title: 'Lecture 3: Conditional Branching & Logic Gates in C',
          duration: '26:30',
          url: 'https://www.youtube-nocookie.com/embed/8PopR34-KGg',
          thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
          description: 'How to construct robust condition trees, nested ternary operators, and switch statements with proper break statements.',
          topics: ['if/else cascades', 'Short-circuit evaluation (&&, ||)', 'Switch-case fallthrough']
        },
        {
          id: 'c-l1-v4',
          title: 'Lecture 4: Automated Assessment Preparation & Sample Problem Walkthrough',
          duration: '20:15',
          url: 'https://www.youtube-nocookie.com/embed/KJgsSFOSQv0',
          thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
          description: 'Step-by-step resolution of benchmark assessment problems, boundary conditions, zero inputs, and hidden test-case handling.',
          topics: ['EOF checking (while(scanf(...) != EOF))', 'Time complexity', 'Avoiding Segmentation Faults']
        }
      ]
    },
    2: {
      title: 'Level 2: Loops, Iterations & 1D/2D Arrays',
      description: 'Expand your C skills with iterative control loops (for, while, do-while), array manipulation, linear search, and string handling.',
      topics: [
        'While, Do-While & For Loops',
        'Break, Continue & Infinite Loop Prevention',
        'One-Dimensional Arrays: Declaration, Traversal & Memory Layout',
        'Two-Dimensional Matrices: Row-major order & Matrix Arithmetic',
        'Strings as Character Arrays (string.h, strlen, strcpy, strcmp)',
        'Basic Searching and Sorting (Linear Search, Bubble Sort)'
      ],
      studyNotes: [
        'Out-of-bounds array access in C invokes undefined behavior; always ensure your loop bounds strictly adhere to [0, size - 1].',
        'Always ensure string buffers have room for the terminating null character \\0 (e.g., char s[N + 1]).'
      ],
      videos: [
        {
          id: 'c-l2-v1',
          title: 'Lecture 1: Mastering Loops & Iterative Patterns in C',
          duration: '24:15',
          url: 'https://www.youtube-nocookie.com/embed/KJgsSFOSQv0',
          thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
          description: 'Deep dive into loop invariants, for loops vs while loops, and writing clean nested loops for pattern printing.',
          topics: ['Nested loops', 'Iteration complexity', 'Sentinel controlled loops']
        },
        {
          id: 'c-l2-v2',
          title: 'Lecture 2: One-Dimensional Arrays & Memory Contiguity',
          duration: '28:40',
          url: 'https://www.youtube-nocookie.com/embed/zuegQmMdy8M',
          thumbnail: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=600&auto=format&fit=crop&q=80',
          description: 'Explore contiguous array memory allocation, traversing elements, finding min/max, and reversing arrays in place.',
          topics: ['Array indexing', 'Finding duplicates', 'In-place array mutations']
        }
      ]
    }
  },

  // Python Programming
  python: {
    1: {
      title: 'Level 1: Python Fundamentals, Syntax & Standard I/O',
      description: 'Comprehensive introduction to Python 3 syntax, dynamic typing, reading from sys.stdin or input(), type conversions, and conditionals.',
      topics: [
        'Python 3 Execution Model & Indentation Rules',
        'Variables, Numbers, Floats, Booleans & Strings',
        'Console I/O: input(), sys.stdin.read(), split(), map()',
        'String Manipulation, Slicing & f-strings',
        'Conditionals: if, elif, else, and Ternary Expressions',
        'Error Handling: try-except blocks'
      ],
      studyNotes: [
        'input() reads everything as a string. Use int(input()) or map(int, input().split()) to parse multiple integer tokens on one line.',
        'For high-speed I/O in competitive assessments, sys.stdin.read().split() is significantly faster than repeated input() calls.'
      ],
      videos: [
        {
          id: 'py-l1-v1',
          title: 'Lecture 1: Python 3 Fundamentals & Fast I/O Parsing',
          duration: '21:30',
          url: 'https://www.youtube-nocookie.com/embed/_uQrJ0TkZlc',
          thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
          description: 'Understand Python dynamic typing, writing clean scripts, and reading whitespace-delimited inputs cleanly.',
          topics: ['map(int, input().split())', 'sys.stdin.read()', 'f-string formatting']
        },
        {
          id: 'py-l1-v2',
          title: 'Lecture 2: Conditionals, Logical Operators & Control Flow',
          duration: '19:45',
          url: 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          description: 'Truth value testing in Python, short-circuit evaluation, nested conditions, and match-case statements.',
          topics: ['Truthy vs Falsy values', 'if/elif/else chains', 'Ternary if-expressions']
        },
        {
          id: 'py-l1-v3',
          title: 'Lecture 3: Assessment Problem Solving in Python',
          duration: '25:10',
          url: 'https://www.youtube-nocookie.com/embed/_uQrJ0TkZlc',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'Solving standard automated assessment problems in Python without runtime errors (ZeroDivisionError, ValueError).',
          topics: ['Exception handling', 'Edge case detection', 'Time complexity constraints']
        }
      ]
    }
  },

  // Java Programming
  java: {
    1: {
      title: 'Level 1: Java Foundations, Class Structure & Scanner I/O',
      description: 'Master Java object-oriented foundations, standard class structure (public class Main), Scanner console parsing, data types, and branching.',
      topics: [
        'JVM Architecture, Bytecode & Class Main Structure',
        'Data Types, Primitive Wrappers & Type Casting',
        'Console I/O with Scanner & BufferedReader',
        'Arithmetic, Relational & Logical Operators',
        'Decision Making: if-else and switch statements',
        'Standard Formatting with System.out.printf'
      ],
      studyNotes: [
        'Always name your top-level class "Main" for automated grading sandboxes (public class Main { public static void main(String[] args) }).',
        'When using Scanner, scanner.hasNextInt() or scanner.hasNext() is essential for processing variable-length test inputs.'
      ],
      videos: [
        {
          id: 'java-l1-v1',
          title: 'Lecture 1: Java Architecture, JDK/JVM & Main Class Entrypoint',
          duration: '23:15',
          url: 'https://www.youtube-nocookie.com/embed/eIrMbAQSU34',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'Anatomy of a standalone Java program, bytecode execution, public static void main, and System.out.println.',
          topics: ['class Main structure', 'Command line args', 'Compilation with javac']
        },
        {
          id: 'java-l1-v2',
          title: 'Lecture 2: Scanner vs BufferedReader for Competitive Input Parsing',
          duration: '21:50',
          url: 'https://www.youtube-nocookie.com/embed/grEKMHGYyns',
          thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
          description: 'Practical guide to reading integers, doubles, and newline-separated strings with Java Scanner and handling buffer flushes.',
          topics: ['Scanner.nextInt() vs nextLine()', 'BufferedReader & StringTokenizer']
        }
      ]
    }
  },

  // C++ Programming
  cpp: {
    1: {
      title: 'Level 1: C++ Syntax, Streams & Control Structures',
      description: 'Introduction to standard C++ (C++17/C++20), iostream (std::cin, std::cout), namespaces, fundamental types, and conditional logic.',
      topics: [
        'C++ Compilation Model & Standard Library Overview',
        'Namespaces and using namespace std',
        'Stream I/O: std::cin, std::cout, std::endl',
        'Fast I/O: std::ios_base::sync_with_stdio(false)',
        'Conditionals: if, else if, switch',
        'Basic Functions and Pass-by-Value vs Pass-by-Reference'
      ],
      studyNotes: [
        'For competitive evaluation, always include `cin.tie(NULL); ios_base::sync_with_stdio(false);` at the top of main() for speed.',
        'Prefer \'\\n\' over std::endl inside loops to prevent unnecessary buffer flushes.'
      ],
      videos: [
        {
          id: 'cpp-l1-v1',
          title: 'Lecture 1: C++ Stream I/O & Modern Language Foundations',
          duration: '24:00',
          url: 'https://www.youtube-nocookie.com/embed/vLnPwxZdW4Y',
          thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
          description: 'Mastering std::cin, std::cout, stream operators, variable scopes, and fundamental C++ syntax.',
          topics: ['iostream', 'Fast I/O synchronization', 'Namespaces']
        },
        {
          id: 'cpp-l1-v2',
          title: 'Lecture 2: Conditionals & Solving Core Assessment Questions in C++',
          duration: '22:30',
          url: 'https://www.youtube-nocookie.com/embed/1v_4dL8OP80',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          description: 'Walkthrough of conditional logic, boundary handling, and clean C++ implementation techniques.',
          topics: ['if/else chains', 'Pass by reference (&)', 'Assessment edge cases']
        }
      ]
    }
  }
};

/**
 * Returns curriculum, videos, topics, and notes for a given language slug and level number.
 * Falls back to structured standard programming curriculum if not custom defined.
 */
export function getLevelCurriculum(languageSlug: string, levelNumber: number, languageName: string): LevelCurriculum {
  const normalizedSlug = languageSlug.toLowerCase();
  if (COURSE_CURRICULUM_DATA[normalizedSlug] && COURSE_CURRICULUM_DATA[normalizedSlug][levelNumber]) {
    return COURSE_CURRICULUM_DATA[normalizedSlug][levelNumber];
  }

  // Fallback dynamic generator for higher levels or other languages
  return {
    title: `${languageName} - Level ${levelNumber}: Intermediate & Advanced Programming`,
    description: `Comprehensive evaluation of ${languageName} concepts for Level ${levelNumber}, focusing on problem solving, performance, and best practices.`,
    topics: [
      `${languageName} Level ${levelNumber} Core Constructs`,
      'Memory Management & Efficient Data Representation',
      'Algorithmic Complexity & Optimization Techniques',
      'Standard Library Built-in Utilities',
      'Defensive Programming & Edge-Case Handling'
    ],
    studyNotes: [
      `Review ${languageName} documentation for Level ${levelNumber} topics before starting the assessment.`,
      'Ensure your code handles empty inputs, negative numbers, and large scale boundary values.',
      'Check time limits and memory limits specified for each question.'
    ],
    videos: [
      {
        id: `${normalizedSlug}-l${levelNumber}-v1`,
        title: `Lecture 1: ${languageName} Level ${levelNumber} Masterclass`,
        duration: '25:00',
        url: 'https://www.youtube-nocookie.com/embed/KJgsSFOSQv0',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        description: `In-depth theoretical and practical concepts required to clear the ${languageName} Level ${levelNumber} assessment.`,
        topics: ['Advanced concepts', 'Code architecture', 'Algorithm design']
      },
      {
        id: `${normalizedSlug}-l${levelNumber}-v2`,
        title: `Lecture 2: ${languageName} Assessment Problem Solving & Edge Cases`,
        duration: '22:15',
        url: 'https://www.youtube-nocookie.com/embed/zuegQmMdy8M',
        thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        description: `Walkthrough of past assessment patterns, automated test suite nuances, and common bug avoidance.`,
        topics: ['Assessment strategies', 'Common pitfalls', 'Benchmark tests']
      }
    ]
  };
}

