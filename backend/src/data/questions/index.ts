import mongoose from 'mongoose';
import { Question } from '../../models/Question';
import { TestCase } from '../../models/TestCase';
import { RawQuestionData, C_QUESTIONS } from './cQuestions';
import { CPP_QUESTIONS } from './cppQuestions';
import { JAVA_QUESTIONS } from './javaQuestions';
import { PYTHON_QUESTIONS } from './pythonQuestions';
import { JAVASCRIPT_QUESTIONS } from './javascriptQuestions';

export { RawQuestionData, C_QUESTIONS, CPP_QUESTIONS, JAVA_QUESTIONS, PYTHON_QUESTIONS, JAVASCRIPT_QUESTIONS };

export const ALL_COURSE_QUESTIONS: RawQuestionData[] = [
  ...C_QUESTIONS,
  ...CPP_QUESTIONS,
  ...JAVA_QUESTIONS,
  ...PYTHON_QUESTIONS,
  ...JAVASCRIPT_QUESTIONS
];

/**
 * Bulk seeds all 280 course questions and their test cases.
 * Optimized for space efficiency and fast execution using insertMany batches.
 */
export async function seedAllCourseQuestions(
  languagesMap: Map<string, any>,
  facultyUserId: mongoose.Types.ObjectId
): Promise<Map<string, mongoose.Types.ObjectId[]>> {
  console.log(`[QuestionSeeder] Starting bulk seed of ${ALL_COURSE_QUESTIONS.length} questions across all courses & levels...`);

  const questionsByCourseLevel = new Map<string, mongoose.Types.ObjectId[]>();

  // Prepare questions batch
  const questionDocsToInsert: any[] = [];
  const testCasesBySlug = new Map<string, any[]>();

  for (const q of ALL_COURSE_QUESTIONS) {
    const lang = languagesMap.get(q.courseSlug);
    const langId = lang ? lang._id : undefined;

    questionDocsToInsert.push({
      title: q.title,
      slug: q.slug,
      description: q.description,
      inputFormat: q.inputFormat,
      outputFormat: q.outputFormat,
      constraints: q.constraints,
      examples: q.examples,
      allowedLanguages: q.allowedLanguages,
      languageId: langId,
      targetLevel: q.targetLevel,
      difficulty: q.difficulty,
      marks: q.marks,
      timeLimitMs: 4000,
      memoryLimitMb: 256,
      isDraft: false,
      isArchived: false,
      createdBy: facultyUserId
    });

    testCasesBySlug.set(q.slug, q.testCases);
  }

  // Bulk insert questions in batches of 100 for memory and space safety
  const createdQuestions = await Question.insertMany(questionDocsToInsert, { ordered: false });

  // Prepare test cases batch
  const testCaseDocsToInsert: any[] = [];

  for (const qDoc of createdQuestions) {
    const key = `${(qDoc.languageId ? qDoc.languageId.toString() : 'gen')}_lvl_${qDoc.targetLevel}`;
    if (!questionsByCourseLevel.has(key)) {
      questionsByCourseLevel.set(key, []);
    }
    questionsByCourseLevel.get(key)!.push(qDoc._id);

    const tcList = testCasesBySlug.get(qDoc.slug) || [];
    for (let i = 0; i < tcList.length; i++) {
      const tc = tcList[i];
      testCaseDocsToInsert.push({
        questionId: qDoc._id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        weight: tc.weight || 1,
        order: tc.order || (i + 1)
      });
    }
  }

  // Bulk insert test cases in batches
  const BATCH_SIZE = 500;
  for (let i = 0; i < testCaseDocsToInsert.length; i += BATCH_SIZE) {
    const chunk = testCaseDocsToInsert.slice(i, i + BATCH_SIZE);
    await TestCase.insertMany(chunk, { ordered: false });
  }

  console.log(`[QuestionSeeder] Successfully seeded ${createdQuestions.length} questions and ${testCaseDocsToInsert.length} test cases!`);
  return questionsByCourseLevel;
}

