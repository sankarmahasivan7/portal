import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
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
  XCircle
} from 'lucide-react';

interface CourseVideo {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  description: string;
  topics: string[];
}

interface Curriculum {
  title: string;
  description: string;
  topics: string[];
  studyNotes: string[];
  videos: CourseVideo[];
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
    } | null;
  } | null;
  examination: ExaminationData | null;
}

export const LevelDetailPage: React.FC = () => {
  const { languageId, levelNumber } = useParams<{ languageId: string; levelNumber: string }>();
  const [data, setData] = useState<LevelDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video Player state
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'topics' | 'notes' | 'guidelines'>('topics');

  // Slot Selection & Registration state
  const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const navigate = useNavigate();

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
  const currentVideo = curriculum.videos[activeVideoIndex] || curriculum.videos[0];
  const selectedSlot = examination?.slots.find((s) => s._id === selectedSlotId);

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
            {progress.isRegistered && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Slot Booked</span>
              </span>
            )}
            {!progress.isPassed && !progress.isRegistered && progress.isEligible && (
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

            {/* Study Tabs: Topics / Notes / Guidelines */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab('topics')}
                  className={`pb-3 transition relative ${
                    activeTab === 'topics'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Curriculum Syllabus
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 transition relative ${
                    activeTab === 'notes'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Key Exam Notes
                </button>
                <button
                  onClick={() => setActiveTab('guidelines')}
                  className={`pb-3 transition relative ${
                    activeTab === 'guidelines'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Rules & Evaluation
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
                    • Submissions are evaluated against multiple hidden test cases in an isolated container sandbox. Passing percentage required is <strong>{examination?.passingPercentage || 60}%</strong>.
                  </p>
                  <p>
                    • Fullscreen anti-cheat monitoring and tab-switch detection are active throughout the examination session.
                  </p>
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

              {/* Status: If Already Registered */}
              {progress.isRegistered && registration && (
                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-4">
                  <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <span>Confirmed Registration</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-teal-200/60 pb-1.5">
                      <span className="text-slate-500">Scheduled Window:</span>
                      <strong className="text-slate-900">
                        {registration.slot?.timeWindow || 'Collegiate Window'}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-teal-200/60 pb-1.5">
                      <span className="text-slate-500">Assigned Lab:</span>
                      <strong className="text-slate-900">
                        {registration.slot?.labName || 'Standard Lab'} (30 Capacity)
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-teal-200/60 pb-1.5">
                      <span className="text-slate-500">Seat Allocation:</span>
                      <strong className="text-emerald-700 font-bold">Confirmed</strong>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-slate-500">Attendance Gate:</span>
                      {registration.attendanceStatus === 'present' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Present</span>
                        </span>
                      ) : registration.attendanceStatus === 'absent' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Marked Absent</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending (Report to {registration.slot?.labName || 'Lab'})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {registration.attendanceStatus === 'absent' ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs text-center font-medium">
                      You were marked absent by staff. Only an administrator can remove this course from your My Courses before you can register again.
                    </div>
                  ) : (
                    <Link
                      to={`/exam/${examination?._id}`}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-xs ${
                        registration.attendanceStatus === 'present'
                          ? 'bg-teal-600 hover:bg-teal-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>
                        {registration.attendanceStatus === 'present'
                          ? 'Enter Exam Arena (Unlocked)'
                          : 'Enter Exam Arena (Lab Gate)'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}

              {/* Eligible and NOT Registered: Slot Dropdown Selection */}
              {progress.isEligible && !progress.isRegistered && (
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
                          Select the specific time window and lab you prefer (each lab strictly has 30 seats; full slots are hidden).
                        </p>

                        {/* Interactive Slot Dropdown */}
                        <div className="relative mt-2">
                          <select
                            value={selectedSlotId}
                            onChange={(e) => setSelectedSlotId(e.target.value)}
                            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                          >
                            <option value="">-- Click to choose your preferred slot --</option>
                            {examination.slots.map((slot) => (
                              <option key={slot._id} value={slot._id}>
                                {slot.timeWindow} — {slot.labName} ({slot.seatsRemaining} of 30 seats available)
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
                            <div>
                              <span className="text-slate-400 block text-[11px]">Slot Assignment</span>
                              <strong className="text-emerald-700">Direct Choice</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Register Button */}
                      <button
                        onClick={handleRegisterSlot}
                        disabled={!selectedSlotId || isSubmitting}
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
                    {examination?.passingPercentage || 60}% Passing Score
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity per Lab:</span>
                  <span className="font-semibold text-slate-800">30 Students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Environment:</span>
                  <span className="font-semibold text-slate-800">Isolated Sandbox</span>
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

