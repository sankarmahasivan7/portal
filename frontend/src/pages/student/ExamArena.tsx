import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Terminal,
  Send,
  Save,
  Check,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Building,
  RefreshCw,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Users,
  MonitorOff,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface DisciplinaryRule {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const DISCIPLINARY_RULES: DisciplinaryRule[] = [
  {
    id: 'silence',
    title: 'Lab Decorum & Strict Silence',
    description: 'I will maintain absolute silence in the examination laboratory and will not talk, whisper, gesture, or attempt to communicate with any other student.',
    icon: Users
  },
  {
    id: 'no_devices',
    title: 'No Prohibited Electronic Devices',
    description: 'I confirm that I do not have cell phones, smart watches, earphones, bluetooth devices, or unauthorized physical notes in my possession at the examination terminal.',
    icon: MonitorOff
  },
  {
    id: 'anti_cheating',
    title: 'Proctoring & No Tab Switching Policy',
    description: 'I understand that switching browser tabs, minimizing this test window, or opening external programs is strictly prohibited and will immediately terminate my exam.',
    icon: ShieldAlert
  },
  {
    id: 'original_work',
    title: 'Independent Original Solutions',
    description: 'All programming code and logic submitted will be entirely my own original work composed during this active test window without plagiarized material.',
    icon: Code2
  },
  {
    id: 'disciplinary_compliance',
    title: 'Disciplinary Action & Score Cancellation',
    description: 'I accept that any violation of examination conduct or ethical rules will result in immediate disqualification, zero score, and institutional disciplinary action.',
    icon: ShieldCheck
  }
];

export const ExamArena: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>('c');

  const [remainingSeconds, setRemainingSeconds] = useState<number>(3600);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Ready');

  // Rules Checklist & Pre-Test State
  const [hasStartedExam, setHasStartedExam] = useState(false);
  const [rulesChecked, setRulesChecked] = useState<Record<string, boolean>>({});
  const [isStartingTest, setIsStartingTest] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Console output & tabs
  const [activeConsoleTab, setActiveConsoleTab] = useState<'tests' | 'errors' | 'input' | 'output'>('tests');
  const [customInput, setCustomInput] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [compileError, setCompileError] = useState<string | null>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [latestVerdict, setLatestVerdict] = useState<string | null>(null);
  const [latestScore, setLatestScore] = useState<number | null>(null);

  // Slot & Attendance Metadata
  const [assignedSlot, setAssignedSlot] = useState<any>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string>('present');

  // Tab-switch Proctoring Anti-Cheating States
  const [isTabViolationTerminated, setIsTabViolationTerminated] = useState(false);
  const [showProctorModal, setShowProctorModal] = useState(false);
  const [tabViolationSeconds, setTabViolationSeconds] = useState(5);
  const hasViolatedRef = useRef(false);

  // Populate session, questions, and code editor templates/drafts
  const populateSessionAndQuestions = (sess: any, ex: any, qs: any[]) => {
    setSession(sess);
    setExam(ex);
    setQuestions(qs);
    setRemainingSeconds(sess.remainingSeconds);

    const langSlug = ex.languageSlug || 'c';
    setSelectedLanguage(langSlug);

    const initialCode: Record<string, string> = {};
    qs.forEach((q: any) => {
      if (sess.drafts && sess.drafts[q.id]) {
        initialCode[q.id] = sess.drafts[q.id].code;
      } else {
        if (langSlug === 'c') {
          initialCode[q.id] = `#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    \n    return 0;\n}\n`;
        } else if (langSlug === 'cpp') {
          initialCode[q.id] = `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    \n    return 0;\n}\n`;
        } else if (langSlug === 'java') {
          initialCode[q.id] = `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n        \n    }\n}\n`;
        } else if (langSlug === 'python') {
          initialCode[q.id] = `import sys\n\ndef main():\n    # Write your Python solution here\n    pass\n\nif __name__ == '__main__':\n    main()\n`;
        } else {
          initialCode[q.id] = `// Solution\n`;
        }
      }
    });
    setCodeMap(initialCode);
  };

  // Initialize: verify attendance and check if session is already running
  const initSession = async () => {
    try {
      setIsInitializing(true);

      // 1. Verify staff-marked attendance status and check for existing active session
      const attRes = await api.get(`/exams/${examId}/attendance-status`);
      if (attRes.data.success && attRes.data.hasRegistration) {
        setAssignedSlot(attRes.data.slot);
        setAttendanceStatus(attRes.data.attendanceStatus);

        // Attendance check: Must be marked Present by lab staff
        if (attRes.data.attendanceStatus !== 'present') {
          alert(
            attRes.data.attendanceStatus === 'absent'
              ? 'You have been marked absent by the invigilator for this slot.'
              : 'Attendance must be marked Present by lab staff before taking the exam.'
          );
          navigate(-1);
          return;
        }

        // If candidate already has an active session running (e.g. refreshed page during test)
        if (attRes.data.hasActiveSession && attRes.data.activeSessionId) {
          const sessionDataRes = await api.get(`/exams/session/${attRes.data.activeSessionId}`);
          const { session: sess, exam: ex, questions: qs } = sessionDataRes.data;
          populateSessionAndQuestions(sess, ex, qs);
          setHasStartedExam(true);
          setIsInitializing(false);
          return;
        }
      }

      // 2. Fresh start: fetch exam meta details to display in the rules undertaking screen
      const examRes = await api.get(`/exams/${examId}`);
      if (examRes.data.success) {
        setExam(examRes.data.exam);
      }
      setHasStartedExam(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to initialize examination session.');
      navigate('/student/my-courses');
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initSession();
  }, [examId]);

  // Toggle individual rule
  const handleToggleRule = (id: string) => {
    setRulesChecked((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle all rules
  const allRulesChecked = DISCIPLINARY_RULES.every((rule) => !!rulesChecked[rule.id]);

  const handleToggleAllRules = () => {
    if (allRulesChecked) {
      setRulesChecked({});
    } else {
      const all: Record<string, boolean> = {};
      DISCIPLINARY_RULES.forEach((r) => {
        all[r.id] = true;
      });
      setRulesChecked(all);
    }
  };

  // Start Examination session after affirming all rules
  const handleStartExam = async () => {
    if (!allRulesChecked) {
      setStartError('Please review and check all disciplinary rules above to start the exam.');
      return;
    }

    try {
      setIsStartingTest(true);
      setStartError(null);

      // Start the examination session on the server
      const startRes = await api.post(`/exams/${examId}/start-session`);
      const sId = startRes.data.sessionId;

      // Fetch questions, deadline, drafts
      const sessionDataRes = await api.get(`/exams/session/${sId}`);
      const { session: sess, exam: ex, questions: qs } = sessionDataRes.data;

      populateSessionAndQuestions(sess, ex, qs);
      setHasStartedExam(true);
    } catch (err: any) {
      setStartError(err.response?.data?.message || 'Failed to start examination session. Please contact invigilator.');
    } finally {
      setIsStartingTest(false);
    }
  };

  // Server-authoritative timer countdown loop
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  // Auto-finalization when countdown hits 0
  const handleTimeExpired = async () => {
    alert('Examination time has expired! Your code is being automatically submitted for evaluation.');
    await handleFinalSubmit(true);
  };

  // Active Tab-Switch Monitoring (Institutional Anti-Cheating Gate)
  useEffect(() => {
    if (!session || session.status !== 'active' || isFinalizing || isTabViolationTerminated || !hasStartedExam) return;

    const handleTabViolation = async () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        if (hasViolatedRef.current) return;
        hasViolatedRef.current = true;
        setIsTabViolationTerminated(true);

        try {
          await api.post(`/exams/session/${session.id}/tab-violation`);
        } catch (err) {
          console.error('Failed to report tab violation to server', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleTabViolation);

    return () => {
      document.removeEventListener('visibilitychange', handleTabViolation);
    };
  }, [session, isFinalizing, isTabViolationTerminated]);

  // Tab Violation Auto-Exit Countdown
  useEffect(() => {
    if (!isTabViolationTerminated) return;

    const interval = setInterval(() => {
      setTabViolationSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/student/total-courses');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTabViolationTerminated]);

  // Autosave draft every 30 seconds
  useEffect(() => {
    if (!session || questions.length === 0) return;
    const currentQ = questions[activeQuestionIndex];
    if (!currentQ) return;

    const currentCode = codeMap[currentQ.id];
    if (!currentCode) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        setSaveStatus('Saving...');
        await api.post(`/exams/session/${session.id}/draft`, {
          questionId: currentQ.id,
          language: selectedLanguage,
          code: currentCode
        });
        setSaveStatus('Autosaved');
      } catch {
        setSaveStatus('Save error');
      }
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [codeMap, activeQuestionIndex, session, selectedLanguage]);

  const currentQuestion = questions[activeQuestionIndex];

  const handleCodeChange = (value: string | undefined) => {
    if (!currentQuestion) return;
    setCodeMap((prev) => ({ ...prev, [currentQuestion.id]: value || '' }));
    setSaveStatus('Unsaved edits');
  };

  // Run Code against Public Test Cases
  const handleRunPublic = async () => {
    if (!session || !currentQuestion) return;
    setIsRunning(true);
    setCompileError(null);
    setErrorLog(null);
    setConsoleOutput('');
    setTestResults([]);

    try {
      const res = await api.post(`/exams/session/${session.id}/run`, {
        questionId: currentQuestion.id,
        language: selectedLanguage,
        code: codeMap[currentQuestion.id],
        customInput
      });

      if (res.data.success) {
        const r = res.data.result;
        setLatestVerdict(r.verdict);
        const err = r.errorLog || r.compileOutput || (r.testCaseResults?.find((tc: any) => !tc.passed && tc.errorMessage)?.errorMessage) || null;
        setCompileError(r.compileOutput || null);
        setErrorLog(err);
        setTestResults(r.testCaseResults || []);

        // Aggregate standard output streams
        let outText = '';
        if (customInput && r.testCaseResults?.[0]) {
          outText = r.testCaseResults[0].actualOutput || '';
        } else if (r.testCaseResults && r.testCaseResults.length > 0) {
          outText = r.testCaseResults
            .map((tc: any, i: number) => `--- Test Case ${i + 1} (${tc.passed ? 'PASSED' : 'FAILED'}) ---\n${tc.actualOutput || '(no standard output)'}`)
            .join('\n\n');
        }
        setConsoleOutput(outText);

        // Auto-switch tabs: if error occurs, highlight Compiler & Error Logs immediately
        if (r.verdict === 'Compilation Error' || r.verdict === 'Runtime Error' || (err && r.verdict !== 'Accepted')) {
          setActiveConsoleTab('errors');
        } else if (customInput && r.testCaseResults?.[0]) {
          setActiveConsoleTab('output');
        } else {
          setActiveConsoleTab('tests');
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error running code.');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Answer to Question (Evaluates Public + Hidden Test Cases)
  const handleSubmitAnswer = async () => {
    if (!session || !currentQuestion) return;
    setIsSubmitting(true);
    setCompileError(null);
    setErrorLog(null);
    setTestResults([]);

    try {
      const res = await api.post(`/exams/session/${session.id}/submit`, {
        questionId: currentQuestion.id,
        language: selectedLanguage,
        code: codeMap[currentQuestion.id]
      });

      if (res.data.success) {
        setLatestVerdict(res.data.verdict);
        setLatestScore(res.data.score);
        const err = res.data.errorLog || res.data.compileOutput || (res.data.testCaseResults?.find((tc: any) => !tc.passed && tc.errorMessage)?.errorMessage) || null;
        setCompileError(res.data.compileOutput || null);
        setErrorLog(err);
        setTestResults(res.data.testCaseResults || []);

        // Auto-switch to errors tab if compilation or runtime error occurred
        if (res.data.verdict === 'Compilation Error' || res.data.verdict === 'Runtime Error' || (err && res.data.verdict !== 'Accepted')) {
          setActiveConsoleTab('errors');
        } else {
          setActiveConsoleTab('tests');
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Submission error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final Submit & End Examination Session
  const handleFinalSubmit = async (forced: boolean = false) => {
    if (!forced) {
      const confirm = window.confirm(
        'Are you sure you want to finalize and end this examination? Your latest code for all problems will be evaluated and your score will be calculated.'
      );
      if (!confirm) return;
    }

    setIsFinalizing(true);
    try {
      // First ensure current question answer is submitted
      if (currentQuestion) {
        await api.post(`/exams/session/${session.id}/submit`, {
          questionId: currentQuestion.id,
          language: selectedLanguage,
          code: codeMap[currentQuestion.id]
        }).catch(() => {});
      }

      // Open feedback and faculty OTP verification gate
      navigate(`/exam/feedback/${session.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error proceeding to verification.');
    } finally {
      setIsFinalizing(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">
            Establishing secure examination session & loading code editor...
          </span>
        </div>
      </div>
    );
  }

  // Examination Rules & Disciplinary Undertaking Gate
  if (!hasStartedExam) {
    const checkedCount = DISCIPLINARY_RULES.filter((r) => !!rulesChecked[r.id]).length;
    const allChecked = checkedCount === DISCIPLINARY_RULES.length;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
        <div className="max-w-2xl w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-500/30">
                    Institutional Code of Conduct
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
                  Examination Rules & Disciplinary Undertaking
                </h2>
              </div>
            </div>
          </div>

          {/* Candidate & Exam Metadata Banner */}
          <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Candidate</span>
              <span className="text-slate-200 font-bold truncate block">
                {user ? `${user.firstName} ${user.lastName}` : 'Candidate'}
              </span>
              <span className="text-teal-400 font-mono text-[11px] block truncate">
                {user?.studentId || user?.email}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Examination</span>
              <span className="text-slate-200 font-bold truncate block">
                {exam?.title || 'Course Examination'}
              </span>
              <span className="text-teal-400 text-[11px] block font-semibold">
                Level {exam?.levelNumber || '1'} • 60 Minutes
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Allocated Lab</span>
              <span className="text-slate-200 font-bold truncate block flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-teal-400" />
                <span>{assignedSlot?.labName || 'Designated College Lab'}</span>
              </span>
              <span className="text-emerald-400 text-[11px] font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Present</span>
              </span>
            </div>
          </div>

          {/* Rules Checklist Content */}
          <div className="p-6 sm:p-7 space-y-5 overflow-y-auto max-h-[55vh]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Candidate Affirmations & Lab Rules
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  You must review and check all 5 disciplinary conditions before starting the test.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleAllRules}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition"
              >
                {allChecked ? 'Deselect All' : 'Select All Rules'}
              </button>
            </div>

            {startError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{startError}</span>
              </div>
            )}

            <div className="space-y-3">
              {DISCIPLINARY_RULES.map((rule, idx) => {
                const isChecked = !!rulesChecked[rule.id];
                const IconComponent = rule.icon;

                return (
                  <div
                    key={rule.id}
                    onClick={() => handleToggleRule(rule.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 select-none ${
                      isChecked
                        ? 'bg-teal-950/20 border-teal-500/50 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/60'
                    }`}
                  >
                    <div className="pt-0.5 flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isChecked
                            ? 'bg-teal-500 border-teal-500 text-slate-950'
                            : 'border-slate-600 bg-slate-900 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`w-4 h-4 ${isChecked ? 'text-teal-400' : 'text-slate-400'}`} />
                        <h4 className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                          {idx + 1}. {rule.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs">
              <span className={`font-mono font-bold ${allChecked ? 'text-emerald-400' : 'text-amber-400'}`}>
                {checkedCount} / {DISCIPLINARY_RULES.length}
              </span>
              <span className="text-slate-400">Rules Acknowledged</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/student/my-courses')}
                className="w-1/2 sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition border border-slate-700"
              >
                Back to Courses
              </button>

              <button
                type="button"
                disabled={!allChecked || isStartingTest}
                onClick={handleStartExam}
                className={`w-1/2 sm:w-auto px-6 py-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-2 shadow-lg ${
                  allChecked && !isStartingTest
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-teal-500/20 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                }`}
              >
                {isStartingTest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Initiating Test Session...</span>
                  </>
                ) : allChecked ? (
                  <>
                    <span>Start Test & Proceed to Questions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Start Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tab-switch Proctoring Violation Screen
  if (isTabViolationTerminated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-white">
        <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-inner">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">Exam Terminated: Tab Switch Violation</h2>
            <p className="text-xs text-rose-300 font-semibold leading-relaxed">
              You switched away from the examination tab. As per institutional examination regulations, tab switching is strictly prohibited.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your examination session has been immediately terminated, answers saved up to this point have been submitted for scoring, and you are being logged out of the test arena.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/50 text-xs space-y-1">
            <span className="text-slate-400 font-semibold block">Logging out from examination in</span>
            <span className="text-2xl font-mono font-black text-rose-400 block">{tabViolationSeconds} seconds</span>
          </div>

          <button
            onClick={() => navigate('/student/total-courses')}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/40"
          >
            <span>Exit Examination Now</span>
          </button>
        </div>
      </div>
    );
  }

  // Timer formatting
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = remainingSeconds < 600; // < 10 mins

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Examination Navigation Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {exam?.title}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-teal-500/30">
              Level {exam?.levelNumber}
            </span>
          </div>

          {/* Question Switcher Tabs */}
          <div className="hidden md:flex items-center space-x-1.5 ml-4">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeQuestionIndex === idx
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Problem {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Center/Right: Server Countdown Timer & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          {/* Don't Switch Tab Proctoring Button */}
          <button
            onClick={() => setShowProctorModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition shadow-sm animate-pulse"
            title="Proctoring Active: Tab switching strictly forbidden. Click to view rules."
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Don't Switch Tab</span>
            <span className="sm:hidden">No Tab Switch</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          </button>

          {/* Autosave status indicator */}
          <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] text-slate-400">
            <Save className="w-3.5 h-3.5 text-teal-400" />
            <span>{saveStatus}</span>
          </span>

          {/* Server-Controlled Countdown */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold tracking-wider border shadow-sm ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-teal-400 border-teal-500/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted}</span>
          </div>

          {/* Final Submit Button */}
          <button
            onClick={() => handleFinalSubmit(false)}
            disabled={isFinalizing}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            <span>{isFinalizing ? 'Finalizing...' : 'Finish & Submit Exam'}</span>
          </button>
        </div>
      </header>

      {/* Proctoring Rules Modal */}
      {showProctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Tab-Switch Protection Active</h3>
                <p className="text-xs text-amber-400/80 font-medium">Proctoring Anti-Cheating Protocol</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <span className="text-amber-400 font-bold">1.</span>
                <p>Do NOT switch browser tabs, open other applications, or press Alt+Tab during this test.</p>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-amber-400 font-bold">2.</span>
                <p>Switching tabs will immediately terminate your exam session and log you out of the test.</p>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-amber-400 font-bold">3.</span>
                <p>Only code written before switching tabs will be graded. No additional re-entry is permitted.</p>
              </div>
            </div>

            <button
              onClick={() => setShowProctorModal(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-md"
            >
              I Understand — Return to Test
            </button>
          </div>
        </div>
      )}

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane: Problem Statement, Constraints, Examples */}
        <div className="w-full md:w-5/12 lg:w-4/12 border-r border-slate-800 bg-slate-900/60 flex flex-col overflow-y-auto p-5 space-y-6">
          {currentQuestion ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
                    Question {activeQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {currentQuestion.marks} Marks
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentQuestion.title}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800/80 text-emerald-400 font-medium">
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Problem Description
                </h3>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  {currentQuestion.description}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Input Format
                </h3>
                <div className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap">
                  {currentQuestion.inputFormat}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Output Format
                </h3>
                <div className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap">
                  {currentQuestion.outputFormat}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Constraints
                </h3>
                <div className="text-xs font-mono text-amber-300/90 bg-amber-950/20 p-3 rounded-xl border border-amber-500/20 whitespace-pre-wrap">
                  {currentQuestion.constraints}
                </div>
              </div>

              {/* Examples */}
              {currentQuestion.examples?.map((ex: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sample Test Case {idx + 1}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Standard Input:</span>
                      <pre className="text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-teal-300 overflow-x-auto">
                        {ex.input || '(empty)'}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Expected Output:</span>
                      <pre className="text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto">
                        {ex.output}
                      </pre>
                    </div>
                  </div>
                  {ex.explanation && (
                    <p className="text-xs text-slate-400 italic mt-1">
                      Explanation: {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="text-slate-500 text-sm">Select a question to view statement.</div>
          )}
        </div>

        {/* Right Pane: Monaco Editor & Execution Console */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Header Bar */}
          <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Language:
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-md text-xs font-semibold text-teal-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {currentQuestion?.allowedLanguages?.map((lang: string) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunPublic}
                disabled={isRunning || isSubmitting}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center space-x-1.5 border border-slate-700 transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-teal-400" />
                <span>{isRunning ? 'Running...' : 'Run Public Tests'}</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || isRunning}
                className="px-3.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Answer'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Component */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={
                selectedLanguage === 'cpp'
                  ? 'cpp'
                  : selectedLanguage === 'c'
                  ? 'c'
                  : selectedLanguage === 'python'
                  ? 'python'
                  : selectedLanguage === 'java'
                  ? 'java'
                  : 'javascript'
              }
              value={currentQuestion ? codeMap[currentQuestion.id] || '' : ''}
              onChange={handleCodeChange}
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on'
              }}
            />
          </div>

          {/* Bottom Execution Console / Test Results Panel */}
          <div className="h-56 bg-slate-900 border-t border-slate-800 flex flex-col flex-shrink-0">
            {/* Console Tabs */}
            <div className="h-8 bg-slate-950 border-b border-slate-800 px-3 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveConsoleTab('tests')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-t-md transition ${
                    activeConsoleTab === 'tests'
                      ? 'bg-slate-900 text-teal-400 border-t-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Test Cases & Verdict
                </button>
                <button
                  onClick={() => setActiveConsoleTab('errors')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-t-md transition flex items-center space-x-1.5 ${
                    activeConsoleTab === 'errors'
                      ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-400'
                      : errorLog
                      ? 'text-rose-400 hover:text-rose-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Compiler & Error Logs</span>
                  {errorLog && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setActiveConsoleTab('input')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-t-md transition ${
                    activeConsoleTab === 'input'
                      ? 'bg-slate-900 text-teal-400 border-t-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom Input (stdin)
                </button>
                <button
                  onClick={() => setActiveConsoleTab('output')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-t-md transition ${
                    activeConsoleTab === 'output'
                      ? 'bg-slate-900 text-teal-400 border-t-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Execution Console
                </button>
              </div>

              {latestVerdict && (
                <div className="flex items-center space-x-2 text-xs">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      latestVerdict === 'Accepted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {latestVerdict}
                  </span>
                  {latestScore !== null && (
                    <span className="font-mono text-slate-300">
                      Score: {latestScore}/{currentQuestion?.marks}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Console Content Area */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs">
              {activeConsoleTab === 'tests' && (
                <div className="space-y-2">
                  {errorLog && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span>
                          {latestVerdict === 'Compilation Error' ? 'Compilation failed.' : 'Runtime or syntax error occurred.'}{' '}
                          Check the <strong>Compiler & Error Logs</strong> tab for exact line diagnostics.
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveConsoleTab('errors')}
                        className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold border border-rose-500/40"
                      >
                        View Error Logs
                      </button>
                    </div>
                  )}

                  {testResults.length === 0 ? (
                    <div className="text-slate-500 text-xs py-4 text-center">
                      {errorLog ? (
                        <span>Code could not execute against tests due to compiler or syntax error. Open the <strong>Compiler & Error Logs</strong> tab.</span>
                      ) : (
                        <span>Click <strong>Run Public Tests</strong> to test against example inputs, or <strong>Submit Answer</strong> to evaluate against full benchmark test cases.</span>
                      )}
                    </div>
                  ) : (
                    testResults.map((tc, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border flex flex-col space-y-1.5 ${
                          tc.passed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">
                            {tc.isHidden ? `Hidden Benchmark Test ${idx + 1}` : `Public Test ${idx + 1}`}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              tc.passed ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'
                            }`}
                          >
                            {tc.status} ({tc.executionTimeMs}ms)
                          </span>
                        </div>

                        {!tc.isHidden && (
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-slate-400">Your Output:</span>
                              <pre className="bg-slate-950 p-1.5 rounded mt-0.5 text-slate-200">
                                {tc.actualOutput || '(no output)'}
                              </pre>
                            </div>
                            <div>
                              <span className="text-slate-400">Expected:</span>
                              <pre className="bg-slate-950 p-1.5 rounded mt-0.5 text-slate-200">
                                {tc.expectedOutput}
                              </pre>
                            </div>
                          </div>
                        )}

                        {tc.errorMessage && (
                          <div className="text-rose-400 text-[11px] mt-1 font-sans">
                            {tc.errorMessage}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeConsoleTab === 'errors' && (
                <div className="space-y-3 font-mono">
                  {errorLog ? (
                    <>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {latestVerdict || 'Error Diagnostic'}
                          </span>
                          <span className="text-slate-400 text-xs">
                            Language: <span className="text-teal-300 font-semibold">{selectedLanguage.toUpperCase()}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(errorLog);
                            alert('Compiler logs copied to clipboard.');
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                        >
                          Copy Logs
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950 border border-rose-950/70 shadow-inner overflow-x-auto">
                        <pre className="text-rose-300 whitespace-pre-wrap text-xs leading-relaxed font-mono">
                          {errorLog}
                        </pre>
                      </div>

                      {/* Quick Troubleshooting Guide tailored by language */}
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 font-sans">
                        <div className="text-slate-300 font-semibold flex items-center space-x-1.5">
                          <span>💡 Language Diagnostic Tips:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                          {selectedLanguage === 'c' && (
                            <>
                              <li>Ensure all statements terminate with a semicolon (<code>;</code>).</li>
                              <li>Check standard headers like <code>#include &lt;stdio.h&gt;</code> and <code>#include &lt;stdlib.h&gt;</code>.</li>
                              <li>In <code>scanf</code>, remember the address-of operator <code>&amp;</code> (e.g. <code>scanf(&quot;%d&quot;, &amp;val)</code>).</li>
                            </>
                          )}
                          {selectedLanguage === 'cpp' && (
                            <>
                              <li>Ensure <code>#include &lt;iostream&gt;</code> and <code>using namespace std;</code> are included.</li>
                              <li>Check matching curly brackets <code>&#123; &#125;</code> and parentheses.</li>
                            </>
                          )}
                          {selectedLanguage === 'java' && (
                            <>
                              <li>Java code must define <code>public class Main</code> with <code>public static void main(String[] args)</code>.</li>
                              <li>Remember to import <code>java.util.Scanner;</code> if reading from standard input.</li>
                            </>
                          )}
                          {selectedLanguage === 'python' && (
                            <>
                              <li>Check indentation levels (spaces vs tabs).</li>
                              <li>Cast input strings to numbers if calculating (e.g. <code>int(input())</code>).</li>
                            </>
                          )}
                          {selectedLanguage === 'javascript' && (
                            <>
                              <li>Read stdin synchronously using <code>require(&#39;fs&#39;).readFileSync(0, &#39;utf-8&#39;)</code>.</li>
                              <li>Ensure functions and variables are defined before invocation.</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-500 text-xs py-8 text-center flex flex-col items-center justify-center space-y-2 font-sans">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/60" />
                      <span className="text-slate-300 font-semibold">No Compilation or Runtime Errors</span>
                      <span className="text-[11px] text-slate-500">Your program compiled and ran without compiler errors.</span>
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === 'input' && (
                <div className="h-full flex flex-col font-sans">
                  <span className="text-slate-400 text-[11px] mb-1.5">
                    Custom input passed to stdin when clicking <strong>Run Public Tests</strong>:
                  </span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter standard input values (e.g. 5 10)..."
                    className="flex-1 w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                    rows={5}
                  />
                </div>
              )}

              {activeConsoleTab === 'output' && (
                <div>
                  <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {consoleOutput || 'Standard output stream is empty.'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

