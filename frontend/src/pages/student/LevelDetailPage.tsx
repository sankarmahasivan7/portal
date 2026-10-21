import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Play,
  PlayCircle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  Check,
  XCircle,
  HelpCircle,
  History,
  RotateCcw,
  Award,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { formatSlotDate } from '../../utils/dateUtils';

export function getSlotStartHourAndMinute(
  slot: { timeWindow?: string; startTime?: string | Date } | null | undefined
): { hour: number; minute: number } | null {
  if (!slot) return null;

  // 1. Try parsing timeWindow string
  if (slot.timeWindow) {
    const tw = slot.timeWindow.trim();

    // Check for 24-hour time first, e.g. "(13:30 - 14:30)" or "13:30"
    const match24 = tw.match(/\b(1[2-9]|2[0-3])[:.](\d{2})\b/);
    if (match24) {
      return {
        hour: parseInt(match24[1], 10),
        minute: parseInt(match24[2], 10)
      };
    }

    // Check for standard time e.g. "1:30 to 2:30", "10:25 - 11:25", "09:15 to 10:15", "1:30 PM"
    const match12 = tw.match(/(\d{1,2})[:.](\d{2})(?:\s*(AM|PM))?/i);
    if (match12) {
      let hour = parseInt(match12[1], 10);
      const minute = parseInt(match12[2], 10);
      const meridiem = match12[3]?.toUpperCase();

      if (meridiem === 'PM' && hour < 12) {
        hour += 12;
      } else if (meridiem === 'AM' && hour === 12) {
        hour = 0;
      } else if (!meridiem) {
        // College slot heuristic:
        // Exams occur between 8:00 AM and 6:00 PM.
        // Hours 1 to 6 (1:xx to 6:xx) are PM (13:xx to 18:xx).
        // Hours 7 to 11 are AM (07:xx to 11:xx).
        // Hour 12 is 12:xx PM.
        if (hour >= 1 && hour <= 6) {
          hour += 12;
        }
      }

      return { hour, minute };
    }
  }

  // 2. If timeWindow not matched or empty, try slot.startTime Date
  if (slot.startTime) {
    const start = new Date(slot.startTime);
    if (!isNaN(start.getTime())) {
      return {
        hour: start.getHours(),
        minute: start.getMinutes()
      };
    }
  }

  return null;
}

export function isSlotActiveOrReached(
  slot: { timeWindow?: string; startTime?: string | Date; endTime?: string | Date } | null | undefined,
  now: Date = new Date()
): boolean {
  if (!slot) return false;

  // 1. If slot has a start date, compare calendar day and exact timestamp
  if (slot.startTime) {
    const start = new Date(slot.startTime);
    if (!isNaN(start.getTime())) {
      const nowDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const startDateStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;

      // Future calendar day
      if (startDateStr > nowDateStr) {
        return false;
      }
      // Past calendar day
      if (startDateStr < nowDateStr) {
        return true;
      }
      // Today: check timestamp
      if (startDateStr === nowDateStr) {
        if (now.getTime() >= start.getTime()) {
          return true;
        }
      }
    }
  }

  const startTimes = getSlotStartHourAndMinute(slot);
  if (!startTimes) return false;

  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentSec = now.getSeconds();

  const currentTotalSeconds = currentHour * 3600 + currentMin * 60 + currentSec;
  const slotTotalSeconds = startTimes.hour * 3600 + startTimes.minute * 60;

  // Strictly check if current clock time is at or after slot start time
  return currentTotalSeconds >= slotTotalSeconds;
}

/**
 * Checks whether the slot's 1-hour active duration has concluded/ended.
 */
