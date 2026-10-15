import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Key,
  Clock,
  RefreshCw,
  X,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  Users
} from 'lucide-react';

interface FacultyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacultyOtpModal: React.FC<FacultyOtpModalProps> = ({
  isOpen,
  onClose
}) => {
  const [otp, setOtp] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When modal opens, automatically generate a fresh OTP immediately
  useEffect(() => {
    if (isOpen) {
      generateUniversalOtp();
      setErrorMessage(null);
    } else {
      setOtp(null);
      setExpiresAt(null);
      setSecondsRemaining(0);
    }
  }, [isOpen]);

  // 1-second countdown ticker for the 20-second validity window
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const generateUniversalOtp = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setCopied(false);

    try {
      // Simply calls backend without student ID - generates one OTP for all students
      const res = await api.post('/admin/attendance/generate-submission-otp', {});

      if (res.data.success) {
        setOtp(res.data.otp);
        const expTime = new Date(res.data.expiresAt).getTime();
        setExpiresAt(expTime);
        setSecondsRemaining(20);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to generate submission OTP.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!otp) return;
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isExpired = secondsRemaining === 0 && otp !== null;
  const progressPercent = Math.min(100, (secondsRemaining / 20) * 100);

  const getTimerColor = () => {
    if (secondsRemaining > 10) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (secondsRemaining > 5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressColor = () => {
    if (secondsRemaining > 10) return 'bg-emerald-500';
    if (secondsRemaining > 5) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Lab Submission OTP</h2>
              <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>One OTP for all students • 20s Window</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* OTP Box & Countdown */}
          <div
            className={`p-6 rounded-3xl border-2 text-center space-y-5 transition-all ${
              isExpired
                ? 'bg-rose-50/50 border-rose-300'
                : 'bg-teal-50/40 border-teal-500 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isExpired ? 'Submission OTP Expired' : 'Active 6-Digit Code'}
              </span>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                All Students
              </span>
            </div>

            {/* 6-Digit Display */}
            {isGenerating && !otp ? (
              <div className="py-6 flex flex-col items-center justify-center space-y-2">
                <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-500 font-semibold">Generating 20-second OTP...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                {(otp || '000000').split('').map((digit, idx) => (
                  <span
                    key={idx}
                    className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-mono font-black shadow-xs transition ${
                      isExpired
                        ? 'bg-rose-100 border-rose-300 text-rose-500 line-through'
                        : 'bg-white border-teal-400 text-teal-800'
                    }`}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            )}

            {/* Countdown Timer Display */}
            {!isExpired ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>20-Second Validity Countdown:</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full border ${getTimerColor()}`}>
                    {secondsRemaining}s remaining
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 rounded-full ${getProgressColor()}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-rose-100/80 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                <span className="font-extrabold block">⚠️ 20 Seconds Expired — Code Invalidated</span>
                <p className="text-[11px] text-rose-600">
                  The 20-second validity window has passed. Click "Regenerate OTP" below to generate a new valid code.
                </p>
              </div>
            )}

            {/* Action Row */}
            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handleCopy}
                disabled={isExpired || !otp}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy OTP</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={generateUniversalOtp}
                disabled={isGenerating}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs ${
                  isExpired
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isExpired ? 'Regenerate OTP (20s)' : 'Refresh OTP'}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">💡 In-Lab Submission Instruction</span>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Students finishing the exam enter this 6-digit OTP on their feedback screen to verify submission and securely log out from the exam room.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Lab Exam Invigilation</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
