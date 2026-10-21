import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  Award,
  Users,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export const ExamFeedbackVerification: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [sessionData, setSessionData] = useState<any>(null);
  const [examData, setExamData] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Form states - OTP and feedback textbox only
  const [comments, setComments] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  // Submission & feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpiredError, setIsExpiredError] = useState(false);

  // Success & Logout Gate state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(6);

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

  // Auto-redirect countdown once OTP is verified
  useEffect(() => {
    if (!isSubmitted) return;

    const interval = setInterval(() => {
      setLogoutTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleRedirectToCourses();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleRedirectToCourses = () => {
    navigate('/student/total-courses');
  };

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
        comments: comments.trim()
      });

      if (res.data.success) {
        setIsSubmitted(true);
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

  // Success & Logout Modal / Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-emerald-500/30 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">Exam Finalized & Verified!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your feedback and code solutions have been verified with the faculty OTP and officially submitted.
            </p>
          </div>

          {/* Redirect Notice & Auto-redirect countdown */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 font-semibold block">Redirecting to Total Courses in</span>
            <span className="text-2xl font-mono font-black text-emerald-400 block">{logoutTimer} seconds</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRedirectToCourses}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/30"
            >
              <BookOpen className="w-4 h-4" />
              <span>Go to Total Courses Now</span>
            </button>

            <button
              onClick={() => navigate(`/exam/result/${sessionId}`)}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-700"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View Scorecard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <span>Questions Complete</span>
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
            <span>Logout / Result</span>
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
                  Faculty generates one OTP for all students in the lab. Enter the 6-digit OTP displayed by faculty to verify and log out from the exam.
                </p>
              </div>
            </div>

            {/* In-Lab Instruction Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>20-Second Submission Rule:</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The OTP generated by your faculty is valid for <strong className="text-white">exactly 20 seconds</strong> and can be used by all students. Enter the 6-digit code below and click <strong className="text-teal-300">"Verify OTP & Log Out"</strong> before the 20 seconds expire.
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

          {/* Card 2: Student Feedback */}
          <div className="bg-slate-950/70 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Student Feedback</h3>
                <p className="text-xs text-slate-400">Share your feedback or comments on the exam (Optional)</p>
              </div>
            </div>

            {/* Feedback Comments Text Box */}
            <div className="space-y-2">
              <label htmlFor="comments" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Feedback Comments
              </label>
              <textarea
                id="comments"
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any thoughts on question clarity, compiler experience, or suggestions..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-y"
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
                  <span>Verifying OTP & Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Verify OTP & Logout from Exam</span>
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
