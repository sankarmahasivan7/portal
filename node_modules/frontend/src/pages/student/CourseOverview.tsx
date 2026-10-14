import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Award,
  Sparkles,
  Layers,
  Check,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

interface LevelItem {
  levelNumber: number;
  title: string;
  description: string;
  topics: string[];
  studyNotes: string[];
  videosCount: number;
  attemptsCount: number;
  bestScore?: number;
  isPassed: boolean;
  isEnrolled: boolean;
  isEligible: boolean;
  lockReason?: string;
  isRegisteredForExam: boolean;
}

interface CourseOverviewData {
  language: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    totalLevels: number;
  };
  isCourseEnrolled: boolean;
  completedLevelsCount: number;
  highestUnlockedLevel: number;
  levels: LevelItem[];
}

export const CourseOverview: React.FC = () => {
  const { languageSlug } = useParams<{ languageSlug: string }>();
  const [data, setData] = useState<CourseOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeringLevel, setRegisteringLevel] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/student/course-overview/${languageSlug}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course levels.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [languageSlug]);

  const handleRegisterLevel = async (levelNumber: number) => {
    try {
      setRegisteringLevel(levelNumber);
      setSuccessMsg(null);
      setError(null);
      const res = await api.post(`/student/course/${languageSlug}/register`, { levelNumber });
      if (res.data.success) {
        setSuccessMsg(res.data.message || `Registered for Level ${levelNumber}! It now appears in My Courses.`);
        fetchOverview();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register for course level.');
    } finally {
      setRegisteringLevel(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-medium">Loading course curriculum & levels...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 space-y-4">
          <p className="font-semibold text-base">Error Loading Course</p>
          <p className="text-sm">{error || 'Unable to retrieve course details.'}</p>
          <Link
            to="/student/total-courses"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Total Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  const { language, completedLevelsCount, levels } = data;

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link to="/student/total-courses" className="hover:text-slate-900 transition flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Total Courses</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-teal-700 font-bold">{language.name} Programming</span>
        </div>

        {/* Course Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center font-extrabold text-teal-700 text-2xl uppercase shrink-0 shadow-xs">
              {language.slug.slice(0, 2)}
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>{language.totalLevels} Sequential Levels</span>
                <span>•</span>
                <span>{completedLevelsCount} Completed</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language.name} Programming Track
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
                {language.description ||
                  `Explore all curriculum tiers for ${language.name}. Review topics covered, check your past examination attempts, and register for levels to unlock slot bookings in My Courses.`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            <Link
              to="/student/my-courses"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Go to My Courses</span>
            </Link>
          </div>
        </div>

        {/* Feedback Alert Messages */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <Link
              to="/student/my-courses"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shrink-0 ml-4"
            >
              View in My Courses →
            </Link>
          </div>
        )}

        {/* Levels One by One */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>Course Levels & Topics Covered</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Register a level to book examination slots in My Courses
            </span>
          </div>

          <div className="space-y-5">
            {levels.map((lvl) => {
              const isBusy = registeringLevel === lvl.levelNumber;

              return (
                <div
                  key={lvl.levelNumber}
                  className={`bg-white rounded-2xl border transition shadow-sm overflow-hidden ${
                    lvl.isPassed
                      ? 'border-emerald-200'
                      : lvl.isEnrolled
                      ? 'border-teal-300 ring-2 ring-teal-500/10'
                      : lvl.isEligible
                      ? 'border-slate-200 hover:border-slate-300'
                      : 'border-slate-200 bg-slate-50/60 opacity-80'
                  }`}
                >
                  <div className="p-6 space-y-5">
                    {/* Level Title & Status Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
                          L{lvl.levelNumber}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{lvl.title}</h3>
                          <span className="text-xs text-slate-500">{lvl.description}</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        {lvl.isPassed && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Passed</span>
                          </span>
                        )}

                        {lvl.isEnrolled && !lvl.isPassed && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            <Check className="w-3.5 h-3.5 text-teal-600" />
                            <span>Enrolled in My Courses</span>
                          </span>
                        )}

                        {!lvl.isEnrolled && lvl.isEligible && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Unlock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Ready to Register</span>
                          </span>
                        )}

                        {!lvl.isEligible && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Topics Grid for this Level */}
                    <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Topics Covered in Level {lvl.levelNumber}:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {lvl.topics.map((topic, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                            <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row: Attempts Counter & Action Register Button */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Attempts Metric */}
                      <div className="flex items-center space-x-3 text-xs text-slate-600">
                        <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            Examination Attempts:{' '}
                            <strong className="text-slate-900 font-mono font-bold">
                              {lvl.attemptsCount}
                            </strong>
                          </span>
                        </div>

                        {lvl.bestScore !== undefined && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            Best Score: {lvl.bestScore}%
                          </span>
                        )}
                      </div>

                      {/* Action Area */}
                      <div>
                        {lvl.isPassed ? (
                          <button
                            onClick={() =>
                              navigate(`/student/course/${language.slug}/level/${lvl.levelNumber}`)
                            }
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1.5"
                          >
                            <PlayCircle className="w-4 h-4 text-teal-600" />
                            <span>Review Course Videos</span>
                          </button>
                        ) : lvl.isEnrolled ? (
                          <div className="flex items-center space-x-2">
                            <Link
                              to="/student/my-courses"
                              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                            >
                              <span>Book Slot in My Courses</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() =>
                                navigate(`/student/course/${language.slug}/level/${lvl.levelNumber}`)
                              }
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                            >
                              Videos & Slots
                            </button>
                          </div>
                        ) : lvl.isEligible ? (
                          <button
                            onClick={() => handleRegisterLevel(lvl.levelNumber)}
                            disabled={isBusy}
                            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow flex items-center space-x-2"
                          >
                            {isBusy ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span>Registering...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Register for Level {lvl.levelNumber}</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="text-xs text-slate-400 italic flex items-center space-x-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{lvl.lockReason || `Prerequisite: Complete Level ${lvl.levelNumber - 1}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseOverview;

