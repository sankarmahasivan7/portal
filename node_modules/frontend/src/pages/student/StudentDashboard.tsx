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
  Bell,
  Layers
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
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-medium">Loading your candidate profile and curriculum...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
          <p className="font-semibold text-base mb-2">Error Loading Dashboard</p>
          <p className="text-sm">{error || 'Unable to retrieve dashboard information.'}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition"
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
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Notifications Banner if unread */}
        {notifications?.filter((n: any) => !n.isRead).length > 0 && (
          <div className="space-y-2">
            {notifications
              .filter((n: any) => !n.isRead)
              .slice(0, 2)
              .map((notif: any) => (
                <div
                  key={notif._id}
                  className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-teal-900">{notif.title}</h4>
                      <p className="text-xs text-slate-600">{notif.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationRead(notif._id)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 px-3 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 transition"
                  >
                    Dismiss
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Candidate Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-xs">
              <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                  Candidate
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {profile.department} • Batch {profile.batch} • Semester {profile.semester}
              </p>
              <div className="flex items-center space-x-3 mt-2 font-mono text-xs text-slate-600">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ID: {profile.studentId}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Enrollment: {profile.enrollmentNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              to="/student/total-courses"
              className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition"
            >
              <Layers className="w-4 h-4" />
              <span>View Total Courses</span>
            </Link>

            <Link
              to="/student/my-courses"
              className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs shadow-xs transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>My Enrolled Courses</span>
            </Link>
          </div>
        </div>

        {/* Language Curriculum & Sequential Level Progression Engine */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <Award className="w-5 h-5 text-teal-600" />
                <span>Programming Language Progression Paths</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sequential assessment levels. Pass previous level examinations to unlock successive milestones.
              </p>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
              {progressByLanguage?.map((lang: any) => (
                <button
                  key={lang.slug}
                  onClick={() => setSelectedLanguage(lang.slug)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    selectedLanguage === lang.slug
                      ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
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
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>
                  Track: <strong className="text-slate-900">{currentLangProgress.languageName}</strong>
                </span>
                <span>
                  Current Unlocked Tier: <strong className="text-teal-700">Level {currentLangProgress.highestUnlockedLevel}</strong> of {currentLangProgress.totalLevels}
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
                      onClick={() =>
                        navigate(`/student/course/${currentLangProgress.slug}/level/${lvl.levelNumber}`)
                      }
                      className={`p-5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-md ${
                        isPassed
                          ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                          : isInProgress
                          ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                          : isRegistered
                          ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                          : isAvailable
                          ? 'bg-teal-50/40 border-teal-200 hover:border-teal-300'
                          : isFailed
                          ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                            Level {lvl.levelNumber}
                          </span>

                          {isPassed && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Passed ({lvl.scorePercentage}%)</span>
                            </span>
                          )}

                          {isInProgress && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                              <Play className="w-3.5 h-3.5" />
                              <span>In Progress</span>
                            </span>
                          )}

                          {isRegistered && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Registered</span>
                            </span>
                          )}

                          {isAvailable && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Available</span>
                            </span>
                          )}

                          {isFailed && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Failed ({lvl.scorePercentage}%)</span>
                            </span>
                          )}

                          {isLocked && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-600 border border-slate-300">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition mb-1">
                          {currentLangProgress.languageName} Level {lvl.levelNumber}
                        </h3>

                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                          {isPassed
                            ? `Passed on ${new Date(lvl.passedAt).toLocaleDateString()}. Certificate eligible.`
                            : isLocked
                            ? lvl.lockReason || `Prerequisite: Pass Level ${lvl.levelNumber - 1} to unlock.`
                            : isRegistered
                            ? 'Slot booked. Click to view course videos or launch arena.'
                            : 'Unlocked and ready! Click to watch videos and select your preferred slot.'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 mt-auto flex items-center justify-between text-xs font-semibold text-teal-700">
                        <span>Course Videos & Slots</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Active Examination Registrations</span>
              </h3>
              <Link to="/student/schedule" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                View Timetable
              </Link>
            </div>

            {registrations?.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No upcoming registered examinations. Register for available level slots.
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg: any) => (
                  <div
                    key={reg._id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {reg.examinationId?.title || 'Programming Examination'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {reg.slotId?.slotName || 'Regular Session'}
                      </p>
                      <p className="text-xs text-teal-700 font-semibold mt-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          Slot: {new Date(reg.slotId?.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/exam/${reg.examinationId?._id}`)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Recent Scorecards & Verifications</span>
              </h3>
            </div>

            {recentResults?.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No completed examinations yet. Complete an assessment to see your verified results here.
              </div>
            ) : (
              <div className="space-y-3">
                {recentResults.map((res: any) => (
                  <div
                    key={res._id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {res.examinationId?.title} (Level {res.levelNumber})
                      </h4>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Verified on {new Date(res.verifiedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-700 font-mono mt-1 block">
                        Score: {res.obtainedMarks} / {res.totalMarks} ({res.percentage}%)
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        res.passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
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
    </div>
  );
};
export default StudentDashboard;
