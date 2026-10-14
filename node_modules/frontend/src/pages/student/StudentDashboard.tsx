import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  GraduationCap,
  Award,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight,
  Bell
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('c');
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/student/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load student dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleNotificationRead = async (id: string) => {
    try {
      await api.patch(`/student/notifications/${id}/read`);
      fetchDashboard();
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading your candidate profile and curriculum...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <p className="font-semibold text-base mb-2">Error Loading Dashboard</p>
          <p className="text-sm">{error || 'Unable to retrieve dashboard information.'}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { profile, progressByLanguage, registrations, recentResults, notifications } = data;
  const currentLangProgress =
    progressByLanguage?.find((p: any) => p.slug === selectedLanguage) || progressByLanguage?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Notifications Banner if unread */}
      {notifications?.filter((n: any) => !n.isRead).length > 0 && (
        <div className="space-y-2">
          {notifications
            .filter((n: any) => !n.isRead)
            .slice(0, 2)
            .map((notif: any) => (
              <div
                key={notif._id}
                className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between shadow-sm animate-fade-in"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-teal-200">{notif.title}</h4>
                    <p className="text-xs text-slate-300">{notif.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationRead(notif._id)}
                  className="text-xs text-teal-400 hover:text-teal-200 px-3 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 transition"
                >
                  Dismiss
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Candidate Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
              <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Candidate
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {profile.department} • Batch {profile.batch} • Semester {profile.semester}
              </p>
              <div className="flex items-center space-x-3 mt-2 font-mono text-xs text-slate-300">
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  ID: {profile.studentId}
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  Enrollment: {profile.enrollmentNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              to="/student/schedule"
              className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-sm shadow-lg shadow-teal-500/20 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Available Examinations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Language Curriculum & Sequential Level Progression Engine */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-teal-400" />
              <span>Programming Language Progression Paths</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sequential assessment levels. Pass previous level examinations to unlock successive milestones.
            </p>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {progressByLanguage?.map((lang: any) => (
              <button
                key={lang.slug}
                onClick={() => setSelectedLanguage(lang.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedLanguage === lang.slug
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {lang.languageName} ({lang.totalLevels} Levels)
              </button>
            ))}
          </div>
        </div>

        {/* Selected Language Level Cards */}
        {currentLangProgress && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>
                Track: <strong className="text-white">{currentLangProgress.languageName}</strong>
              </span>
              <span>
                Current Unlocked Tier: <strong className="text-teal-400">Level {currentLangProgress.highestUnlockedLevel}</strong> of {currentLangProgress.totalLevels}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentLangProgress.levels.map((lvl: any) => {
                const isPassed = lvl.status === 'Passed';
                const isAvailable = lvl.status === 'Available';
                const isRegistered = lvl.status === 'Registered';
                const isInProgress = lvl.status === 'In progress';
                const isLocked = lvl.status === 'Locked';
                const isFailed = lvl.status === 'Failed';

                return (
                  <div
                    key={lvl.levelNumber}
                    className={`p-5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                      isPassed
                        ? 'bg-emerald-950/20 border-emerald-500/30 shadow-emerald-500/5'
                        : isInProgress
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-amber-500/5'
                        : isRegistered
                        ? 'bg-indigo-950/20 border-indigo-500/40 shadow-indigo-500/5'
                        : isAvailable
                        ? 'bg-slate-950 border-teal-500/40 shadow-teal-500/5'
                        : isFailed
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Level {lvl.levelNumber}
                        </span>

                        {isPassed && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Passed ({lvl.scorePercentage}%)</span>
                          </span>
                        )}

                        {isInProgress && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
                            <Play className="w-3.5 h-3.5" />
                            <span>In Progress</span>
                          </span>
                        )}

                        {isRegistered && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Registered</span>
                          </span>
                        )}

                        {isAvailable && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Available</span>
                          </span>
                        )}

                        {isFailed && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Failed ({lvl.scorePercentage}%)</span>
                          </span>
                        )}

                        {isLocked && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">
                        {currentLangProgress.languageName} Level {lvl.levelNumber} Assessment
                      </h3>

                      <p className="text-xs text-slate-400 mb-4">
                        {isPassed
                          ? `Passed on ${new Date(lvl.passedAt).toLocaleDateString()}. Verified scorecard recorded.`
                          : isLocked
                          ? lvl.lockReason || `Prerequisite: Pass Level ${lvl.levelNumber - 1} to unlock.`
                          : isRegistered
                          ? 'Slot booked. Proceed to take exam when session opens.'
                          : 'Milestone unlocked and ready for examination registration.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 mt-auto">
                      {isPassed && (
                        <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Certification Requirement Met</span>
                        </span>
                      )}

                      {isInProgress && lvl.activeExamId && (
                        <button
                          onClick={() => navigate(`/exam/${lvl.activeExamId}`)}
                          className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume Examination Session</span>
                        </button>
                      )}

                      {isRegistered && lvl.activeExamId && (
                        <button
                          onClick={() => navigate(`/exam/${lvl.activeExamId}`)}
                          className="w-full py-2 px-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Enter Examination Hall</span>
                        </button>
                      )}

                      {isAvailable && (
                        <Link
                          to="/student/schedule"
                          className="w-full py-2 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs flex items-center justify-center space-x-1.5 border border-teal-500/40 transition"
                        >
                          <span>Register Examination Slot</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {isLocked && (
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                          <Lock className="w-3.5 h-3.5" />
                          <span className="italic truncate">{lvl.lockReason || 'Prerequisite locked'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Active Slot Registrations & Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registrations */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Active Examination Registrations</span>
            </h3>
            <Link to="/student/schedule" className="text-xs text-teal-400 hover:underline">
              View Schedule
            </Link>
          </div>

          {registrations?.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No upcoming registered examinations. Register for available level slots.
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg: any) => (
                <div
                  key={reg._id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {reg.examinationId?.title || 'Programming Examination'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {reg.slotId?.slotName || 'Regular Session'}
                    </p>
                    <p className="text-xs text-teal-400 mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        Slot: {new Date(reg.slotId?.startTime).toLocaleString()} -{' '}
                        {new Date(reg.slotId?.endTime).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/exam/${reg.examinationId?._id}`)}
                    className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md flex-shrink-0 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Launch</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Recent Scorecards & Verifications</span>
            </h3>
          </div>

          {recentResults?.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No completed examinations yet. Complete an assessment to see your verified results here.
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.map((res: any) => (
                <div
                  key={res._id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {res.examinationId?.title} (Level {res.levelNumber})
                    </h4>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Verified on {new Date(res.verifiedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-slate-300 font-mono mt-1 block">
                      Score: {res.obtainedMarks} / {res.totalMarks} ({res.percentage}%)
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      res.passed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {res.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