export function isSlotConcluded(
  slot: { timeWindow?: string; startTime?: string | Date; endTime?: string | Date } | null | undefined,
  now: Date = new Date()
): boolean {
  if (!slot) return false;

  // 1. If slot has explicit endTime
  if (slot.endTime) {
    const end = new Date(slot.endTime);
    if (!isNaN(end.getTime())) {
      const nowDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const endDateStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

      if (endDateStr < nowDateStr) return true;
      if (endDateStr > nowDateStr) return false;
      if (endDateStr === nowDateStr) {
        return now.getTime() >= end.getTime();
      }
    }
  }

  // 2. Parse from startTime (+60 minutes) or parse end from timeWindow
  const startTimes = getSlotStartHourAndMinute(slot);
  if (startTimes) {
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentSec = now.getSeconds();
    const currentTotalSeconds = currentHour * 3600 + currentMin * 60 + currentSec;

    // Slot duration is strictly 1 hour (3600 seconds)
    const slotEndSeconds = (startTimes.hour * 3600 + startTimes.minute * 60) + 3600;
    return currentTotalSeconds >= slotEndSeconds;
  }

  return false;
}

/**
 * Checks whether the current time is strictly within the 1-hour active slot window.
 */
export function isSlotLiveNow(
  slot: { timeWindow?: string; startTime?: string | Date; endTime?: string | Date } | null | undefined,
  now: Date = new Date()
): boolean {
  if (!slot) return false;
  const started = isSlotActiveOrReached(slot, now);
  const concluded = isSlotConcluded(slot, now);
  return started && !concluded;
}


interface CourseVideo {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  description: string;
  topics: string[];
}

export interface SampleMCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SlotHistoryItem {
  registrationId: string;
  examId?: string;
  examTitle: string;
  languageName?: string;
  languageSlug?: string;
  levelNumber: number;
  slotTiming: string;
  labName: string;
  registeredAt: string;
  status: string;
  attendanceStatus: 'pending' | 'present' | 'absent';
  markedPresentAt?: string;
}

interface Curriculum {
  title: string;
  description: string;
  topics: string[];
  studyNotes: string[];
  videos: CourseVideo[];
  sampleMcqs?: SampleMCQ[];
}

interface ExamSlot {
  _id: string;
  slotNumber: number;
  labName: string;
  timeWindow: string;
  capacity: number;
  registeredCount: number;
  seatsRemaining: number;
  startTime: string;
  endTime: string;
}

interface ExaminationData {
  _id: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingPercentage: number;
  examDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  isRegistrationOpen: boolean;
  instructions: string;
  questionsCount: number;
  slots: ExamSlot[];
}

interface LevelDetailResponse {
  language: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    totalLevels: number;
  };
  levelNumber: number;
  curriculum: Curriculum;
  progress: {
    isEligible: boolean;
    lockReason?: string;
    isPassed: boolean;
    scorePercentage?: number;
    isRegistered: boolean;
  };
  registration: {
    registrationId: string;
    attendanceStatus?: 'pending' | 'present' | 'absent';
    markedPresentAt?: string;
    slot: {
      _id: string;
      slotNumber: number;
      labName: string;
      timeWindow: string;
      capacity: number;
      startTime?: string;
      endTime?: string;
    } | null;
  } | null;
  examination: ExaminationData | null;
  slotHistory?: SlotHistoryItem[];
}

