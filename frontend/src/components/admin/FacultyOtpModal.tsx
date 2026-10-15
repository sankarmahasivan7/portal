import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Key,
  Clock,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
  Copy,
  Check,
  ShieldCheck,
  User
} from 'lucide-react';

interface StudentData {
  _id?: string;
  id?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
}

interface FacultyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudent?: StudentData | null;
}

export const FacultyOtpModal: React.FC<FacultyOtpModalProps> = ({
  isOpen,
  onClose,
  initialStudent
}) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // OTP State
  const [otp, setOtp] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialStudent) {
        setSelectedStudent(initialStudent);
        generateOtpForStudent(initialStudent);
      } else {
        setSelectedStudent(null);
        setOtp(null);
        setExpiresAt(null);
        setSecondsRemaining(0);
        setSearchQuery('');
        setSearchResults([]);
      }
      setErrorMessage(null);
    }
  }, [isOpen, initialStudent]);

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

  const generateOtpForStudent = async (student: StudentData) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setCopied(false);

    try {
      const targetId = student._id || student.id || student.studentId;
      const res = await api.post('/admin/attendance/generate-submission-otp', {
        studentId: targetId
      });

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

  const handleSearchStudents = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await api.get('/admin/attendance/search-students', {
        params: { query: query.trim() }
      });
      if (res.data.success) {
        setSearchResults(res.data.students || []);
      }
    } catch (err) {
      console.error('Error searching students', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStudent = (st: any) => {
    setSelectedStudent(st);
    setSearchResults([]);
    setSearchQuery('');
    generateOtpForStudent(st);
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

  const studentDisplayName =
    selectedStudent?.name ||
    `${selectedStudent?.firstName || ''} ${selectedStudent?.lastName || ''}`.trim() ||
    'Student';
  const studentRollNo = selectedStudent?.studentId || selectedStudent?.email || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Faculty Submission OTP</h2>
              <p className="text-xs text-slate-400">Strict 20-Second Verification Window</p>
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
          {/* Student Selector / Search (if not preselected) */}
          {!selectedStudent && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Find Student by Roll Number or Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. CS2026-001 or Student Name..."
                  value={searchQuery}
                  onChange={(e) => handleSearchStudents(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white shadow-lg mt-1">
                  {searchResults.map((st) => (
                    <button
                      key={st._id}
                      onClick={() => handleSelectStudent(st)}
                      className="w-full p-3 text-left hover:bg-teal-50/60 flex items-center justify-between text-xs transition"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {st.firstName} {st.lastName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {st.studentId} • {st.department || 'Student'}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-lg font-bold text-[10px]">
                        Select & Generate
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Student Display */}
          {selectedStudent && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    {studentDisplayName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    Roll No: {studentRollNo}
                  </span>
                </div>
              </div>

              {!initialStudent && (
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setOtp(null);
                    setExpiresAt(null);
                  }}
                  className="text-[11px] font-bold text-teal-600 hover:text-teal-800"
                >
                  Change Student
                </button>
              )}
            </div>
          )}

          {/* OTP Box & Countdown */}
          {selectedStudent && (
            <div className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {otp && (
                <div
                  className={`p-6 rounded-3xl border-2 text-center space-y-4 transition-all ${
                    isExpired
                      ? 'bg-rose-50/50 border-rose-300'
                      : 'bg-teal-50/40 border-teal-500 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    {isExpired ? 'Submission OTP Expired' : 'Active 6-Digit Submission Code'}
                  </span>

                  {/* 6-Digit Display */}
                  <div className="flex items-center justify-center space-x-2">
                    {otp.split('').map((digit, idx) => (
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

                  {/* Countdown Timer Display */}
                  {!isExpired ? (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Strict Validity Countdown:</span>
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
                        The 20-second validity window has passed. Click "Regenerate OTP" below to create a fresh code for the student.
                      </p>
                    </div>
                  )}

                  {/* Action Row */}
                  <div className="pt-2 flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={isExpired}
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
                      onClick={() => generateOtpForStudent(selectedStudent)}
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
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Attendance & Security Invigilation Module</span>
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
