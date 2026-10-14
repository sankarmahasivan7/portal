import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Code2
} from 'lucide-react';

export const ExamResultView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        setIsLoading(true);
        const res = await api.get(`/exams/session/${sessionId}/result`);
        if (res.data.success) {
          setResult(res.data.result);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to retrieve examination scorecard.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchResult();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <p className="text-rose-400">{error || 'Scorecard not found.'}</p>
          <Link
            to="/student/dashboard"
            className="inline-block px-4 py-2 bg-teal-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPassed = result.passed;
  const exam = result.examinationId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Background glow */}
        <div
          className={`absolute inset-0 opacity-10 pointer-events-none ${
            isPassed ? 'bg-gradient-to-b from-emerald-500 to-transparent' : 'bg-gradient-to-b from-rose-500 to-transparent'
          }`}
        />

        <div className="relative z-10 space-y-4">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${
              isPassed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {isPassed ? <Sparkles className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Official Assessment Scorecard
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              {exam?.title || 'Programming Examination'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Level {result.levelNumber} Milestone Evaluation
            </p>
          </div>

          {/* Verdict Banner */}
          <div
            className={`inline-block px-6 py-2 rounded-full text-base font-extrabold tracking-wider uppercase border shadow-md ${
              isPassed
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {isPassed ? 'PASSED — LEVEL CRITERIA MET' : 'FAILED — PASS CRITERIA NOT SATISFIED'}
          </div>

          {/* Score Matrix */}
          <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Total Marks</span>
              <span className="text-xl font-bold text-white block mt-1 font-mono">
                {result.obtainedMarks} / {result.totalMarks}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Percentage</span>
              <span className="text-xl font-bold text-teal-400 block mt-1 font-mono">
                {result.percentage}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Passing Cutoff</span>
              <span className="text-xl font-bold text-slate-300 block mt-1 font-mono">
                {result.passingPercentageRequired}%
              </span>
            </div>
          </div>

          {/* Unlocked Level Notification */}
          <div
            className={`p-4 rounded-2xl border text-sm max-w-lg mx-auto ${
              isPassed
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            {isPassed ? (
              <div className="flex items-center space-x-2 justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Success!</strong> Level {result.levelNumber + 1} has now been automatically unlocked on your dashboard.
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 justify-center">
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>
                  Level {result.levelNumber + 1} remains locked. You can review and register for a retake slot.
                </span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition"
            >
              <span>Back to Candidate Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

