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
  // C Programming (6 Levels)
  c: {
    1: {
      title: 'Level 1: Fundamentals, Syntax & Standard I/O',
      description: 'Master core foundational concepts of C: compilation pipeline, primitive data types, formatted I/O with printf and scanf, and conditional branching.',
      topics: [
        'C Program Structure & GCC Compilation Pipeline',
        'Variables, Primitive Data Types & Format Specifiers (%d, %f, %c, %s)',
        'Standard I/O: printf, scanf, buffer flushing, getchar, putchar',
        'Arithmetic Operators, Precedence, Associativity & Type Casting',
        'Relational & Logical Operators (Short-circuit Evaluation)',
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
        'While, Do-While & For Loops with Loop Invariants',
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
    },
    3: {
      title: 'Level 3: Functions, Recursion & Modular Architecture',
      description: 'Functional decomposition, stack frames, parameter passing by value and reference (pointers), and recursive call-stacks.',
      topics: [
        'Function Declarations, Prototypes & Definitions',
        'Call Stack, Local vs Global Scope, and Static Variables',
        'Pass-by-Value vs Emulated Pass-by-Reference with Pointers',
        'Recursive Functions: Base Cases, Recursive Steps & Stack Overflow Avoidance',
        'Divide-and-Conquer Paradigm: Binary Search & QuickSort Partitioning',
        'Modular Multi-file C Compilation & Header Guards (#ifndef)'
      ],
      studyNotes: [
        'Always formulate a bulletproof base case in recursive functions to prevent segmentation faults caused by stack overflow.',
        'Use const qualifiers for pointer parameters when the referenced data should not be mutated.'
      ],
      videos: [
        {
          id: 'c-l3-v1',
          title: 'Lecture 1: Functions, Prototypes & Stack Frame Execution',
          duration: '23:30',
          url: 'https://www.youtube-nocookie.com/embed/KJgsSFOSQv0',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'How function calls map to activation records on the hardware call-stack.',
          topics: ['Activation records', 'Return values', 'Scope resolution']
        }
      ]
    },
    4: {
      title: 'Level 4: Pointers, Memory Addresses & Pointer Arithmetic',
      description: 'Demystify raw memory management in C: memory addresses, pointer dereferencing, pointer arithmetic, and pointers to arrays.',
      topics: [
        'Memory Architecture: Stack, Heap, Data & Text Segments',
        'The Address-of (&) and Dereference (*) Operators',
        'Pointer Arithmetic, Offsets & Byte Stepping',
        'Pointers and 1D/2D Arrays Equivalence',
        'Function Pointers & Callback Mechanisms',
        'Void Pointers (void*) and Type Coercion'
      ],
      studyNotes: [
        'Dereferencing a NULL or uninitialized (dangling) pointer causes an immediate crash / Segmentation Fault.',
        'Adding 1 to a pointer (ptr + 1) advances by sizeof(*ptr) bytes, not necessarily 1 byte.'
      ],
      videos: [
        {
          id: 'c-l4-v1',
          title: 'Lecture 1: Pointers & Raw Memory Fundamentals',
          duration: '27:10',
          url: 'https://www.youtube-nocookie.com/embed/zuegQmMdy8M',
          thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
          description: 'In-depth exploration of memory addresses, pointer declarations, and pointer safety.',
          topics: ['Memory addresses', 'Pointer arithmetic', 'Dangling pointers']
        }
      ]
    },
    5: {
      title: 'Level 5: Dynamic Memory Allocation & Custom Structures',
      description: 'Heap memory allocation with malloc, calloc, realloc, free, memory leaks, and composite data types using struct and typedef.',
      topics: [
        'Heap Memory Allocation with malloc() and calloc()',
        'Resizing Memory with realloc() and Safe Deallocation with free()',
        'Detecting Memory Leaks & Valgrind Diagnostics',
        'Custom Structures (struct) and Alignment / Padding',
        'Arrow Operator (->) for Pointer-to-Struct Access',
        'Nested Structures and Arrays of Structures'
      ],
      studyNotes: [
        'Always set freed pointers to NULL (free(p); p = NULL;) to avoid use-after-free security flaws.',
        'Always check if malloc returns NULL before accessing allocated heap buffers.'
      ],
      videos: [
        {
          id: 'c-l5-v1',
          title: 'Lecture 1: Heap Allocation & Structs in C',
          duration: '29:00',
          url: 'https://www.youtube-nocookie.com/embed/KJgsSFOSQv0',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          description: 'Master dynamic heap memory, structs, padding, and memory leak prevention.',
          topics: ['malloc vs calloc', 'struct padding', 'free() best practices']
        }
      ]
    },
    6: {
      title: 'Level 6: Advanced Data Structures, File I/O & Bitwise Logic',
      description: 'Cap-stone collegiate C mastery: singly and doubly linked lists, binary search trees, bitwise bitmasks, and file stream processing.',
      topics: [
        'Singly and Doubly Linked Lists: Insertion, Deletion & Traversal',
        'Binary Search Trees: Node Structures, In-order & Pre-order Traversals',
        'Bitwise Operators: AND (&), OR (|), XOR (^), NOT (~), Left Shift (<<), Right Shift (>>)',
        'Bit Manipulation: Setting, Clearing, Toggling & Checking Bits with Masks',
        'File I/O: fopen, fclose, fread, fwrite, fprintf, fscanf',
        'High-Performance Collegiate Algorithm Implementations'
      ],
      studyNotes: [
        'Always remember to free every allocated node when destroying linked structures.',
        'Bitwise operations provide $O(1)$ set arithmetic and are heavily tested in benchmark college coding assessments.'
      ],
      videos: [
        {
          id: 'c-l6-v1',
          title: 'Lecture 1: Linked Lists & Bit Manipulation Masterclass',
          duration: '32:15',
          url: 'https://www.youtube-nocookie.com/embed/zuegQmMdy8M',
          thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
          description: 'Step-by-step construction of linked lists, bitwise masking tricks, and collegiate exam problems.',
          topics: ['Linked Lists', 'Bitwise Masks', 'Dynamic structures']
        }
      ]
    }
  },

  // Python Programming (4 Levels)
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
        }
      ]
    },
    2: {
      title: 'Level 2: Data Structures, Loops & List Comprehensions',
      description: 'Lists, Tuples, Dictionaries, Sets, nested iterations, list comprehensions, and sorting with custom keys.',
      topics: [
        'Python Lists: Slicing, Appending, Extending, and In-place Mutations',
        'Tuples (Immutability) and Dictionary Hash Maps (key-value lookups)',
        'Sets: Union, Intersection, Difference & Membership Testing in O(1)',
        'List, Dict & Set Comprehensions for Concise Code',
        'Loops: for item in iterable, enumerate(), zip(), while loops',
        'Custom Sorting with sorted() and lambda key functions'
      ],
      studyNotes: [
        'Dictionary key lookup and Set membership testing are average O(1) time complexity.',
        'Use list comprehensions instead of verbose map/filter loops for readability.'
      ],
      videos: [
        {
          id: 'py-l2-v1',
          title: 'Lecture 1: Built-in Python Data Structures & Comprehensions',
          duration: '25:40',
          url: 'https://www.youtube-nocookie.com/embed/_uQrJ0TkZlc',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'Deep dive into Python dicts, sets, list comprehensions, and sorting algorithms.',
          topics: ['Dict hash maps', 'Sets', 'Comprehensions']
        }
      ]
    },
    3: {
      title: 'Level 3: Functions, Modules & Object-Oriented Python',
      description: 'First-class functions, args/kwargs, closures, decorators, classes, dunder methods, and inheritance.',
      topics: [
        'Function Arguments: *args, **kwargs, Default Parameters',
        'First-class Functions, Higher-Order Functions & Lambda Functions',
        'Object-Oriented Programming: Class Definition, __init__, self',
        'Inheritance, Polymorphism & Method Resolution Order (MRO)',
        'Dunder Methods: __str__, __repr__, __len__, __eq__',
        'Standard Library Modules: collections, itertools, functools'
      ],
      studyNotes: [
        'Never use mutable default arguments like def foo(items=[]) in Python functions.',
        'Use collections.defaultdict and collections.Counter for frequency counting tasks.'
      ],
      videos: [
        {
          id: 'py-l3-v1',
          title: 'Lecture 1: Python OOP & Standard Library Power Tools',
          duration: '28:15',
          url: 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          description: 'Master classes, inheritance, dunder methods, and itertools in Python 3.',
          topics: ['OOP', 'dunder methods', 'collections.Counter']
        }
      ]
    },
    4: {
      title: 'Level 4: Advanced Problem Solving & Algorithm Engineering',
      description: 'Collegiate competitive algorithm implementations in Python: binary search, dynamic programming, graph traversals, and recursion.',
      topics: [
        'Recursion & Memoization with @functools.lru_cache',
        'Dynamic Programming (1D & 2D Tabulation Patterns)',
        'Graph Representation (Adjacency Lists) & BFS/DFS Traversals',
        'Binary Search Implementation using bisect module',
        'Heaps & Priority Queues using heapq',
        'Big-O Time and Space Complexity Analysis in Python'
      ],
      studyNotes: [
        'Increase Python recursion limit with sys.setrecursionlimit() if deep recursion is required.',
        'Prefer dynamic programming tabulation over recursion when stack depth exceeds limits.'
      ],
      videos: [
        {
          id: 'py-l4-v1',
          title: 'Lecture 1: Algorithmic Problem Solving & Dynamic Programming',
          duration: '31:20',
          url: 'https://www.youtube-nocookie.com/embed/_uQrJ0TkZlc',
          thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
          description: 'Solving complex college programming assessment challenges in Python 3.',
          topics: ['Dynamic Programming', 'Graph BFS/DFS', 'heapq']
        }
      ]
    }
  },

  // Java Programming (4 Levels)
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
        }
      ]
    },
    2: {
      title: 'Level 2: Arrays, Strings & Object-Oriented Design',
      description: '1D/2D Arrays, String immutability, StringBuilder, class instantiation, constructors, encapsulation, and inheritance.',
      topics: [
        '1D & 2D Arrays in Java: Allocation, Traversal & Arrays Utility Class',
        'String Pool, String Immutability vs StringBuilder Performance',
        'Classes, Objects, Constructors & this Keyword',
        'Encapsulation: Access Modifiers (public, private, protected)',
        'Inheritance (extends) and Polymorphism (Method Overriding & Overloading)',
        'Abstract Classes and Interfaces'
      ],
      studyNotes: [
        'Never use == to compare Strings in Java; always use s1.equals(s2).',
        'Use StringBuilder when concatenating strings inside loops to avoid creating thousands of immutable String objects.'
      ],
      videos: [
        {
          id: 'java-l2-v1',
          title: 'Lecture 1: Arrays, Strings & OOP in Java',
          duration: '26:40',
          url: 'https://www.youtube-nocookie.com/embed/grEKMHGYyns',
          thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
          description: 'Understanding memory layout, String vs StringBuilder, and object modeling.',
          topics: ['StringBuilder', 'equals() vs ==', 'Inheritance']
        }
      ]
    },
    3: {
      title: 'Level 3: Java Collections Framework & Generics',
      description: 'List, ArrayList, LinkedList, Set, HashSet, TreeSet, Map, HashMap, TreeMap, and Generic classes in Java.',
      topics: [
        'Java Collections Hierarchy (Collection, List, Set, Queue, Map)',
        'ArrayList vs LinkedList: Internal Array Resizing & Node Links',
        'HashMap & HashSet: Hashing Mechanics, hashCode() & equals() Contract',
        'TreeSet & TreeMap: Red-Black Self-Balancing Binary Trees',
        'Comparable vs Comparator for Custom Object Ordering',
        'Generics: Type Parameters, Wildcards & Type Safety'
      ],
      studyNotes: [
        'When storing custom objects in HashMap/HashSet, always override both hashCode() and equals().',
        'Collections.sort() uses TimSort with guaranteed O(N log N) worst-case performance.'
      ],
      videos: [
        {
          id: 'java-l3-v1',
          title: 'Lecture 1: Java Collections Framework Masterclass',
          duration: '30:10',
          url: 'https://www.youtube-nocookie.com/embed/eIrMbAQSU34',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'In-depth guide to HashMap, TreeMap, PriorityQueue, and Comparator in Java.',
          topics: ['HashMap internal mechanics', 'PriorityQueue', 'Comparator']
        }
      ]
    },
    4: {
      title: 'Level 4: Advanced Algorithms & Exception Architecture',
      description: 'Exception hierarchy (checked vs unchecked), custom exceptions, recursion, dynamic programming, and collegiate graph problems.',
      topics: [
        'Exception Architecture: try-catch-finally, try-with-resources',
        'Recursive Problem Solving: Memoization and Tabulation',
        'PriorityQueue & Heaps for Top-K Element Problems',
        'Binary Search Trees and Graph Traversals in Java',
        'Bitwise Operations in Java (&, |, ^, ~, <<, >>, >>>)',
        'Collegiate Examination Problem Solving Strategies'
      ],
      studyNotes: [
        'In Java, >>> is unsigned right shift which fills higher bits with zeros regardless of sign.',
        'Use FastScanner (BufferedReader + StringTokenizer) for assessments with large datasets.'
      ],
      videos: [
        {
          id: 'java-l4-v1',
          title: 'Lecture 1: Advanced Algorithms & Competitive Solutions in Java',
          duration: '33:00',
          url: 'https://www.youtube-nocookie.com/embed/grEKMHGYyns',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          description: 'Solving complex algorithmic problems with maximum performance in Java.',
          topics: ['FastScanner', 'Graph algorithms', 'Dynamic programming']
        }
      ]
    }
  },

  // C++ Programming (4 Levels)
  cpp: {
    1: {
      title: 'Level 1: C++ Syntax, Streams & Control Structures',
      description: 'Introduction to standard C++ (C++17/C++20), iostream (std::cin, std::cout), namespaces, fundamental types, and conditional logic.',
      topics: [
        'C++ Compilation Model & Standard Library Overview',
        'Namespaces and using namespace std',
        'Stream I/O: std::cin, std::cout, std::endl',
        'Fast I/O: std::ios_base::sync_with_stdio(false); std::cin.tie(NULL);',
        'Conditionals: if, else if, switch',
        'Basic Functions and Pass-by-Value vs Pass-by-Reference (&)'
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
        }
      ]
    },
    2: {
      title: 'Level 2: Standard Template Library (STL) Containers',
      description: 'Master standard containers: std::vector, std::pair, std::string, iterators, and std::sort.',
      topics: [
        'std::vector: Dynamic Array Allocation, push_back, emplace_back, resize',
        'Iterators: begin(), end(), rbegin(), rend() and Iterator Arithmetic',
        'std::pair and std::tuple for Multi-value Structures',
        'std::string Operations, Substrings, find(), and Parsing',
        'std::sort with Custom Lambda Comparator Functions',
        'Range-based for loops (for (const auto& item : vec))'
      ],
      studyNotes: [
        'Use vector::reserve(N) when the capacity is known ahead of time to avoid reallocations.',
        'Pass large objects to functions by const reference (const std::vector<int>&) to avoid expensive copies.'
      ],
      videos: [
        {
          id: 'cpp-l2-v1',
          title: 'Lecture 1: C++ STL Vector, Pairs & Sorting',
          duration: '27:30',
          url: 'https://www.youtube-nocookie.com/embed/1v_4dL8OP80',
          thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
          description: 'Mastering the essential containers of C++ STL for competitive programming.',
          topics: ['std::vector', 'Custom comparators', 'Iterators']
        }
      ]
    },
    3: {
      title: 'Level 3: Advanced STL Containers & Hashing',
      description: 'std::map, std::unordered_map, std::set, std::unordered_set, std::priority_queue, and stack/queue.',
      topics: [
        'Associative Containers: std::map and std::set (Red-Black Trees, O(log N))',
        'Unordered Containers: std::unordered_map and std::unordered_set (Hash Tables, O(1))',
        'std::priority_queue (Max-Heap & Min-Heap configurations)',
        'Adapters: std::stack and std::queue',
        'Lower Bound (std::lower_bound) and Upper Bound (std::upper_bound) on Sorted Ranges',
        'Handling Collisions and Custom Hash Functions'
      ],
      studyNotes: [
        'std::lower_bound returns iterator to first element >= target in a sorted range.',
        'To create a min-heap in C++: std::priority_queue<int, vector<int>, greater<int>> minHeap;'
      ],
      videos: [
        {
          id: 'cpp-l3-v1',
          title: 'Lecture 1: Advanced STL Sets, Maps & Priority Queues',
          duration: '31:15',
          url: 'https://www.youtube-nocookie.com/embed/vLnPwxZdW4Y',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'Building high speed hash maps, binary search trees, and heaps in C++.',
          topics: ['std::map vs unordered_map', 'std::priority_queue', 'lower_bound']
        }
      ]
    },
    4: {
      title: 'Level 4: Competitive Algorithms & Dynamic Programming in C++',
      description: 'Binary search over answers, dynamic programming, graph representations (BFS/DFS/Dijkstra), and bitmask DP.',
      topics: [
        'Binary Search on Answer Spaces',
        'Dynamic Programming: 1D, 2D & Knapsack Variations',
        'Graph Algorithms: Adjacency Lists, BFS, DFS, and Dijkstra Shortest Path',
        'Bit Manipulation with __builtin_popcount, __builtin_clz',
        'Disjoint Set Union (DSU / Union-Find) with Path Compression',
        'Collegiate Examination Benchmark Problem Resolutions'
      ],
      studyNotes: [
        'Builtin functions like __builtin_popcount(x) compile directly to CPU instructions for single-cycle bit counting.',
        'Always check for integer overflow with large intermediate calculations; use long long.'
      ],
      videos: [
        {
          id: 'cpp-l4-v1',
          title: 'Lecture 1: High-Performance Collegiate Algorithms in C++',
          duration: '34:00',
          url: 'https://www.youtube-nocookie.com/embed/1v_4dL8OP80',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          description: 'Top-tier problem solving, dynamic programming patterns, and graph algorithms in modern C++.',
          topics: ['Graph shortest paths', 'Dynamic Programming', 'Union-Find']
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
      }
    ]
  };
}
