import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Star,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ExamFeedbackVerification: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState<any>(null);
  const [examData, setExamData] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'hard' | 'very_hard'>('moderate');
  const [comments, setComments] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  // Submission & feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpiredError, setIsExpiredError] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoadingSession(true);
        const res = await api.get(`/exams/session/${sessionId}`);
        if (res.data.success) {
          setSessionData(res.data.session);
          setExamData(res.data.exam);
        }
      } catch (err: any) {
        console.error('Failed to load session details', err);
      } finally {
        setIsLoadingSession(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    if (errorMessage) {
      setErrorMessage(null);
      setIsExpiredError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification OTP provided by your faculty.');
      setIsExpiredError(false);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setIsExpiredError(false);

    try {
      const res = await api.post(`/exams/session/${sessionId}/finalize-with-feedback`, {
        otp: otp.trim(),
        rating,
        difficulty,
        comments: comments.trim()
      });

      if (res.data.success) {
        navigate(`/exam/result/${sessionId}`);
      }
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.expired) {
        setIsExpiredError(true);
        setErrorMessage(
          data.message ||
            'OTP has expired! The 20-second validity window has passed. Please ask your faculty invigilator to click "Generate OTP" again.'
        );
      } else {
        setIsExpiredError(false);
        setErrorMessage(
          data?.message || 'Verification failed. Please check the OTP or ask faculty for assistance.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyOptions: { value: 'easy' | 'moderate' | 'hard' | 'very_hard'; label: string; desc: string }[] = [
    { value: 'easy', label: 'Easy', desc: 'Straightforward' },
    { value: 'moderate', label: 'Moderate', desc: 'Balanced & fair' },
    { value: 'hard', label: 'Challenging', desc: 'Required deep effort' },
    { value: 'very_hard', label: 'Very Tough', desc: 'Highly complex' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
            PS
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
              <span>{examData?.title || 'Examination Complete'}</span>
              {examData?.language && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {examData.language}
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">Step 2: Student Feedback & Faculty Lab Verification</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Questions Submitted</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 space-y-6">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
              ✓
            </span>
            <span>Coding Complete</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-teal-500/30" />
          <div className="flex items-center space-x-2 text-teal-300 font-extrabold">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center text-xs">
              2
            </span>
            <span>Feedback & Faculty OTP</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-slate-800" />
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
              3
            </span>
            <span>Scorecard</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Faculty Verification & OTP */}
          <div className="bg-slate-950/90 rounded-3xl border-2 border-teal-500/40 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-extrabold text-white">Faculty Lab Verification</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    20s Strict Window
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Please call the lab faculty / invigilator to generate your verification One-Time Password on their attendance console.
                </p>
              </div>
            </div>

            {/* In-Lab Instruction Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Time-Sensitive Submission Rule:</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The OTP generated by your faculty is valid for <strong className="text-white">exactly 20 seconds</strong> from creation. Enter the 6-digit code below and click <strong className="text-teal-300">"Finalize & Submit Exam"</strong> before the 20 seconds expire.
              </p>
            </div>

            {/* OTP Input Field */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Enter Faculty 6-Digit OTP
              </label>

              <div className="flex justify-center">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="• • • • • •"
                  autoFocus
                  className="w-full max-w-sm py-3.5 px-6 text-center text-3xl sm:text-4xl font-mono font-black tracking-[0.4em] bg-slate-900 border-2 border-slate-700 rounded-2xl text-teal-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/20 transition shadow-inner"
                />
              </div>

              {/* Error / Expired Banner */}
              {errorMessage && (
                <div
                  className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs animate-shake ${
                    isExpiredError
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                      : 'bg-rose-950/40 border-rose-600/40 text-rose-300'
                  }`}
                >
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">
                      {isExpiredError ? '⚠️ 20-SECOND OTP EXPIRED' : 'Verification Error'}
                    </span>
                    <p className="leading-relaxed">{errorMessage}</p>
                    {isExpiredError && (
                      <p className="text-[11px] text-amber-300 font-medium pt-1">
                        👉 Please ask your faculty invigilator to click <strong>"Generate OTP"</strong> again on their screen and enter the new code.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Student Feedback & Experience */}
          <div className="bg-slate-950/70 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Star className="w-4 h-4 fill-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Your Examination Feedback</h3>
                <p className="text-xs text-slate-400">Help the department improve future test questions and platform quality</p>
              </div>
            </div>

            {/* 1. Star Rating */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-300">
                1. How was your overall examination experience?
              </span>
              <div className="flex items-center space-x-2 pt-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isActive = (hoverRating !== null ? hoverRating : rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(starVal)}
                      className="p-1 rounded-lg transition hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition ${
                          isActive
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-700 hover:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-semibold text-slate-400 ml-3">
                  {rating === 5 && '🌟 Outstanding'}
                  {rating === 4 && '👍 Very Good'}
                  {rating === 3 && '👌 Satisfactory'}
                  {rating === 2 && '👎 Needs Improvement'}
                  {rating === 1 && '⚠️ Poor'}
                </span>
              </div>
            </div>

            {/* 2. Difficulty Level */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-300">
                2. How would you rate the problem difficulty?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {difficultyOptions.map((opt) => {
                  const isSelected = difficulty === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDifficulty(opt.value)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        isSelected
                          ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{opt.label}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Feedback Comments */}
            <div className="space-y-2">
              <label htmlFor="comments" className="block text-xs font-bold text-slate-300">
                3. Additional feedback / comments (Optional)
              </label>
              <textarea
                id="comments"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any thoughts on question clarity, compiler experience, or suggestions..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
            >
              ← Back to Code Arena
            </button>

            <button
              type="submit"
              disabled={isSubmitting || otp.trim().length !== 6}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying OTP & Computing Score...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Finalize & Submit Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
