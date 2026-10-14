import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { Award, CheckCircle2, XCircle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const ExamResultView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/exams/session/${sessionId}/result`);
        if (res.data.success) {
          setResult(res.data.result);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to retrieve examination results.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-rose-600 font-medium">{error || 'Scorecard not found.'}</p>
          <Link
            to="/student/my-courses"
            className="inline-block px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Return to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const isPassed = result.passed;
  const exam = result.examinationId;

  return (
    <div className="bg-slate-50 min-h-screen py-12 text-slate-800">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-xs ${
                isPassed
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}
            >
              {isPassed ? <Sparkles className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Official Assessment Scorecard
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                {exam?.title || 'Programming Examination'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Level {result.levelNumber} Milestone Evaluation
              </p>
            </div>

            {/* Verdict Banner */}
            <div
              className={`inline-block px-6 py-2 rounded-full text-base font-extrabold tracking-wider uppercase border shadow-xs ${
                isPassed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {isPassed ? 'PASSED — LEVEL CRITERIA MET' : 'FAILED — PASS CRITERIA NOT SATISFIED'}
            </div>

            {/* Score Matrix */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Total Marks</span>
                <span className="text-xl font-bold text-slate-900 block mt-1 font-mono">
                  {result.obtainedMarks} / {result.totalMarks}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Percentage</span>
                <span className="text-xl font-bold text-teal-700 block mt-1 font-mono">
                  {result.percentage}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Passing Cutoff</span>
                <span className="text-xl font-bold text-slate-700 block mt-1 font-mono">
                  {result.passingPercentageRequired}%
                </span>
              </div>
            </div>

            {/* Unlocked Level Notification */}
            <div
              className={`p-4 rounded-2xl border text-sm max-w-lg mx-auto ${
                isPassed
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {isPassed ? (
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Success!</strong> Level {result.levelNumber + 1} has now been automatically unlocked in your courses.
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 justify-center">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>
                    Level {result.levelNumber + 1} remains locked. You can review the course videos and register for a retake slot.
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-center space-x-4">
              <Link
                to="/student/my-courses"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>Return to My Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExamResultView;
