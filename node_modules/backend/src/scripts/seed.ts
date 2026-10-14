import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { ProgrammingLanguage } from '../models/ProgrammingLanguage';
import { ProgrammingLevel } from '../models/ProgrammingLevel';
import { Question } from '../models/Question';
import { TestCase } from '../models/TestCase';
import { Examination } from '../models/Examination';
import { ExaminationSlot } from '../models/ExaminationSlot';
import { PlatformConfiguration } from '../models/PlatformConfiguration';
import { StudentProgress } from '../models/StudentProgress';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_assessment_db';

export async function runSeed() {
  console.log('[Seeder] Connecting to MongoDB at', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    ProgrammingLanguage.deleteMany({}),
    ProgrammingLevel.deleteMany({}),
    Question.deleteMany({}),
    TestCase.deleteMany({}),
    Examination.deleteMany({}),
    ExaminationSlot.deleteMany({}),
    PlatformConfiguration.deleteMany({}),
    StudentProgress.deleteMany({})
  ]);

  console.log('[Seeder] Cleared previous data.');

  // 1. Create Platform Configuration
  await PlatformConfiguration.create({
    key: 'global_config',
    collegeNetworkRanges: ['127.0.0.1', '::1', '10.0.0.0/8', '192.168.0.0/16'],
    sebEnforced: false,
    sebConfigKey: '',
    sebQuitPassword: 'CollegeExamQuit2026',
    defaultTimeZone: 'Asia/Kolkata',
    allowStudentSelfRegistration: true
  });

  // 2. Create Users
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const facultyPass = await bcrypt.hash('Faculty@123', 10);
  const studentPass = await bcrypt.hash('Student@123', 10);

  const adminUser = await User.create({
    email: 'admin@college.edu',
    passwordHash: adminPass,
    role: 'admin',
    firstName: 'System',
    lastName: 'Administrator',
    isActive: true,
    collegeIpExempt: true
  });

  const facultyUser = await User.create({
    email: 'faculty@college.edu',
    passwordHash: facultyPass,
    role: 'faculty',
    firstName: 'Dr. Suresh',
    lastName: 'Kumar',
    isActive: true
  });

  const student1 = await User.create({
    email: 'student1@college.edu',
    passwordHash: studentPass,
    role: 'student',
    firstName: 'Aarav',
    lastName: 'Sharma',
    studentId: 'CS2026-001',
    isActive: true
  });

  await StudentProfile.create({
    userId: student1._id,
    studentId: 'CS2026-001',
    department: 'Computer Science and Engineering',
    batch: '2022-2026',
    semester: 6,
    enrollmentNumber: 'ENR2026001'
  });

  const student2 = await User.create({
    email: 'student2@college.edu',
    passwordHash: studentPass,
    role: 'student',
    firstName: 'Priya',
    lastName: 'Patel',
    studentId: 'CS2026-002',
    isActive: true
  });

  await StudentProfile.create({
    userId: student2._id,
    studentId: 'CS2026-002',
    department: 'Information Technology',
    batch: '2022-2026',
    semester: 6,
    enrollmentNumber: 'ENR2026002'
  });

  console.log('[Seeder] Users seeded:');
  console.log(' - Admin: admin@college.edu / Admin@123');
  console.log(' - Faculty: faculty@college.edu / Faculty@123');
  console.log(' - Student 1: student1@college.edu / Student@123');
  console.log(' - Student 2: student2@college.edu / Student@123');

  // 3. Create Programming Languages
  const langConfigs = [
    {
      name: 'C',
      slug: 'c',
      executionEngineId: 'c',
      totalLevels: 6,
      monacoLanguage: 'c',
      templateCode: `#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    int a, b;\n    if (scanf("%d %d", &a, &b) == 2) {\n        printf("%d\\n", a + b);\n    }\n    return 0;\n}\n`,
      description: 'Standard C programming language (C11/C17) with GCC compiler'
    },
    {
      name: 'C++',
      slug: 'cpp',
      executionEngineId: 'cpp',
      totalLevels: 6,
      monacoLanguage: 'cpp',
      templateCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    int a, b;\n    if (cin >> a >> b) {\n        cout << (a + b) << endl;\n    }\n    return 0;\n}\n`,
      description: 'Modern C++17 with GNU G++ compiler'
    },
    {
      name: 'Java',
      slug: 'java',
      executionEngineId: 'java',
      totalLevels: 6,
      monacoLanguage: 'java',
      templateCode: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.println(a + b);\n        }\n    }\n}\n`,
      description: 'Java Standard Edition with OpenJDK / Oracle JDK'
    },
    {
      name: 'Python',
      slug: 'python',
      executionEngineId: 'python',
      totalLevels: 6,
      monacoLanguage: 'python',
      templateCode: `import sys\n\ndef main():\n    # Write your Python solution here\n    tokens = sys.stdin.read().split()\n    if len(tokens) >= 2:\n        print(int(tokens[0]) + int(tokens[1]))\n\nif __name__ == '__main__':\n    main()\n`,
      description: 'Python 3 high-level interpreted programming language'
    },
    {
      name: 'JavaScript',
      slug: 'javascript',
      executionEngineId: 'javascript',
      totalLevels: 4,
      monacoLanguage: 'javascript',
      templateCode: `const fs = require('fs');\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length >= 2) {\n        console.log(parseInt(input[0]) + parseInt(input[1]));\n    }\n}\nmain();\n`,
      description: 'JavaScript ECMAScript with Node.js runtime'
    }
  ];

  const languagesMap = new Map<string, any>();

  for (const cfg of langConfigs) {
    const lang = await ProgrammingLanguage.create({
      ...cfg,
      isEnabled: true,
      defaultTimeLimitMs: 4000,
      defaultMemoryLimitMb: 256
    });
    languagesMap.set(cfg.slug, lang);

    // Create levels for each language
    for (let lvl = 1; lvl <= cfg.totalLevels; lvl++) {
      await ProgrammingLevel.create({
        languageId: lang._id,
        levelNumber: lvl,
        title: `${cfg.name} Level ${lvl}`,
        description: `Assessment curriculum and milestones for Level ${lvl}`,
        defaultPassingPercentage: 60,
        prerequisiteLevel: lvl === 1 ? null : lvl - 1
      });
    }

    // Initialize StudentProgress for student1 & student2
    await StudentProgress.create({
      studentId: student1._id,
      languageId: lang._id,
      highestUnlockedLevel: 1, // Level 1 is always unlocked by default
      completedLevels: []
    });

    await StudentProgress.create({
      studentId: student2._id,
      languageId: lang._id,
      highestUnlockedLevel: 1,
      completedLevels: []
    });
  }

  console.log('[Seeder] Languages & 6-level/4-level curricula created.');

  // 4. Create Questions with Public and Hidden Test Cases
  const cLang = languagesMap.get('c');
  const pyLang = languagesMap.get('python');
  const javaLang = languagesMap.get('java');
  const cppLang = languagesMap.get('cpp');

  // Question 1: Sum of Two Numbers (Level 1)
  const q1 = await Question.create({
    title: 'Sum of Two Numbers',
    slug: 'sum-of-two-numbers',
    description: 'Write a program that takes two integers from standard input and prints their sum to standard output.',
    inputFormat: 'Two space-separated integers A and B.',
    outputFormat: 'Print a single integer: the sum of A and B.',
    constraints: '-10^6 <= A, B <= 10^6',
    examples: [
      { input: '3 5', output: '8', explanation: '3 + 5 = 8' }
    ],
    allowedLanguages: ['c', 'cpp', 'java', 'python', 'javascript'],
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    createdBy: facultyUser._id
  });

  await TestCase.create([
    {
      questionId: q1._id,
      input: '4 7',
      expectedOutput: '11',
      isHidden: false,
      weight: 1,
      order: 1
    },
    {
      questionId: q1._id,
      input: '100 250',
      expectedOutput: '350',
      isHidden: true,
      weight: 1,
      order: 2
    },
    {
      questionId: q1._id,
      input: '-50 20',
      expectedOutput: '-30',
      isHidden: true,
      weight: 1,
      order: 3
    }
  ]);

  // Question 2: Maximum of Three Numbers (Level 1)
  const q2 = await Question.create({
    title: 'Maximum of Three Numbers',
    slug: 'maximum-of-three-numbers',
    description: 'Given three integers, find and output the maximum among them.',
    inputFormat: 'Three space-separated integers X, Y, and Z.',
    outputFormat: 'Print the maximum value.',
    constraints: '-10^5 <= X, Y, Z <= 10^5',
    examples: [
      { input: '12 45 32', output: '45', explanation: '45 is the largest value.' }
    ],
    allowedLanguages: ['c', 'cpp', 'java', 'python'],
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    createdBy: facultyUser._id
  });

  await TestCase.create([
    {
      questionId: q2._id,
      input: '10 25 15',
      expectedOutput: '25',
      isHidden: false,
      weight: 1,
      order: 1
    },
    {
      questionId: q2._id,
      input: '99 105 4',
      expectedOutput: '105',
      isHidden: true,
      weight: 1,
      order: 2
    },
    {
      questionId: q2._id,
      input: '-10 -5 -20',
      expectedOutput: '-5',
      isHidden: true,
      weight: 1,
      order: 3
    }
  ]);

  // Question 3: Array Reverse (Level 2)
  const q3 = await Question.create({
    title: 'Reverse an Array',
    slug: 'reverse-an-array',
    description: 'Given an array of N integers, print the elements in reverse order separated by spaces.',
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print the N integers in reverse order separated by space.',
    constraints: '1 <= N <= 1000',
    examples: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'Elements reversed.' }
    ],
    allowedLanguages: ['c', 'cpp', 'java', 'python'],
    targetLevel: 2,
    difficulty: 'Medium',
    marks: 100,
    createdBy: facultyUser._id
  });

  await TestCase.create([
    {
      questionId: q3._id,
      input: '4\n10 20 30 40',
      expectedOutput: '40 30 20 10',
      isHidden: false,
      weight: 1,
      order: 1
    },
    {
      questionId: q3._id,
      input: '6\n5 1 9 4 2 8',
      expectedOutput: '8 2 4 9 1 5',
      isHidden: true,
      weight: 1,
      order: 2
    }
  ]);

  console.log('[Seeder] Questions and hidden test cases seeded.');

  // 5. Helper to create 15 standard collegiate slots (5 Time Windows x 3 Labs x 30 Capacity)
  const standardTimeWindows = [
    { startH: 9, startM: 15, endH: 10, endM: 15, label: '09:15 to 10:15' },
    { startH: 10, startM: 25, endH: 11, endM: 25, label: '10:25 to 11:25' },
    { startH: 11, startM: 35, endH: 12, endM: 35, label: '11:35 to 12:35' },
    { startH: 13, startM: 30, endH: 14, endM: 30, label: '1:30 to 2:30 (13:30 - 14:30)' },
    { startH: 14, startM: 45, endH: 15, endM: 45, label: '2:45 to 3:45 (14:45 - 15:45)' }
  ];
  const standardLabs = ['Lab 1', 'Lab 2', 'Lab 3'];

  async function createStandardSlots(examinationId: any, examDate: Date, hasFilledExample = false) {
    const slotDocs: any[] = [];
    let isFirst = true;
    for (const win of standardTimeWindows) {
      for (const lab of standardLabs) {
        const startTime = new Date(examDate);
        startTime.setHours(win.startH, win.startM, 0, 0);

        const endTime = new Date(examDate);
        endTime.setHours(win.endH, win.endM, 0, 0);

        // For demonstration of real-time filled slot hiding:
        // Make the very first slot completely filled (30/30) to prove it is hidden in real time!
        let regCount = 0;
        if (hasFilledExample && isFirst) {
          regCount = 30; // Completely full!
          isFirst = false;
        }

        slotDocs.push({
          examinationId,
          slotName: `${win.label} - ${lab}`,
          labName: lab,
          timeWindow: win.label,
          startTime,
          endTime,
          capacity: 30, // Each lab has strictly 30 slots
          registeredCount: regCount,
          isActive: true
        });
      }
    }
    return await ExaminationSlot.insertMany(slotDocs);
  }

  // 6. Create Examinations with Previous Day 9:00 PM Registration Rule
  const today = new Date();
  
  // Previous day at 9:00 PM (21:00:00) for today's exams
  const prevDay9pmForToday = new Date(today);
  prevDay9pmForToday.setDate(prevDay9pmForToday.getDate() - 1);
  prevDay9pmForToday.setHours(21, 0, 0, 0);

  const regEndForToday = new Date(today);
  regEndForToday.setHours(23, 59, 59, 999);

  // Tomorrow date for upcoming exam demo
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Previous day 9:00 PM for tomorrow's exam = Tonight at 9:00 PM (21:00:00)
  const prevDay9pmForTomorrow = new Date(tomorrow);
  prevDay9pmForTomorrow.setDate(prevDay9pmForTomorrow.getDate() - 1);
  prevDay9pmForTomorrow.setHours(21, 0, 0, 0);

  // C Level 1 Exam (Open now! Registration began previous day 9:00 PM)
  const examC1 = await Examination.create({
    title: 'C Programming - Level 1 Foundation Examination',
    description: 'Comprehensive evaluation of C fundamentals: I/O, arithmetic, conditionals, and logic.',
    languageId: cLang._id,
    levelNumber: 1,
    registrationStartDate: prevDay9pmForToday,
    registrationEndDate: regEndForToday,
    examDate: today,
    durationMinutes: 60,
    maxStudents: 450, // 5 slots * 3 labs * 30 seats
    passingPercentage: 60,
    questions: [q1._id, q2._id],
    allowedLanguages: ['c'],
    instructions: 'Write standard ISO C code. Ensure you handle input from stdin and write to stdout.',
    isPublished: true,
    createdBy: adminUser._id
  });

  await createStandardSlots(examC1._id, today, true);

  // C Level 2 Exam (Locked for students until they pass Level 1!)
  const examC2 = await Examination.create({
    title: 'C Programming - Level 2 Intermediate Examination',
    description: 'Evaluation of arrays, loops, and intermediate problem solving in C.',
    languageId: cLang._id,
    levelNumber: 2,
    registrationStartDate: prevDay9pmForToday,
    registrationEndDate: regEndForToday,
    examDate: today,
    durationMinutes: 60,
    maxStudents: 450,
    passingPercentage: 60,
    questions: [q3._id],
    allowedLanguages: ['c'],
    instructions: 'Arrays and loop constructs.',
    isPublished: true,
    createdBy: adminUser._id
  });

  await createStandardSlots(examC2._id, today, false);

  // Python Level 1 Exam (Today)
  const examPy1 = await Examination.create({
    title: 'Python Programming - Level 1 Assessment',
    description: 'Python syntax, control flow, functions, and standard input/output parsing.',
    languageId: pyLang._id,
    levelNumber: 1,
    registrationStartDate: prevDay9pmForToday,
    registrationEndDate: regEndForToday,
    examDate: today,
    durationMinutes: 60,
    maxStudents: 450,
    passingPercentage: 60,
    questions: [q1._id, q2._id],
    allowedLanguages: ['python'],
    instructions: 'Write Python 3 code. Read from sys.stdin or input().',
    isPublished: true,
    createdBy: adminUser._id
  });

  await createStandardSlots(examPy1._id, today, false);

  // Java Level 1 Exam (Today)
  const examJava1 = await Examination.create({
    title: 'Java Programming - Level 1 Assessment',
    description: 'Object-oriented basics, standard I/O, Scanner class, and conditionals in Java.',
    languageId: javaLang._id,
    levelNumber: 1,
    registrationStartDate: prevDay9pmForToday,
    registrationEndDate: regEndForToday,
    examDate: today,
    durationMinutes: 60,
    maxStudents: 450,
    passingPercentage: 60,
    questions: [q1._id, q2._id],
    allowedLanguages: ['java'],
    instructions: 'Ensure class name is Main.',
    isPublished: true,
    createdBy: adminUser._id
  });

  await createStandardSlots(examJava1._id, today, false);

  // Future Examination (Scheduled for 2 days from now) to clearly demonstrate:
  // "it only shows on previousday 9.00 pm only"
  const futureExamDate = new Date(today);
  futureExamDate.setDate(futureExamDate.getDate() + 2);

  const prevDay9pmForFutureExam = new Date(futureExamDate);
  prevDay9pmForFutureExam.setDate(prevDay9pmForFutureExam.getDate() - 1);
  prevDay9pmForFutureExam.setHours(21, 0, 0, 0); // Tomorrow at 9:00 PM - strictly in the future!

  const examFutureCpp = await Examination.create({
    title: 'C++ Programming - Level 1 Assessment (Future Exam - Slots Unlock Tomorrow 9:00 PM)',
    description: 'C++ stream I/O, data types, and logic structures. Slots open on the previous day at 9:00 PM.',
    languageId: cppLang._id,
    levelNumber: 1,
    registrationStartDate: prevDay9pmForFutureExam,
    registrationEndDate: new Date(futureExamDate.getTime() + 18 * 3600000),
    examDate: futureExamDate,
    durationMinutes: 60,
    maxStudents: 450,
    passingPercentage: 60,
    questions: [q1._id, q2._id],
    allowedLanguages: ['cpp'],
    instructions: 'Registration unlocks strictly on the previous day at 9:00 PM.',
    isPublished: true,
    createdBy: adminUser._id
  });

  await createStandardSlots(examFutureCpp._id, futureExamDate, false);

  console.log('[Seeder] Examinations published for C (Levels 1 & 2), Python (Level 1), Java (Level 1), C++ (Level 1).');
  console.log('[Seeder] Database seeding finished successfully.');

  await mongoose.disconnect();
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seeder] Seeding failed:', err);
      process.exit(1);
    });
}

