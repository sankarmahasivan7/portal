import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../../api/client';
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
  Maximize2
} from 'lucide-react';

export const ExamArena: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

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

  // Console output & tabs
  const [activeConsoleTab, setActiveConsoleTab] = useState<'tests' | 'input' | 'output'>('tests');
  const [customInput, setCustomInput] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [compileError, setCompileError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [latestVerdict, setLatestVerdict] = useState<string | null>(null);
  const [latestScore, setLatestScore] = useState<number | null>(null);

  // Initialize or resume examination session
  useEffect(() => {
    async function initSession() {
      try {
        setIsInitializing(true);
        // Start or resume session
        const startRes = await api.post(`/exams/${examId}/start-session`);
        const sId = startRes.data.sessionId;

        // Fetch session data (sanitized questions, server deadline, drafts)
        const sessionDataRes = await api.get(`/exams/session/${sId}`);
        const { session: sess, exam: ex, questions: qs } = sessionDataRes.data;

        setSession(sess);
        setExam(ex);
        setQuestions(qs);
        setRemainingSeconds(sess.remainingSeconds);

        const langSlug = ex.languageSlug || 'c';
        setSelectedLanguage(langSlug);

        // Populate code from drafts or templates
        const initialCode: Record<string, string> = {};
        qs.forEach((q: any) => {
          if (sess.drafts && sess.drafts[q.id]) {
            initialCode[q.id] = sess.drafts[q.id].code;
          } else {
            // Default template
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
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to initialize examination session.');
        navigate('/student/dashboard');
      } finally {
        setIsInitializing(false);
      }
    }

    initSession();
  }, [examId]);

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
    setConsoleOutput('');
    setTestResults([]);
    setActiveConsoleTab('tests');

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
        setCompileError(r.compileOutput || null);
        setTestResults(r.testCaseResults || []);
        if (customInput && r.testCaseResults?.[0]) {
          setConsoleOutput(r.testCaseResults[0].actualOutput || '');
          setActiveConsoleTab('output');
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
    setTestResults([]);
    setActiveConsoleTab('tests');

    try {
      const res = await api.post(`/exams/session/${session.id}/submit`, {
        questionId: currentQuestion.id,
        language: selectedLanguage,
        code: codeMap[currentQuestion.id]
      });

      if (res.data.success) {
        setLatestVerdict(res.data.verdict);
        setLatestScore(res.data.score);
        setCompileError(res.data.compileOutput || null);
        setTestResults(res.data.testCaseResults || []);
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

      const res = await api.post(`/exams/session/${session.id}/finalize`);
      if (res.data.success) {
        navigate(`/exam/result/${session.id}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error finalizing examination.');
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
        <div className="flex items-center space-x-3 sm:space-x-4">
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
              {compileError && (
                <div className="p-3 mb-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 whitespace-pre-wrap">
                  <span className="font-bold block mb-1">Compilation Error:</span>
                  {compileError}
                </div>
              )}

              {activeConsoleTab === 'tests' && (
                <div className="space-y-2">
                  {testResults.length === 0 ? (
                    <div className="text-slate-500 text-xs py-4 text-center">
                      Click <strong>Run Public Tests</strong> to test against example inputs, or <strong>Submit Answer</strong> to evaluate against full benchmark test cases.
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

              {activeConsoleTab === 'input' && (
                <div className="h-full flex flex-col">
                  <span className="text-slate-500 text-[11px] mb-1 font-sans">
                    Custom input passed to stdin when running code:
                  </span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter standard input values..."
                    className="flex-1 w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>
              )}

              {activeConsoleTab === 'output' && (
                <div>
                  <pre className="text-slate-300 whitespace-pre-wrap">
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

