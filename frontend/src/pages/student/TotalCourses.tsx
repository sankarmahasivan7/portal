import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { ChevronRight } from 'lucide-react';

interface LevelInfo {
  levelNumber: number;
  status: 'Locked' | 'Available' | 'Registered' | 'In progress' | 'Submitted' | 'Passed' | 'Failed';
  lockReason?: string;
  passedAt?: string;
  scorePercentage?: number;
}

interface CourseItem {
  languageId: string;
  languageName: string;
  slug: string;
  totalLevels: number;
  completedLevels: number;
  isEnrolled: boolean;
  enrolledLevels: number[];
  highestUnlockedLevel: number;
  levels: LevelInfo[];
}

export const TotalCourses: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/student/total-courses');
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load courses.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-medium">Loading total courses & curriculum...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
          <p className="font-semibold text-base mb-2">Error Loading Courses</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Courses Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Total Courses
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Click any course to view levels, topics, and register for courses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const completionPercent = Math.round((course.completedLevels / course.totalLevels) * 100);

              return (
                <div
                  key={course.languageId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/student/course-overview/${course.slug}`)}
                >
                  <div className="p-6 space-y-5">
                    {/* Course Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-xl uppercase group-hover:scale-105 transition-transform shadow-xs">
                          {course.slug.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-600 transition">
                              {course.languageName}
                            </h3>
                            {course.isEnrolled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                Enrolled
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {course.totalLevels} levels • Click to view topics & register
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          {course.completedLevels} / {course.totalLevels} Completed
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>Course Completion</span>
                        <span className="font-bold text-slate-900">{completionPercent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, completionPercent)}%` }}
                        />
                      </div>
                    </div>

                    {/* Levels Preview Chips */}
                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Curriculum Levels ({course.totalLevels})
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {course.levels.map((lvl) => {
                          const isPassed = lvl.status === 'Passed';
                          const isRegistered = lvl.status === 'Registered';
                          const isAvailable = lvl.status === 'Available';

                          return (
                            <div
                              key={lvl.levelNumber}
                              className={`p-2 rounded-xl border text-center text-xs font-bold transition flex items-center justify-center space-x-1 ${
                                isPassed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isRegistered
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : isAvailable
                                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>Level {lvl.levelNumber}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Clear action to open Course Overview */}
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">
                      View all levels, topics & register
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/course-overview/${course.slug}`);
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                    >
                      <span>Explore Levels & Register</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
export default TotalCourses;
