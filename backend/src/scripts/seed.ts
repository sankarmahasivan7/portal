import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';
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
import { ExaminationSession } from '../models/ExaminationSession';
import { ExaminationResult } from '../models/ExaminationResult';
import { seedAllCourseQuestions } from '../data/questions';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_assessment_db';

export async function runSeed() {
  const maskedUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.log('[Seeder] Connecting to MongoDB at', maskedUri);

  if (MONGODB_URI.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e: any) {
      console.warn('DNS setServers error:', e.message);
    }
  }

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
    StudentProgress.deleteMany({}),
    ExaminationSession.deleteMany({}),
    ExaminationResult.deleteMany({})
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
    department: 'Computer Science and Engineering',
    year: 3,
    section: 'A',
    isActive: true
  });

  await StudentProfile.create({
    userId: student1._id,
    studentId: 'CS2026-001',
    department: 'Computer Science and Engineering',
    batch: '2023-2027',
    semester: 5,
    year: 3,
    enrollmentNumber: 'ENR2026001'
  });

  const sangarasUser = await User.create({
    email: 'sangaras.ug.24.it@francisxavier.ac.in',
    passwordHash: studentPass,
    role: 'student',
    firstName: 'Sangaras',
    lastName: 'FX',
    studentId: 'FX24IT-001',
    department: 'Information Technology',
    year: 3,
    section: 'A',
    isActive: true
  });

  await StudentProfile.create({
    userId: sangarasUser._id,
    studentId: 'FX24IT-001',
    department: 'Information Technology',
    batch: '2024-2028',
    semester: 5,
    year: 3,
    enrollmentNumber: 'ENR24IT001'
  });

  const student2 = await User.create({
    email: 'student2@college.edu',
    passwordHash: studentPass,
    role: 'student',
    firstName: 'Priya',
    lastName: 'Patel',
    studentId: 'IT2025-014',
    department: 'Information Technology',
    year: 2,
    section: 'B',
    isActive: true
  });

  await StudentProfile.create({
    userId: student2._id,
    studentId: 'IT2025-014',
    department: 'Information Technology',
    batch: '2024-2028',
    semester: 3,
    year: 2,
    enrollmentNumber: 'ENR2026002'
  });

  const student3 = await User.create({
    email: 'student3@college.edu',
    passwordHash: studentPass,
    role: 'student',
    firstName: 'Rohan',
    lastName: 'Verma',
    studentId: 'EC2026-088',
    department: 'Electronics and Communication Engineering',
    year: 1,
    section: 'A',
    isActive: true
  });

  await StudentProfile.create({
    userId: student3._id,
    studentId: 'EC2026-088',
    department: 'Electronics and Communication Engineering',
    batch: '2025-2029',
    semester: 1,
    year: 1,
    enrollmentNumber: 'ENR2026003'
  });

  const student4 = await User.create({
    email: 'student4@college.edu',
    passwordHash: studentPass,
    role: 'student',
    firstName: 'Ananya',
    lastName: 'Iyer',
    studentId: 'CS2023-009',
    department: 'Computer Science and Engineering',
    year: 4,
    section: 'C',
    isActive: true
  });

  await StudentProfile.create({
    userId: student4._id,
    studentId: 'CS2023-009',
    department: 'Computer Science and Engineering',
    batch: '2022-2026',
    semester: 7,
    year: 4,
    enrollmentNumber: 'ENR2026004'
  });

  const student5 = await User.create({
    email: 'student5@college.edu',
    passwordHash: studentPass,
    role: 'student',
    firstName: 'Kavya',
    lastName: 'Reddy',
    studentId: 'EE2025-045',
    department: 'Electrical and Electronics Engineering',
    year: 2,
    section: 'A',
    isActive: true
  });

  await StudentProfile.create({
    userId: student5._id,
    studentId: 'EE2025-045',
    department: 'Electrical and Electronics Engineering',
    batch: '2024-2028',
    semester: 3,
    year: 2,
    enrollmentNumber: 'ENR2026005'
  });

  console.log('[Seeder] Users seeded:');
  console.log(' - Admin: admin@college.edu / Admin@123');
  console.log(' - Faculty: faculty@college.edu / Faculty@123');
  console.log(' - Student 1 (Year 3 CSE): student1@college.edu / Student@123');
  console.log(' - Student 2 (Year 2 IT): student2@college.edu / Student@123');
  console.log(' - Student 3 (Year 1 ECE): student3@college.edu / Student@123');
  console.log(' - Student 4 (Year 4 CSE): student4@college.edu / Student@123');
  console.log(' - Student 5 (Year 2 EEE): student5@college.edu / Student@123');

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
        defaultPassingPercentage: 100,
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

  // 4. Create Question Pools (At least 10 questions per course per level: 280 questions total)
  console.log('[Seeder] Seeding at least 10 questions for each course in each level...');
  const questionsByCourseLevel = await seedAllCourseQuestions(languagesMap, facultyUser._id);
  console.log('[Seeder] Multi-question pool seeded with 280 algorithmic questions and public/hidden test suites.');

  // 5. Helper to create 15 standard collegiate slots (5 Time Windows x 3 Labs x 30 Capacity)
  const standardTimeWindows = [
    { startH: 9, startM: 15, endH: 10, endM: 15, label: '09:15 to 10:15' },
    { startH: 10, startM: 25, endH: 11, endM: 25, label: '10:25 to 11:25' },
    { startH: 11, startM: 35, endH: 12, endM: 35, label: '11:35 to 12:35' },
    { startH: 13, startM: 30, endH: 14, endM: 30, label: '1:30 to 2:30 (13:30 - 14:30)' },
    { startH: 14, startM: 45, endH: 15, endM: 45, label: '2:45 to 3:45 (14:45 - 15:45)' }
  ];
  const standardLabs = ['Lab 1', 'Lab 2', 'Lab 3'];

  async function createStandardSlots(examinationIds: any, examDate: Date) {
    const slotDocs: any[] = [];
    for (const win of standardTimeWindows) {
      for (const lab of standardLabs) {
        const startTime = new Date(examDate);
        startTime.setHours(win.startH, win.startM, 0, 0);

        const endTime = new Date(examDate);
        endTime.setHours(win.endH, win.endM, 0, 0);

        slotDocs.push({
          examinationId: Array.isArray(examinationIds) ? examinationIds : [examinationIds],
          slotName: `${win.label} - ${lab}`,
          labName: lab,
          timeWindow: win.label,
          startTime,
          endTime,
          capacity: 30, // Strictly 30 seats per physical lab
          registeredCount: 0, // Starts at 0, strictly synchronized with real student registrations
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
    passingPercentage: 100,
    questions: questionsByCourseLevel.get(`${cLang._id}_lvl_1`) || [],
    allowedLanguages: ['c'],
    instructions: 'Write standard ISO C code. Ensure you handle input from stdin and write to stdout.',
    isPublished: true,
    createdBy: adminUser._id
  });

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
    passingPercentage: 100,
    questions: questionsByCourseLevel.get(`${cLang._id}_lvl_2`) || [],
    allowedLanguages: ['c'],
    instructions: 'Arrays and loop constructs.',
    isPublished: true,
    createdBy: adminUser._id
  });

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
    passingPercentage: 100,
    questions: questionsByCourseLevel.get(`${pyLang._id}_lvl_1`) || [],
    allowedLanguages: ['python'],
    instructions: 'Write Python 3 code. Read from sys.stdin or input().',
    isPublished: true,
    createdBy: adminUser._id
  });

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
    passingPercentage: 100,
    questions: questionsByCourseLevel.get(`${javaLang._id}_lvl_1`) || [],
    allowedLanguages: ['java'],
    instructions: 'Ensure class name is Main.',
    isPublished: true,
    createdBy: adminUser._id
  });

  // Strictly ONE set of 15 shared collegiate slots for Today (3 Labs x 30 seats = 90 seats / window, 450 daily capacity shared across C, Python, Java)
  await createStandardSlots([examC1._id, examC2._id, examPy1._id, examJava1._id], today);

  // Tomorrow's Exams (Registration unlocks strictly tonight at 9:00 PM)
  const regEndForTomorrow = new Date(tomorrow);
  regEndForTomorrow.setHours(23, 59, 59, 999);

  const examC1Tomorrow = await Examination.create({
    title: 'C Programming - Level 1 Foundation Examination',
    description: 'Comprehensive evaluation of C fundamentals: I/O, arithmetic, conditionals, and logic.',
    languageId: cLang._id,
    levelNumber: 1,
    registrationStartDate: prevDay9pmForTomorrow,
    registrationEndDate: regEndForTomorrow,
    examDate: tomorrow,
    durationMinutes: 60,
    maxStudents: 450,
    passingPercentage: 100,
    questions: questionsByCourseLevel.get(`${cLang._id}_lvl_1`) || [],
    allowedLanguages: ['c'],
    instructions: 'Write standard ISO C code. Read from stdin and write to stdout.',
    isPublished: true,
    createdBy: adminUser._id
  });

  const examC2Tomorrow = await Examination.create({
    title: 'C Programming - Level 2 Intermediate Examination',
    description: 'Evaluation of arrays, loops, and intermediate problem solving in C.',
    languageId: cLang._id,
    levelNumber: 2,
    registrationStartDate: prevDay9pmForTomorrow,
    registrationEndDate: regEndForTomorrow,
    examDate: tomorrow,
    durationMinutes: 60,
    maxStudents: 450,
    passingPercentage: 100,
    questions: questionsByCourseLevel.get(`${cLang._id}_lvl_2`) || [],
    allowedLanguages: ['c'],
    instructions: 'Arrays and loop constructs.',
    isPublished: true,
    createdBy: adminUser._id
  });

  // Strictly ONE set of 15 shared collegiate slots for Tomorrow across C Level 1 & Level 2
  await createStandardSlots([examC1Tomorrow._id, examC2Tomorrow._id], tomorrow);

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
    passingPercentage: 100,
    questions: questionsByCourseLevel.get(`${cppLang._id}_lvl_1`) || [],
    allowedLanguages: ['cpp'],
    instructions: 'Registration unlocks strictly on the previous day at 9:00 PM.',
    isPublished: true,
    createdBy: adminUser._id
  });

  // Strictly ONE set of 15 shared collegiate slots for Future Date
  await createStandardSlots([examFutureCpp._id], futureExamDate);

  // Helper to record a verified passed exam level for a student with points calculation
  async function seedPassedLevel(student: any, exam: any, language: any, levelNumber: number) {
    const slot = await ExaminationSlot.findOne({ examinationId: exam._id });
    const slotId = slot ? slot._id : new mongoose.Types.ObjectId();

    const session = await ExaminationSession.create({
      examinationId: exam._id,
      slotId,
      studentId: student._id,
      status: 'submitted',
      clientIp: '127.0.0.1',
      startedAt: new Date(Date.now() - 7200000),
      finishedAt: new Date(Date.now() - 3600000),
      deadline: new Date(Date.now() - 1800000)
    });

    const result = await ExaminationResult.create({
      sessionId: session._id,
      examinationId: exam._id,
      studentId: student._id,
      languageId: language._id,
      levelNumber,
      totalMarks: 100,
      obtainedMarks: 100,
      percentage: 100,
      passed: true,
      passingPercentageRequired: 100,
      submissions: [],
      verifiedAt: new Date()
    });

    let progress = await StudentProgress.findOne({ studentId: student._id, languageId: language._id });
    if (!progress) {
      progress = await StudentProgress.create({
        studentId: student._id,
        languageId: language._id,
        highestUnlockedLevel: levelNumber + 1,
        completedLevels: [
          {
            levelNumber,
            passedAt: new Date(),
            percentage: 100,
            obtainedMarks: 100,
            totalMarks: 100,
            examinationId: exam._id,
            resultId: result._id
          }
        ],
        isEnrolled: true,
        enrolledLevels: []
      });
    } else {
      progress.highestUnlockedLevel = Math.max(progress.highestUnlockedLevel, levelNumber + 1);
      if (!progress.completedLevels.some((c) => c.levelNumber === levelNumber)) {
        progress.completedLevels.push({
          levelNumber,
          passedAt: new Date(),
          percentage: 100,
          obtainedMarks: 100,
          totalMarks: 100,
          examinationId: exam._id,
          resultId: result._id
        });
      }
      await progress.save();
    }
  }

  // Seed merit achievements for student ranking demo:
  // 1. Aarav Sharma (Year 3 CSE): Passed C Level 1 (2 pts) + C Level 2 (4 pts) = 6 pts (Rank 1)
  await seedPassedLevel(student1, examC1, cLang, 1);
  await seedPassedLevel(student1, examC2, cLang, 2);

  // 2. Ananya Iyer (Year 4 CSE): Passed C Level 1 (2 pts) + Python Level 1 (2 pts) = 4 pts (Rank 2)
  await seedPassedLevel(student4, examC1, cLang, 1);
  await seedPassedLevel(student4, examPy1, pyLang, 1);

  // 3. Priya Patel (Year 2 IT): Passed C Level 1 (2 pts) = 2 pts (Rank 3)
  await seedPassedLevel(student2, examC1, cLang, 1);

  // 4. Rohan Verma (Year 1 ECE): Passed C Level 1 (2 pts) = 2 pts (Rank 4)
  await seedPassedLevel(student3, examC1, cLang, 1);

  // 5. Kavya Reddy (Year 2 EEE): 0 pts (Rank 5)

  console.log('[Seeder] Examinations published for C (Levels 1 & 2), Python (Level 1), Java (Level 1), C++ (Level 1).');
  console.log('[Seeder] Seeded student merit achievements: Aarav (6 pts, Rank 1), Ananya (4 pts, Rank 2), Priya (2 pts, Rank 3), Rohan (2 pts, Rank 4), Kavya (0 pts).');
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