export const LevelDetailPage: React.FC = () => {
  const { languageId, levelNumber } = useParams<{ languageId: string; levelNumber: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<LevelDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Real-time ticking interval to detect exact slot start time automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Video Player state
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'topics' | 'notes' | 'guidelines' | 'mcqs'>('topics');

  // Interactive Sample MCQs state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Slot Selection & Registration state
  const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);


  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleResetMcqs = () => {
    setSelectedAnswers({});
  };

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/student/course/${languageId}/level/${levelNumber}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load level details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [languageId, levelNumber]);

  // Auto-poll attendance status every 3 seconds while student is booked and attendance is pending
  useEffect(() => {
    if (!data?.registration || data.registration.attendanceStatus === 'present') return;
    const pollTimer = setInterval(() => {
      api.get(`/student/course/${languageId}/level/${levelNumber}`)
        .then((res) => {
          if (res.data.success) {
            setData(res.data);
          }
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(pollTimer);
  }, [data?.registration?.attendanceStatus, languageId, levelNumber]);

  const handleRegisterSlot = async () => {
    if (!selectedSlotId || !data?.examination) {
      setRegisterError('Please select a specific examination slot from the dropdown.');
      return;
    }

    try {
      setIsSubmitting(true);
      setRegisterError(null);
      const res = await api.post(`/exams/${data.examination._id}/register`, {
        slotId: selectedSlotId
      });

      if (res.data.success) {
        setRegisterSuccess('Successfully registered for your chosen examination slot!');
        fetchDetails(); // Refresh to reflect registered state
      }
    } catch (err: any) {
      setRegisterError(err.response?.data?.message || 'Failed to register for the slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-medium">Loading course videos and examination slots...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 space-y-4">
          <p className="font-semibold text-base">Error Loading Level</p>
          <p className="text-sm">{error || 'Unable to retrieve course data.'}</p>
          <Link
            to="/student/my-courses"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to My Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  const { language, curriculum, progress, registration, examination } = data;
  const hasBookedSlot = Boolean(progress.isRegistered || registration);
  const isSlotLive = Boolean(
    hasBookedSlot &&
    !progress.isPassed &&
    registration?.attendanceStatus !== 'absent' &&
    isSlotLiveNow(registration?.slot, currentTime)
  );

  const isSlotExpired = Boolean(
    hasBookedSlot &&
    !progress.isPassed &&
    (registration?.attendanceStatus === 'absent' || isSlotConcluded(registration?.slot, currentTime))
  );

  // When the actual slot time comes (strictly during the 1-hour window):
  // User Requirement: "look at this the test portal only opens at the period of 1 hour right but the student is absent and he not attend this exam it must show this page exactly after the slot also only faculty can reset this then also the student can reattempt this"
  if (hasBookedSlot && isSlotLive) {
    const studentName = user
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
      : 'Student';
    const isPresent = registration?.attendanceStatus === 'present';
    const isAbsent = registration?.attendanceStatus === 'absent';

    return (
      <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center p-4 sm:p-6 text-slate-800 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-teal-200 shadow-xl p-8 sm:p-10 text-center space-y-6 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

          {/* Pulse Live Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Assessment Window Live</span>
          </div>

          {/* Student Candidate Name */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Candidate Name
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {studentName}
            </h2>
            {user?.studentId && (
              <p className="text-xs font-mono font-semibold text-teal-700">
                {user.studentId}
              </p>
            )}
          </div>

          {/* Level Name & Info */}
          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
              Examination Level
            </span>
            <h3 className="text-lg font-bold text-teal-950">
              {language.name} — Level {levelNumber} Examination
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 pt-1">
              <span>Date: <strong className="text-teal-900 font-bold">{formatSlotDate(registration?.slot?.startTime)}</strong></span>
              <span>•</span>
              <span>Slot: <strong className="text-slate-900">{registration?.slot?.timeWindow}</strong></span>
              <span>•</span>
              <span>Lab: <strong className="text-slate-900">{registration?.slot?.labName || 'Lab 1'}</strong></span>
            </div>
          </div>

          {/* Attendance Verification Gate Status */}
          <div className="space-y-2">
            {isPresent ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1">
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Attendance: Verified Present in Lab</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Your in-person attendance is confirmed. You may now launch the examination.
                </p>
              </div>
            ) : isAbsent ? (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-1">
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Attendance: Marked Absent</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  You were marked absent by staff. Please contact the administrator.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-900 space-y-2.5">
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-amber-900">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span>Attendance: Pending Staff Verification in {registration?.slot?.labName || 'Lab'}</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Please report to your invigilator in <strong>{registration?.slot?.labName || 'Lab'}</strong>. Present your ID to be marked <strong>Present</strong>.
                </p>
                <button
                  type="button"
                  onClick={fetchDetails}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-amber-100/70 text-amber-900 text-xs font-semibold rounded-lg border border-amber-300 transition shadow-xs"
                >
                  <RotateCcw className="w-3 h-3 text-amber-700" />
                  <span>Check Verification Status</span>
                </button>
              </div>
            )}
          </div>

          {/* Launch Test Portal Button (Enabled only if attendance is Present) */}
          <div className="pt-2">
            {isPresent ? (
              <button
                onClick={() => navigate(`/exam/${examination?._id}`)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-base shadow-lg shadow-teal-700/20 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Launch Test Portal</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-1.5">
                <button
                  disabled
                  className="w-full py-4 px-6 rounded-2xl bg-slate-200 text-slate-400 font-bold text-base cursor-not-allowed flex items-center justify-center space-x-2 opacity-60"
                  title="Attendance must be marked Present by lab staff first"
                >
                  <Lock className="w-5 h-5 text-slate-400" />
                  <span>Launch Test Portal</span>
                </button>
                <p className="text-[11px] text-slate-500 font-medium">
                  🔒 Button enables automatically when marked Present by staff
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentVideo = curriculum.videos[activeVideoIndex] || curriculum.videos[0];
  const visibleSlots = examination?.slots.filter((slot) => !isSlotActiveOrReached(slot, currentTime)) || [];
  const selectedSlot = visibleSlots.find((s) => s._id === selectedSlotId);

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link to="/student/my-courses" className="hover:text-slate-900 transition flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Courses</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700">{language.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-teal-700 font-bold">Level {levelNumber}</span>
        </div>

        {/* Level Title Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>{language.name} Course Track</span>
              <span>•</span>
              <span>Tier {levelNumber} of {language.totalLevels}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {curriculum.title}
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl">
              {curriculum.description}
            </p>
          </div>

          {/* Quick status pill */}
          <div className="flex items-center space-x-2">
            {progress.isPassed && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Level Passed ({progress.scorePercentage}%)</span>
              </span>
            )}
            {hasBookedSlot && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Slot Booked</span>
              </span>
            )}
            {!progress.isPassed && !hasBookedSlot && progress.isEligible && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                <Unlock className="w-4 h-4 text-teal-600" />
                <span>Eligible for Assessment</span>
              </span>
            )}
            {!progress.isEligible && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Level Locked</span>
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Course Videos & Educational Lectures (7 / 12 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Video Player Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PlayCircle className="w-5 h-5 text-teal-400" />
                  <span className="text-sm font-bold truncate max-w-md">
                    {currentVideo?.title || 'Course Lecture Video'}
                  </span>
                </div>
                <span className="text-xs bg-slate-800 text-teal-300 px-2.5 py-1 rounded-full font-mono">
                  {currentVideo?.duration}
                </span>
              </div>

              {/* Video Screen Embed */}
              <div className="relative aspect-video w-full bg-slate-950">
                <iframe
                  className="w-full h-full border-0"
                  src={currentVideo?.url}
                  title={currentVideo?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info & Description */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentVideo?.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{currentVideo?.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {currentVideo?.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Playlist Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Play className="w-4 h-4 text-teal-600" />
                  <span>Curriculum Video Lectures ({curriculum.videos.length})</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">Click to watch lecture</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {curriculum.videos.map((vid, idx) => {
                  const isActive = idx === activeVideoIndex;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setActiveVideoIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition flex items-start space-x-3 ${
                        isActive
                          ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                        {isActive ? <Play className="w-4 h-4 fill-white" /> : idx + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{vid.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span>{vid.duration}</span>
                          <span>•</span>
                          <span className="truncate">{vid.topics[0]}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Study Tabs: Topics / Notes / Guidelines / Sample MCQs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold overflow-x-auto pb-px">
                <button
                  onClick={() => setActiveTab('topics')}
                  className={`pb-3 transition relative shrink-0 ${
                    activeTab === 'topics'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Curriculum Syllabus
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 transition relative shrink-0 ${
                    activeTab === 'notes'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Key Exam Notes
                </button>
                <button
                  onClick={() => setActiveTab('guidelines')}
                  className={`pb-3 transition relative shrink-0 ${
                    activeTab === 'guidelines'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Rules & Evaluation
                </button>
                <button
                  onClick={() => setActiveTab('mcqs')}
                  className={`pb-3 transition relative shrink-0 flex items-center space-x-1.5 ${
                    activeTab === 'mcqs'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Sample MCQs (5)</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                    Practice
                  </span>
                </button>
              </div>

              {activeTab === 'topics' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Topics Evaluated in Level {levelNumber}
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {curriculum.topics.map((t, idx) => (
                      <li
                        key={idx}
                        className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                      >
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Important Collegiate Assessment Notes
                  </div>
                  <div className="space-y-2">
                    {curriculum.studyNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5"
                      >
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'guidelines' && (
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    • Assessment duration is strictly <strong>60 minutes</strong>. An authoritative server timer enforces auto-submission upon timeout.
                  </p>
                  <p>
                    • Submissions are evaluated against multiple hidden test cases in an isolated container sandbox. Passing percentage required is <strong>{examination?.passingPercentage || 100}%</strong>.
                  </p>
                  <p>
                    • Fullscreen anti-cheat monitoring and tab-switch detection are active throughout the examination session.
                  </p>
                </div>
              )}

              {activeTab === 'mcqs' && (
                <div className="space-y-6">
                  {/* Top Bar with score & reset */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-teal-600" />
                        <span>5 Practice MCQs for Understanding</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Test your conceptual foundation before taking the automated code assessment.
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                        Score:{' '}
                        <span className="text-teal-600 font-extrabold">
                          {(curriculum.sampleMcqs || []).filter((m, idx) => selectedAnswers[idx] === m.correctIndex).length}
                        </span>{' '}
                        / {curriculum.sampleMcqs?.length || 5} Correct
                      </div>
                      {Object.keys(selectedAnswers).length > 0 && (
                        <button
                          onClick={handleResetMcqs}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center space-x-1 transition"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-500" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 5 Questions */}
                  <div className="space-y-5">
                    {(curriculum.sampleMcqs || []).map((mcq, qIdx) => {
                      const userSelection = selectedAnswers[qIdx];
                      const isAnswered = userSelection !== undefined;
                      const isCorrect = userSelection === mcq.correctIndex;

                      return (
                        <div
                          key={mcq.id || qIdx}
                          className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start space-x-3">
                              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <h5 className="text-sm font-bold text-slate-900 leading-snug whitespace-pre-line">
                                {mcq.question}
                              </h5>
                            </div>

                            {isAnswered && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 flex items-center space-x-1 ${
                                  isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Correct</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 text-rose-600" />
                                    <span>Incorrect</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {mcq.options.map((opt, optIdx) => {
                              const isSelected = userSelection === optIdx;
                              const isOptionCorrect = optIdx === mcq.correctIndex;

                              let optionStyle =
                                'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50';

                              if (isAnswered) {
                                if (isOptionCorrect) {
                                  optionStyle =
                                    'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20';
                                } else if (isSelected && !isOptionCorrect) {
                                  optionStyle =
                                    'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20';
                                } else {
                                  optionStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-70';
                                }
                              }

                              const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectAnswer(qIdx, optIdx)}
                                  className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center space-x-2.5 shadow-2xs ${optionStyle}`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                      isAnswered && isOptionCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : isAnswered && isSelected
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {optionLabel}
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation banner once answered */}
                          {isAnswered && (
                            <div
                              className={`p-3 rounded-xl text-xs leading-relaxed flex items-start space-x-2 ${
                                isCorrect
                                  ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-900'
                                  : 'bg-amber-50/80 border border-amber-200 text-amber-900'
                              }`}
                            >
                              <Sparkles
                                className={`w-4 h-4 shrink-0 mt-0.5 ${
                                  isCorrect ? 'text-emerald-600' : 'text-amber-600'
                                }`}
                              />
                              <div>
                                <strong className="font-semibold block mb-0.5">
                                  {isCorrect ? 'Explanation:' : 'Why this is correct:'}
                                </strong>
                                <span>{mcq.explanation}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Examination Registration & Slot Dropdown (5 / 12 cols, Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-20 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Box Title */}
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Assessment Booking
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Level {levelNumber} Examination
                </h3>
              </div>

              {/* Status Alert: If Locked */}
              {!progress.isEligible && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Level Locked</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {progress.lockReason || `You must successfully pass Level ${Number(levelNumber) - 1} before registering for this assessment.`}
                  </p>
                </div>
              )}

              {/* Status Alert: If Already Passed */}
              {progress.isPassed && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Level Passed</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    You scored <strong>{progress.scorePercentage}%</strong> on this assessment. You have unlocked Level {Number(levelNumber) + 1}!
                  </p>
                </div>
              )}

              {/* Status: If Slot Concluded / Marked Absent */}
              {hasBookedSlot && isSlotExpired && (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-4 shadow-sm animate-fade-in">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Assessment Slot Concluded — Marked Absent</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 bg-white/80 p-3.5 rounded-xl border border-rose-200/60 shadow-xs">
                    <div className="flex justify-between border-b border-rose-100 pb-1.5">
                      <span className="text-slate-500">Exam Date:</span>
                      <strong className="text-rose-950 font-bold">
                        {formatSlotDate(registration?.slot?.startTime)}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-rose-100 pb-1.5">
                      <span className="text-slate-500">Scheduled Slot:</span>
                      <strong className="text-slate-900 font-bold">
                        {registration?.slot?.timeWindow || 'Collegiate Window'}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-rose-100 pb-1.5">
                      <span className="text-slate-500">Assigned Lab:</span>
                      <strong className="text-slate-900 font-bold">
                        {registration?.slot?.labName || 'Standard Lab'}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-500">Attendance Status:</span>
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Absent</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Only Faculty Can Reset This Course</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      You did not attend this examination during the 1-hour window. This course remains under <strong>My Courses</strong> and cannot be re-registered in <strong>Total Courses</strong>.
                    </p>
                    <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                      Please contact your faculty or lab administrator. Once faculty resets/removes this absent record, you will be able to register again from Total Courses.
                    </p>
                  </div>
                </div>
              )}

              {/* Status: If Already Registered / Booked Slot (Upcoming) */}
              {hasBookedSlot && !isSlotExpired && (
                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-4">
                  <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <span>Confirmed Slot Booking</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-teal-200/60 pb-1.5">
                      <span className="text-slate-500">Exam Date:</span>
                      <strong className="text-teal-900 font-bold">
                        {formatSlotDate(registration?.slot?.startTime)}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-teal-200/60 pb-1.5">
                      <span className="text-slate-500">Slot Timing:</span>
                      <strong className="text-slate-900 font-bold">
                        {registration?.slot?.timeWindow || 'Collegiate Window'}
                      </strong>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-500">Assigned Lab:</span>
                      <strong className="text-slate-900 font-bold">
                        {registration?.slot?.labName || 'Standard Lab'}
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-teal-800 bg-teal-100/50 p-2.5 rounded-xl border border-teal-200/60 font-medium leading-relaxed">
                    Your exam slot is reserved. Study the video lectures, topics evaluated, and study notes on the left before entering the exam room.
                  </p>

                  <div className="p-3 bg-white border border-teal-200/80 rounded-xl space-y-1 text-center">
                    <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-teal-800">
                      <Clock className="w-4 h-4 text-teal-600 animate-pulse" />
                      <span>Unlocks at {registration?.slot?.timeWindow?.split(/to|-/)[0]?.trim() || 'Slot Time'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      At {registration?.slot?.timeWindow?.split(/to|-/)[0]?.trim() || 'the scheduled time'}, this page will automatically display the launch portal.
                    </p>
                  </div>
                </div>
              )}

              {/* Eligible and NOT Booked: Slot Dropdown Selection */}
              {!hasBookedSlot && progress.isEligible && !progress.isPassed && (
                <div className="space-y-5">
                  {!examination ? (
                    <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs">
                      No active examination published by faculty for this level at this moment. Please check back soon.
                    </div>
                  ) : !examination.isRegistrationOpen ? (
                    /* Previous Day 9:00 PM Locked state */
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
                      <div className="flex items-center space-x-2 font-bold text-sm text-amber-800">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Registration Not Open Yet</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Collegiate rule: Registration for this examination unlocks strictly on the{' '}
                        <strong>previous day at 9:00 PM</strong> (
                        {new Date(examination.registrationStartDate).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        ).
                      </p>
                      <div className="text-[11px] text-amber-700 bg-amber-100/60 p-2 rounded-lg font-medium">
                        Slots across Lab 1, 2, and 3 will become visible once registration opens at 9:00 PM.
                      </div>
                    </div>
                  ) : (
                    /* Registration IS OPEN: Slot Dropdown Picker */
                    visibleSlots.length === 0 ? (
                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
                        <div className="flex items-center space-x-2 font-bold text-sm text-amber-800">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>All Slots for Today Have Commenced</span>
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          By <strong>2:45 PM</strong>, all examination slots for today have commenced or concluded. Students cannot register for an examination slot after its start time has passed.
                        </p>
                        <div className="text-[11px] text-amber-800 bg-amber-100/70 p-3 rounded-xl border border-amber-200 font-medium space-y-1">
                          <div className="font-bold flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Next Day Examination:</span>
                          </div>
                          <div>
                            Registration for tomorrow's examination slots unlocks strictly tonight at <strong>9:00 PM</strong>.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {registerSuccess && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{registerSuccess}</span>
                          </div>
                        )}

                        {registerError && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>{registerError}</span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Choose Available Examination Slot:
                          </label>
                          <p className="text-xs text-slate-500">
                            Select the specific time window and lab you prefer (each lab strictly has 30 seats; passed or full slots are hidden).
                          </p>

                          {/* Interactive Slot Dropdown */}
                          <div className="relative mt-2">
                            <select
                              value={selectedSlotId}
                              onChange={(e) => setSelectedSlotId(e.target.value)}
                              className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                            >
                              <option value="">-- Click to choose your preferred slot --</option>
                              {visibleSlots.map((slot) => (
                                <option key={slot._id} value={slot._id}>
                                  {formatSlotDate(slot.startTime)} • {slot.timeWindow} — {slot.labName} ({slot.seatsRemaining} of 30 seats available)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Selected Slot Confirmation Preview */}
                        {selectedSlot && (
                          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2 text-xs">
                            <div className="text-teal-900 font-bold flex items-center space-x-1.5">
                              <Sparkles className="w-4 h-4 text-teal-600" />
                              <span>Selected Slot Summary</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                              <div>
                                <span className="text-slate-400 block text-[11px]">Exam Date</span>
                                <strong className="text-teal-900 font-bold">{formatSlotDate(selectedSlot.startTime)}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">Time Window</span>
                                <strong className="text-slate-900">{selectedSlot.timeWindow}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">Assigned Lab</span>
                                <strong className="text-slate-900">{selectedSlot.labName}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">Available Seats</span>
                                <strong className="text-teal-700">{selectedSlot.seatsRemaining} / 30 seats</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Register Button */}
                        <button
                          onClick={handleRegisterSlot}
                          disabled={!selectedSlotId || !selectedSlot || isSubmitting}
                          className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow flex items-center justify-center space-x-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              <span>Confirming Registration...</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4" />
                              <span>Confirm Registration for Selected Slot</span>
                            </>
                          )}
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Assessment Meta Details */}
              <div className="border-t border-slate-200 pt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-semibold text-slate-800">
                    {examination?.durationMinutes || 60} Minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Passing Threshold:</span>
                  <span className="font-semibold text-slate-800">
                    {examination?.passingPercentage || 100}% Passing Score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LevelDetailPage;

