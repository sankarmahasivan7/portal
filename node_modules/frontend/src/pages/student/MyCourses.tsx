import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  Unlock,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface RegisteredSlot {
  slotId: string;
  slotNumber: number;
  timeWindow: string;
  labName: string;
  capacity: number;
  startTime: string;
  endTime: string;
}

interface RegisteredExam {
  registrationId: string;
  examId: string;
  examTitle: string;
  languageId: string;
  languageName: string;
  levelNumber: number;
  examDate: string;
  durationMinutes: number;
  status: string;
  slot: RegisteredSlot | null;
}

interface LevelInfo {
  levelNumber: number;
  status: 'Locked' | 'Available' | 'Registered' | 'In progress' | 'Submitted' | 'Passed' | 'Failed';
  lockReason?: string;
  passedAt?: string;
  scorePercentage?: number;
  activeExamId?: string;
  activeSlotId?: string;
}

interface CourseProgression {
  languageId: string;
  languageName: string;
  slug: string;
  totalLevels: number;
  completedLevels: number;
  registeredLevels: number;
  highestUnlockedLevel: number;
  levels: LevelInfo[];
}

export const MyCourses: React.FC = () => {
  const [currentlyRegisteredCount, setCurrentlyRegisteredCount] = useState(0);
  const [registeredExams, setRegisteredExams] = useState<RegisteredExam[]>([]);
  const [courses, setCourses] = useState<CourseProgression[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/student/my-courses');
        if (res.data.success) {
          setCurrentlyRegisteredCount(res.data.currentlyRegisteredCount);
          setRegisteredExams(res.data.registeredExams);
          setCourses(res.data.courses);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load enrolled courses.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-medium">Loading your enrolled courses & exam bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
          <p className="font-semibold text-base mb-2">Error Loading My Courses</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Registration Status Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student Learning & Assessment Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Courses
            </h1>
            <p className="text-slate-500 mt-1 max-w-2xl text-sm sm:text-base">
              Manage your active learning tracks. Click on any course level (e.g. C Level 1) to watch lectures and select your examination slot.
            </p>
          </div>

          {/* Currently Registered Highlight Badge */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow">
              {currentlyRegisteredCount}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Examination Status
              </div>
              <div className="text-sm font-semibold text-slate-900">
                Currently Registered for{' '}
                <span className="text-teal-700 font-bold">
                  {currentlyRegisteredCount} {currentlyRegisteredCount === 1 ? 'Course Exam' : 'Course Exams'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Active Exam Registrations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Currently Registered Examination Slots</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {registeredExams.length} active
              </span>
            </h2>
            <Link
              to="/student/total-courses"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>Explore All Courses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {registeredExams.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Current Exam Registrations</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                You are not registered for any upcoming examination. Select one of your unlocked course levels below to watch course videos and pick your preferred time slot!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {registeredExams.map((reg) => (
                <div
                  key={reg.registrationId}
                  className="bg-white rounded-2xl border border-teal-200 shadow-sm p-6 space-y-4 hover:shadow-md transition relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-teal-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Confirmed Slot
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                      {reg.languageName} • Level {reg.levelNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{reg.examTitle}</h3>
                  </div>

                  {/* Slot Details Banner */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <div className="text-slate-400 font-medium">Allocated Time</div>
                        <div className="font-bold text-slate-800">
                          {reg.slot?.timeWindow || 'Standard Collegiate Window'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-slate-400 font-medium">Assigned Lab</div>
                        <div className="font-bold text-slate-800">
                          {reg.slot?.labName || 'Standard Lab'} (30 Seats)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/student/course/${reg.languageName.toLowerCase().replace(/[^a-z]/g, '')}/level/${reg.levelNumber}`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center space-x-1.5"
                    >
                      <PlayCircle className="w-4 h-4 text-teal-600" />
                      <span>Watch Course Videos</span>
                    </button>

                    <Link
                      to={`/exam/${reg.examId}`}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <span>Enter Exam Arena</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Enrolled Courses & Levels */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>My Course Progression & Levels</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Click on any level (e.g. C Level 1) to access comprehensive video lectures and book your preferred examination slot.
              </p>
            </div>

            <Link
              to="/student/total-courses"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition shadow-sm flex items-center space-x-1.5"
            >
              <span>View Total Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {courses.map((course) => (
              <div
                key={course.languageId}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Course Bar */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-extrabold text-teal-700 text-base uppercase">
                      {course.slug.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{course.languageName}</h3>
                      <div className="text-xs text-slate-500 flex items-center space-x-3 mt-0.5">
                        <span>Total Levels: <strong>{course.totalLevels}</strong></span>
                        <span>•</span>
                        <span>Completed: <strong className="text-emerald-600">{course.completedLevels}</strong></span>
                        <span>•</span>
                        <span>Highest Unlocked: <strong className="text-teal-700">Level {course.highestUnlockedLevel}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Progress: {Math.round((course.completedLevels / course.totalLevels) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Levels Grid */}
                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.levels.map((lvl) => {
                      const isPassed = lvl.status === 'Passed';
                      const isRegistered = lvl.status === 'Registered';
                      const isAvailable = lvl.status === 'Available';
                      const isLocked = lvl.status === 'Locked';

                      return (
                        <div
                          key={lvl.levelNumber}
                          onClick={() =>
                            navigate(`/student/course/${course.slug}/level/${lvl.levelNumber}`)
                          }
                          className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                            isPassed
                              ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 hover:shadow-sm'
                              : isRegistered
                              ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300 hover:shadow-sm'
                              : isAvailable
                              ? 'bg-teal-50/40 border-teal-200 hover:border-teal-300 hover:shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {course.languageName}
                              </span>
                              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                                Level {lvl.levelNumber}
                              </h4>
                            </div>

                            {/* Badge */}
                            {isPassed && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Passed</span>
                              </span>
                            )}
                            {isRegistered && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Registered</span>
                              </span>
                            )}
                            {isAvailable && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Eligible</span>
                              </span>
                            )}
                            {isLocked && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-600 border border-slate-300">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Locked</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2">
                            {isPassed
                              ? `Completed successfully with ${lvl.scorePercentage || 100}%. Certificate eligible.`
                              : isRegistered
                              ? 'Slot booked! Click to view lecture notes or enter the assessment room.'
                              : isAvailable
                              ? 'Ready for assessment. Watch preparatory video tutorials and select your preferred slot.'
                              : lvl.lockReason || `Prerequisite: Complete Level ${lvl.levelNumber - 1} first.`}
                          </p>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                            <span className="flex items-center space-x-1">
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Course Videos & Register</span>
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyCourses;

