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
  AlertCircle,
  XCircle
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
  attendanceStatus?: 'pending' | 'present' | 'absent';
  markedPresentAt?: string;
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
          <span className="text-slate-500 text-sm font-medium">Loading your registered courses & exam bookings...</span>
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
              <span>Registered Courses & Slot Bookings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Courses
            </h1>
            <p className="text-slate-500 mt-1 max-w-2xl text-sm sm:text-base">
              Manage your registered course levels. Click any registered level to watch preparatory videos, select an examination slot, and take the assessment.
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
                  {currentlyRegisteredCount} {currentlyRegisteredCount === 1 ? 'Exam Slot' : 'Exam Slots'}
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
          </div>

          {registeredExams.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Current Exam Registrations</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                You do not have any active exam slot bookings. Click on one of your registered levels below to select a time slot and take your test!
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

                  {/* Attendance Gate Status */}
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium">Attendance Gate:</span>
                    {reg.attendanceStatus === 'present' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Present (Ready)</span>
                      </span>
                    ) : reg.attendanceStatus === 'absent' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Marked Absent</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Lab Verification</span>
                      </span>
                    )}
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
                      className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center space-x-1.5 shadow-xs ${
                        reg.attendanceStatus === 'present'
                          ? 'bg-teal-600 hover:bg-teal-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>
                        {reg.attendanceStatus === 'present' ? 'Start Test' : 'Enter Gate'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Registered Courses & Levels */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>My Registered Courses & Levels</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Click any registered level to view video lectures and select your examination slot.
              </p>
            </div>

            <Link
              to="/student/total-courses"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition shadow-sm flex items-center space-x-1.5"
            >
              <span>Explore Total Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {courses.length === 0 ? (
            /* Empty state when student hasn't registered for any course yet */
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 mx-auto flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">No Courses Registered Yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  To view and take assessments, browse the curriculum tracks in <strong>Total Courses</strong>, view topics and attempts for each level, and click <strong>Register</strong>!
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/student/total-courses"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  <span>Browse Total Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => (
                <div
                  key={course.languageId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Course Header Bar */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-extrabold text-teal-700 text-base uppercase">
                        {course.slug.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{course.languageName}</h3>
                        <div className="text-xs text-slate-500 flex items-center space-x-3 mt-0.5">
                          <span>Registered Levels: <strong className="text-teal-700">{course.levels.length}</strong></span>
                          <span>•</span>
                          <span>Completed: <strong className="text-emerald-600">{course.completedLevels}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/student/course-overview/${course.slug}`}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
                      >
                        <span>View All Topics & Attempts</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Registered Levels Grid */}
                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {course.levels.map((lvl) => {
                        const isPassed = lvl.status === 'Passed';
                        const isRegistered = lvl.status === 'Registered';

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
                                : 'bg-teal-50/40 border-teal-200 hover:border-teal-300 hover:shadow-sm'
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
                                  <span>Slot Booked</span>
                                </span>
                              )}
                              {!isPassed && !isRegistered && (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Registered</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2">
                              {isPassed
                                ? `Completed successfully with ${lvl.scorePercentage || 100}%. Certificate eligible.`
                                : isRegistered
                                ? 'Slot booked! Click to view lecture notes or enter the assessment room.'
                                : 'Registered level! Click to watch course videos and select your preferred examination slot.'}
                            </p>

                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                              <span className="flex items-center space-x-1">
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Watch Videos & Book Exam Slot</span>
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
          )}
        </div>
      </div>
    </div>
  );
};
export default MyCourses;
