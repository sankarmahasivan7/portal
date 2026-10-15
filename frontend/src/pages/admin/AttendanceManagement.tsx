import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  CheckCheck,
  Building,
  ArrowLeft,
  Calendar,
  Layers,
  Filter,
  Trash2
} from 'lucide-react';

interface StudentItem {
  registrationId: string;
  student: {
    _id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
    year?: number;
    section?: string;
  };
  course: {
    id: string;
    title: string;
    levelNumber: number;
    languageName: string;
    languageSlug: string;
  };
  slot: {
    id: string;
    slotName: string;
    labName: string;
    timeWindow: string;
    startTime: string;
    endTime: string;
    capacity: number;
  };
  attendanceStatus: 'pending' | 'present' | 'absent';
  markedPresentAt?: string;
  markedBy?: {
    firstName: string;
    lastName: string;
    role: string;
  };
  registeredAt: string;
}

const STANDARD_TIMINGS = [
  '09:15 to 10:15',
  '10:25 to 11:25',
  '11:35 to 12:35',
  '1:30 to 2:30 (13:30 - 14:30)',
  '2:45 to 3:45 (14:45 - 15:45)'
];

const LAB_OPTIONS = ['all', 'Lab 1', 'Lab 2', 'Lab 3'];

export const AttendanceManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTiming = searchParams.get('timing') || '09:15 to 10:15';
  const initialLab = searchParams.get('lab') || 'all';

  const [selectedTiming, setSelectedTiming] = useState<string>(initialTiming);
  const [selectedLab, setSelectedLab] = useState<string>(initialLab);
  const [timeWindows, setTimeWindows] = useState<string[]>(STANDARD_TIMINGS);

  const [students, setStudents] = useState<StudentItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalRegistered: 0,
    presentCount: 0,
    absentCount: 0,
    pendingCount: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'present' | 'absent'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [availableCourses, setAvailableCourses] = useState<{ id: string; name: string }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 1. Fetch attendance sorted & filtered by timing and lab
  const fetchAttendance = async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const res = await api.get('/admin/attendance', {
        params: {
          timeWindow: selectedTiming,
          labName: selectedLab,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }
      });

      if (res.data.success) {
        setStudents(res.data.students || []);
        setSummary(res.data.summary);
        if (res.data.timeWindows && res.data.timeWindows.length > 0) {
          setTimeWindows(res.data.timeWindows);
        }

        // Collect distinct courses present in this slot timing
        const courseMap = new Map<string, string>();
        (res.data.students || []).forEach((item: StudentItem) => {
          if (item.course && item.course.languageName) {
            courseMap.set(item.course.languageName, item.course.languageName);
          }
        });
        const coursesList = Array.from(courseMap.keys()).map((name) => ({ id: name, name }));
        setAvailableCourses(coursesList);
      }
    } catch (err: any) {
      console.error('Failed to fetch attendance roster', err);
    } finally {
      if (!silent) {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setSearchParams({ timing: selectedTiming, lab: selectedLab });
    fetchAttendance();
  }, [selectedTiming, selectedLab, statusFilter]);

  // Auto-refresh poll every 5 seconds for real-time arrivals in the lab
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAttendance(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedTiming, selectedLab, statusFilter]);

  // Mark single student attendance
  const handleMarkAttendance = async (registrationId: string, status: 'present' | 'absent' | 'pending') => {
    try {
      setActionInProgress(registrationId);
      const res = await api.post('/admin/attendance/mark', {
        registrationId,
        status
      });

      if (res.data.success) {
        // Update state locally for instantaneous responsive feedback
        setStudents((prev) =>
          prev.map((s) =>
            s.registrationId === registrationId
              ? {
                  ...s,
                  attendanceStatus: status,
                  markedPresentAt: status === 'present' ? new Date().toISOString() : undefined
                }
              : s
          )
        );
        fetchAttendance(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update attendance status.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Mark all pending as present for the currently viewed slot timing
  const handleMarkAllPresent = async () => {
    const pendingIds = filteredStudents
      .filter((s) => s.attendanceStatus !== 'present')
      .map((s) => s.registrationId);

    if (pendingIds.length === 0) {
      alert('All registered students in this view are already marked Present.');
      return;
    }

    const labLabel = selectedLab === 'all' ? 'All Labs' : selectedLab;
    if (!window.confirm(`Mark all ${pendingIds.length} students as Present for ${selectedTiming} (${labLabel})?`)) {
      return;
    }

    try {
      setIsRefreshing(true);
      const res = await api.post('/admin/attendance/bulk-mark', {
        registrationIds: pendingIds,
        status: 'present'
      });
      if (res.data.success) {
        fetchAttendance(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to bulk update attendance.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Remove absent course from student's My Courses (Admin only authority)
  const handleRemoveAbsentCourse = async (registrationId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove this absent course from ${studentName}'s My Courses? This will allow the student to register for the course level again in Total Courses.`)) {
      return;
    }

    try {
      setActionInProgress(registrationId);
      const res = await api.post('/admin/attendance/remove-absent-course', {
        registrationId
      });

      if (res.data.success) {
        fetchAttendance(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove absent course.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Filter students by search and optional course
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (s.student?.studentId || '').toLowerCase().includes(q) ||
      `${s.student?.firstName || ''} ${s.student?.lastName || ''}`.toLowerCase().includes(q) ||
      (s.student?.email || '').toLowerCase().includes(q) ||
      (s.course?.title || '').toLowerCase().includes(q) ||
      (s.course?.languageName || '').toLowerCase().includes(q);

    const matchesCourse =
      courseFilter === 'all' || s.course?.languageName === courseFilter;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
              <Link to="/admin/exams" className="hover:text-slate-900 transition flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exams</span>
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-bold">Slot Timing Attendance Gate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lab Attendance Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Filtered strictly by <strong>Slot Timings</strong>. Multiple students taking different courses in the same lab timing appear together on this roster.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center space-x-1.5 ${
                autoRefresh
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
              title="Automatically refresh student attendance list every 5 seconds"
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Live Auto-Sync</span>
            </button>

            <button
              onClick={() => fetchAttendance()}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center space-x-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Primary Timing Selector Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Select Examination Slot Timing (Sorted By Timing Window)</span>
              </label>
              <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Active Slot: {selectedTiming}
              </span>
            </div>

            {/* Timing Pills Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {timeWindows.map((tw) => {
                const isSelected = selectedTiming.startsWith(tw.split(' ')[0]);
                return (
                  <button
                    key={tw}
                    onClick={() => setSelectedTiming(tw)}
                    className={`p-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider opacity-80">Window</span>
                    <span className="text-xs sm:text-sm font-extrabold truncate w-full text-center">
                      {tw}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filter: Lab & Optional Course */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Lab Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Assigned Lab:</span>
              </span>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                {LAB_OPTIONS.map((lab) => {
                  const isSelected = selectedLab === lab;
                  return (
                    <button
                      key={lab}
                      onClick={() => setSelectedLab(lab)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lab === 'all' ? 'All Labs' : lab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Course Filter */}
            {availableCourses.length > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600">Course Filter:</span>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Courses in this Timing</option>
                  {availableCourses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Total Registered</span>
              <span className="text-xl font-extrabold text-slate-900">
                {summary.totalRegistered}{' '}
                <span className="text-xs text-slate-400 font-medium">students</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Present (Allowed)</span>
              <span className="text-xl font-extrabold text-emerald-700">{summary.presentCount}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Pending In-Person</span>
              <span className="text-xl font-extrabold text-amber-700">{summary.pendingCount}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Marked Absent</span>
              <span className="text-xl font-extrabold text-rose-700">{summary.absentCount}</span>
            </div>
          </div>
        </div>

        {/* Student Table & Search */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Roll No, Name, or Course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 w-56 sm:w-72"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-1">
                {(['all', 'pending', 'present', 'absent'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      statusFilter === filter
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllPresent}
                disabled={summary.pendingCount === 0 || isRefreshing}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Pending as Present ({summary.pendingCount})</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Registered Course & Level</th>
                  <th className="py-3 px-4">Lab & Timing</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4 text-right">Actions (One-Click)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <span className="font-semibold text-slate-600">No registered students found</span>
                        <span className="text-[11px] text-slate-400">
                          {searchQuery
                            ? 'No students matching your search criteria.'
                            : `No students registered for slot timing ${selectedTiming}${selectedLab !== 'all' ? ` in ${selectedLab}` : ''}.`}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((item) => {
                    const isPending = !item.attendanceStatus || item.attendanceStatus === 'pending';
                    const isPresent = item.attendanceStatus === 'present';
                    const isAbsent = item.attendanceStatus === 'absent';
                    const isUpdating = actionInProgress === item.registrationId;

                    return (
                      <tr
                        key={item.registrationId}
                        className={`transition hover:bg-slate-50/80 ${
                          isPresent ? 'bg-emerald-50/30' : isAbsent ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div>
                            <span>
                              {item.student?.firstName} {item.student?.lastName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal block">
                              {item.student?.email}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                            {item.student?.studentId || 'N/A'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-semibold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            <span>
                              {item.course?.languageName} — Level {item.course?.levelNumber}
                            </span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="font-semibold">{item.slot?.labName || 'Lab'}</div>
                          <div className="text-[11px] text-slate-400">{item.slot?.timeWindow}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {isPresent && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Present (Allowed)</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Pending Verification</span>
                            </span>
                          )}
                          {isAbsent && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Absent</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Mark Present Button */}
                            <button
                              onClick={() => handleMarkAttendance(item.registrationId, 'present')}
                              disabled={isUpdating || isPresent}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                                isPresent
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 opacity-60 cursor-default'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              }`}
                              title="Mark Present (Unlocks Examination for Student)"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            {/* Mark Absent Button */}
                            <button
                              onClick={() => handleMarkAttendance(item.registrationId, 'absent')}
                              disabled={isUpdating || isAbsent}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                                isAbsent
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200 opacity-60 cursor-default'
                                  : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                              title="Mark Absent"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>

                            {/* Remove Absent Course from Student's My Courses (Admin Only) */}
                            {isAbsent && (
                              <button
                                onClick={() =>
                                  handleRemoveAbsentCourse(
                                    item.registrationId,
                                    `${item.student?.firstName || 'Student'} ${item.student?.lastName || ''}`
                                  )
                                }
                                disabled={isUpdating}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                                title="Remove this absent course from student's My Courses so they can register again in Total Courses"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove from My Courses</span>
                              </button>
                            )}

                            {/* Reset Button */}
                            {!isPending && (
                              <button
                                onClick={() => handleMarkAttendance(item.registrationId, 'pending')}
                                disabled={isUpdating}
                                className="px-2 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                title="Reset to Pending"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
