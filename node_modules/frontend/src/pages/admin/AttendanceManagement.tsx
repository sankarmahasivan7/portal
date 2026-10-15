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
  Filter,
  CheckCheck,
  Building,
  GraduationCap,
  Calendar,
  AlertCircle,
  ArrowLeft
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
  attendanceStatus: 'pending' | 'present' | 'absent';
  markedPresentAt?: string;
  markedBy?: {
    firstName: string;
    lastName: string;
    role: string;
  };
  registeredAt: string;
}

export const AttendanceManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialExamId = searchParams.get('examId') || '';
  const initialSlotId = searchParams.get('slotId') || '';

  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlotId);
  const [slotData, setSlotData] = useState<any | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalRegistered: 0,
    presentCount: 0,
    absentCount: 0,
    pendingCount: 0,
    capacity: 30
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'present' | 'absent'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 1. Fetch all exams for dropdown
  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await api.get('/admin/exams');
        if (res.data.success) {
          setExams(res.data.exams);
          // Default to first published exam or first exam if none selected
          if (!selectedExamId && res.data.exams.length > 0) {
            const pub = res.data.exams.find((e: any) => e.isPublished) || res.data.exams[0];
            setSelectedExamId(pub._id);
            if (pub.slots && pub.slots.length > 0 && !selectedSlotId) {
              setSelectedSlotId(pub.slots[0]._id);
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to load exams', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExams();
  }, []);

  // When selected exam changes, update slots or default slot
  useEffect(() => {
    if (!selectedExamId || exams.length === 0) return;
    const currentExam = exams.find((e) => e._id === selectedExamId);
    if (currentExam && currentExam.slots && currentExam.slots.length > 0) {
      // If current slot isn't in this exam, pick first slot
      const hasSlot = currentExam.slots.some((s: any) => s._id === selectedSlotId);
      if (!hasSlot) {
        setSelectedSlotId(currentExam.slots[0]._id);
      }
    }
  }, [selectedExamId, exams]);

  // 2. Fetch slot attendance data
  const fetchAttendance = async (silent = false) => {
    if (!selectedExamId || !selectedSlotId) return;
    try {
      if (!silent) setIsRefreshing(true);
      const res = await api.get(`/admin/exams/${selectedExamId}/slots/${selectedSlotId}/attendance`);
      if (res.data.success) {
        setSlotData(res.data.slot);
        setStudents(res.data.students || []);
        setSummary(res.data.summary);
      }
    } catch (err: any) {
      console.error('Failed to fetch slot attendance', err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedExamId && selectedSlotId) {
      setSearchParams({ examId: selectedExamId, slotId: selectedSlotId });
      fetchAttendance();
    }
  }, [selectedExamId, selectedSlotId]);

  // Auto-refresh poll every 5 seconds for real-time arrivals
  useEffect(() => {
    if (!autoRefresh || !selectedExamId || !selectedSlotId) return;
    const interval = setInterval(() => {
      fetchAttendance(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedExamId, selectedSlotId]);

  // Mark single student attendance
  const handleMarkAttendance = async (studentId: string, status: 'present' | 'absent' | 'pending') => {
    try {
      setActionInProgress(studentId);
      const res = await api.post(`/admin/exams/${selectedExamId}/slots/${selectedSlotId}/attendance`, {
        studentId,
        status
      });
      if (res.data.success) {
        // Update local state smoothly
        setStudents((prev) =>
          prev.map((s) =>
            s.student._id === studentId
              ? {
                  ...s,
                  attendanceStatus: status,
                  markedPresentAt: status === 'present' ? new Date().toISOString() : undefined
                }
              : s
          )
        );
        // Refresh summary
        fetchAttendance(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update attendance status.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Mark all pending as present
  const handleMarkAllPresent = async () => {
    const pendingIds = students
      .filter((s) => s.attendanceStatus !== 'present')
      .map((s) => s.student._id);

    if (pendingIds.length === 0) {
      alert('All registered students are already marked Present.');
      return;
    }

    if (!window.confirm(`Mark all ${pendingIds.length} students as Present in ${slotData?.labName || 'this lab'}?`)) {
      return;
    }

    try {
      setIsRefreshing(true);
      const res = await api.post(`/admin/exams/${selectedExamId}/slots/${selectedSlotId}/attendance/bulk`, {
        studentIds: pendingIds,
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

  const selectedExam = exams.find((e) => e._id === selectedExamId);
  const examSlots = selectedExam?.slots || [];

  // Filter students by search and status
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.student.studentId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${s.student.firstName} ${s.student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.student.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : s.attendanceStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
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
              <span className="text-teal-700 font-bold">Hall Invigilation & Attendance Gate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lab Attendance Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Verify student physical arrival in exam labs. Only students marked <strong>Present</strong> are permitted to start the test.
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
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center space-x-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Selection Bar: Select Exam & Slot */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Examination:
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title} (Level {exam.levelNumber} - {exam.languageId?.name || 'General'})
                  </option>
                ))}
              </select>
            </div>

            {/* Slot Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Examination Slot & Lab:
              </label>
              <select
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {examSlots.map((slot: any) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.timeWindow || slot.slotName} — {slot.labName || 'Lab'} ({slot.registeredCount || 0}/{slot.capacity || 30} Students)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Slot Pills */}
          {examSlots.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 font-semibold self-center mr-1">Quick Select:</span>
              {examSlots.map((s: any) => {
                const isSelected = s._id === selectedSlotId;
                return (
                  <button
                    key={s._id}
                    onClick={() => setSelectedSlotId(s._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.timeWindow} ({s.labName})
                  </button>
                );
              })}
            </div>
          )}
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
                {summary.totalRegistered} <span className="text-xs text-slate-400 font-medium">/ {summary.capacity} cap</span>
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

        {/* Student Table & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Roll No or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 w-56 sm:w-64"
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
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Registered At</th>
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
                            ? 'Try clearing your search term.'
                            : 'No students have booked this slot yet.'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((item) => {
                    const isPending = !item.attendanceStatus || item.attendanceStatus === 'pending';
                    const isPresent = item.attendanceStatus === 'present';
                    const isAbsent = item.attendanceStatus === 'absent';
                    const isUpdating = actionInProgress === item.student._id;

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
                              {item.student.firstName} {item.student.lastName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal block">
                              {item.student.email}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                            {item.student.studentId || 'N/A'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {item.student.department || 'Computer Science'}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(item.registeredAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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
                              onClick={() => handleMarkAttendance(item.student._id, 'present')}
                              disabled={isUpdating || isPresent}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                                isPresent
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 opacity-60 cursor-default'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              }`}
                              title="Mark Present (Unlocks Test for Student)"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            {/* Mark Absent Button */}
                            <button
                              onClick={() => handleMarkAttendance(item.student._id, 'absent')}
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

                            {/* Reset Button (only if already marked) */}
                            {!isPending && (
                              <button
                                onClick={() => handleMarkAttendance(item.student._id, 'pending')}
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
