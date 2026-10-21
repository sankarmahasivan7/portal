import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  BookOpen,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart2,
  FileText
} from 'lucide-react';

interface PreviousMarks {
  hasResult: boolean;
  obtainedMarks: number | null;
  totalMarks: number;
  percentage: number | null;
  passed: boolean | null;
  sessionId: string | null;
  evaluatedAt: string | null;
}

interface SlotBookingHistoryItem {
  registrationId: string;
  examId: string | null;
  examTitle: string;
  languageId: string | null;
  languageName: string;
  languageSlug?: string;
  levelNumber: number;
  slotTiming: string;
  labName: string;
  examDate?: string;
  registeredAt: string;
  status: string;
  attendanceStatus: 'present' | 'absent' | 'pending';
  markedPresentAt?: string;
  sessionStatus?: string | null;
  previousMarks: PreviousMarks;
}

interface HistorySummary {
  totalBookings: number;
  completedAssessments: number;
  passedAssessments: number;
  highestScore: number | null;
  averageScore: number | null;
}

export const SlotHistory: React.FC = () => {
  const [history, setHistory] = useState<SlotBookingHistoryItem[]>([]);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed' | 'upcoming' | 'absent'>('all');

  const fetchHistory = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const res = await api.get('/student/slot-history');
      if (res.data.success) {
        const rawHistory: SlotBookingHistoryItem[] = res.data.slotHistory || [];
        const seenKeys = new Set<string>();
        const deduplicated = rawHistory.filter((item) => {
          const key = `${item.examId || item.languageName}_${item.levelNumber}_${item.slotTiming}_${item.labName}_${item.examDate ? new Date(item.examDate).toISOString().split('T')[0] : ''}`;
          if (seenKeys.has(key)) return false;
          seenKeys.add(key);
          return true;
        });
        setHistory(deduplicated);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve slot booking history.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filtered and searched slot bookings
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.languageName.toLowerCase().includes(q) ||
        `level ${item.levelNumber}`.includes(q) ||
        item.labName.toLowerCase().includes(q) ||
        item.slotTiming.toLowerCase().includes(q) ||
        item.examTitle.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // Status filter
      if (statusFilter === 'all') return true;
      if (statusFilter === 'passed') {
        return item.previousMarks?.hasResult && item.previousMarks.passed === true;
      }
      if (statusFilter === 'failed') {
        return item.previousMarks?.hasResult && item.previousMarks.passed === false;
      }
      if (statusFilter === 'absent') {
        return item.attendanceStatus === 'absent';
      }
      if (statusFilter === 'upcoming') {
        return !item.previousMarks?.hasResult && item.attendanceStatus !== 'absent';
      }
      return true;
    });
  }, [history, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-medium">Loading your slot booking history & previous marks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link to="/student/my-courses" className="hover:text-slate-900 transition flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Courses</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-teal-700 font-bold">Slot Booking History</span>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Assessment Records & Performance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Slot Booking History
            </h1>
            <p className="text-slate-500 max-w-2xl text-sm sm:text-base leading-relaxed">
              Complete history of your booked examination slots, assigned laboratories, slot timings, and previous examination marks.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => fetchHistory(true)}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition shadow-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Records'}</span>
            </button>
            <Link
              to="/student/my-courses"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-xs flex items-center space-x-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>My Active Courses</span>
            </Link>
          </div>
        </div>

        {/* Summary Metric Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Bookings */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Total Bookings
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {summary.totalBookings}
                </span>
              </div>
            </div>

            {/* Completed Assessments */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Assessed Slots
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {summary.completedAssessments}
                </span>
              </div>
            </div>

            {/* Passed Assessments */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Passed Tests
                </span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  {summary.passedAssessments}
                </span>
              </div>
            </div>

            {/* Highest Marks */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Top Marks Score
                </span>
                <span className="text-2xl font-extrabold text-amber-600">
                  {summary.highestScore !== null ? `${summary.highestScore} / 100` : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={() => fetchHistory()}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by course name, level, lab name, or slot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Bookings ({history.length})
            </button>
            <button
              onClick={() => setStatusFilter('passed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === 'passed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Passed ({history.filter((h) => h.previousMarks?.hasResult && h.previousMarks.passed).length})
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              Upcoming / Pending
            </button>
            <button
              onClick={() => setStatusFilter('absent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === 'absent'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              Absent ({history.filter((h) => h.attendanceStatus === 'absent').length})
            </button>
          </div>
        </div>

        {/* History Table / Card List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No slot booking records found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all'
                  ? 'No bookings match your current search or status filter criteria.'
                  : 'You have not registered for any examination slots yet. Explore available courses to enroll and book slots.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/student/total-courses"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explore Total Courses</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing {filteredHistory.length} of {history.length} Slot Bookings
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredHistory.map((item) => {
                const marks = item.previousMarks;
                const hasMarks = marks && marks.hasResult && marks.obtainedMarks !== null;

                return (
                  <div
                    key={item.registrationId}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all p-5 sm:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Course, Level, and Timing Info */}
                      <div className="space-y-3 flex-1 min-w-0">
                        {/* Course Name & Level Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-tight">
                            {item.languageName}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                            Level {item.levelNumber}
                          </span>
                          {/* Attendance Status Badge */}
                          {item.attendanceStatus === 'present' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified Present</span>
                            </span>
                          ) : item.attendanceStatus === 'absent' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Marked Absent</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Pending in Lab</span>
                            </span>
                          )}
                        </div>

                        {/* Exam Title */}
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                          {item.examTitle}
                        </h3>

                        {/* Slot Timing & Assigned Lab Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          {/* Slot Timing */}
                          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-teal-50/70 border border-teal-100">
                            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                                Slot Timing
                              </span>
                              <span className="text-xs font-extrabold text-slate-900 truncate block">
                                {item.slotTiming}
                              </span>
                            </div>
                          </div>

                          {/* Assigned Lab */}
                          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Assigned Lab
                              </span>
                              <span className="text-xs font-bold text-slate-800 truncate block">
                                {item.labName}
                              </span>
                            </div>
                          </div>

                          {/* Registered / Exam Date */}
                          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Booking Date
                              </span>
                              <span className="text-xs font-semibold text-slate-700 truncate block">
                                {new Date(item.examDate || item.registeredAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Previous Marks & Performance Box */}
                      <div className="lg:w-72 p-4 rounded-xl border bg-slate-50/90 flex flex-col justify-center space-y-3 shrink-0">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                            <Award className="w-3.5 h-3.5 text-teal-600" />
                            <span>Previous Marks</span>
                          </span>

                          {hasMarks ? (
                            marks.passed ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                PASSED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                                FAILED
                              </span>
                            )
                          ) : item.attendanceStatus === 'absent' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                              ABSENT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                              PENDING
                            </span>
                          )}
                        </div>

                        {/* Marks Display */}
                        {hasMarks ? (
                          <div className="space-y-2">
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-black text-slate-900">
                                {marks.obtainedMarks}
                                <span className="text-sm font-semibold text-slate-500"> / {marks.totalMarks || 100}</span>
                              </span>
                              <span className="text-xs font-bold text-teal-700">
                                {marks.percentage}% Score
                              </span>
                            </div>

                            {/* Score progress bar */}
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  marks.passed ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(0, marks.percentage || 0))}%` }}
                              />
                            </div>
                          </div>
                        ) : item.attendanceStatus === 'absent' ? (
                          <div className="text-xs text-rose-700 font-medium py-1">
                            Student marked absent by faculty in lab. Marks scored: <strong>0 / 100</strong>.
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 font-medium py-1 flex items-center space-x-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Assessment not yet completed or evaluated.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

