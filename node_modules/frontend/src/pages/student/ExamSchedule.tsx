import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Lock,
  AlertCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  XCircle,
  ChevronRight,
  HardDrive,
  Sparkles
} from 'lucide-react';

export const ExamSchedule: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/exams/available');
      if (res.data.success) {
        setExams(res.data.exams);
        // Pre-select first available unfilled slot for each exam
        const initialSlots: Record<string, string> = {};
        res.data.exams.forEach((exam: any) => {
          if (exam.slots && exam.slots.length > 0) {
            initialSlots[exam.id] = exam.slots[0]._id;
          }
        });
        setSelectedSlots(initialSlots);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load examinations schedule.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleRegister = async (examId: string) => {
    const slotId = selectedSlots[examId];
    if (!slotId) {
      setError('Please select an available lab time slot.');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setActionLoading((prev) => ({ ...prev, [examId]: true }));

    try {
      const res = await api.post(`/exams/${examId}/register`, { slotId });
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Examination slot confirmed!');
        fetchExams();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register for examination.');
      fetchExams(); // Refresh slots in real time in case it just got filled
    } finally {
      setActionLoading((prev) => ({ ...prev, [examId]: false }));
    }
  };

  const handleCancel = async (examId: string) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;

    setError(null);
    setSuccessMsg(null);
    setActionLoading((prev) => ({ ...prev, [examId]: true }));

    try {
      const res = await api.post(`/exams/${examId}/cancel-registration`);
      if (res.data.success) {
        setSuccessMsg('Registration cancelled.');
        fetchExams();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cancellation error.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [examId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Calendar className="w-6 h-6 text-teal-400" />
            <span>Examination Schedule & Lab Slot Booking</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official timetable of college programming assessments. 
            <strong className="text-teal-300 ml-1">
              Registration opens strictly on the previous day at 9:00 PM. Filled slots (30/30) disappear in real time.
            </strong>
          </p>
        </div>

        <button
          onClick={fetchExams}
          className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-slate-700 transition"
        >
          ↻ Refresh Real-Time Slots
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Policy Reminder Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center space-x-2.5">
          <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-white block">Official Collegiate Examination Policy</span>
            <span className="text-slate-400 block text-[11px] mt-0.5">
              • Time Windows: <strong>09:15 - 10:15</strong>, <strong>10:25 - 11:25</strong>, <strong>11:35 - 12:35</strong>, <strong>1:30 - 2:30</strong>, <strong>2:45 - 3:45</strong>
              <br />
              • Venues: <strong>Lab 1</strong>, <strong>Lab 2</strong>, <strong>Lab 3</strong> (Strict capacity: 30 students per lab).
              <br />
              • Allocation Window: Opens <strong>Previous Day at 9:00 PM</strong>.
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {exams.map((exam) => {
          const isEligible = exam.isEligible;
          const isRegistered = !!exam.registration;
          const isPassed = exam.pastResult && exam.pastResult.passed;
          const isActionBusy = actionLoading[exam.id];
          const isRegOpen = exam.isRegistrationOpen;
          const availableSlots = exam.slots || [];

          return (
            <div
              key={exam.id}
              className={`p-6 rounded-3xl border transition ${
                isPassed
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : isRegistered
                  ? 'bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : isEligible
                  ? 'bg-slate-900 border-teal-500/40 shadow-lg shadow-teal-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 max-w-2xl flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-800 text-teal-400 border border-teal-500/30 font-mono">
                      {exam.language} • Level {exam.levelNumber}
                    </span>

                    {isPassed && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed & Passed</span>
                      </span>
                    )}

                    {isRegistered && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </span>
                    )}

                    {!isEligible && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Prerequisite Locked</span>
                      </span>
                    )}

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isRegOpen
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isRegOpen ? 'Registration Open' : 'Opens Previous Day 9:00 PM'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{exam.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{exam.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Duration: {exam.durationMinutes} Minutes</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Passing Cutoff: {exam.passingPercentage}%</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Exam Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {!isEligible && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-amber-400/90 flex items-center space-x-2">
                      <Lock className="w-4 h-4 flex-shrink-0" />
                      <span>{exam.lockReason}</span>
                    </div>
                  )}

                  {/* Previous Day 9:00 PM Notice if not yet open */}
                  {!isRegOpen && isEligible && !isRegistered && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                      <div className="flex items-center space-x-2 font-bold">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Slot Selection Locked until Previous Day 9:00 PM</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {exam.registrationMessage}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Available labs (Lab 1, 2, 3) and 30-capacity slots will become visible once the registration time begins.
                      </span>
                    </div>
                  )}
                </div>

                {/* Right side: Slot selector & registration button */}
                <div className="lg:w-96 flex-shrink-0 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-4">
                  {isRegistered ? (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <span className="text-xs font-semibold text-indigo-300 block">
                          Confirmed Registration:
                        </span>
                        <span className="text-sm font-bold text-white block mt-0.5">
                          {exam.registration.slotId?.slotName || 'Reserved Slot'}
                        </span>
                        <span className="text-xs text-slate-400 block mt-1 font-mono">
                          {new Date(exam.registration.slotId?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {new Date(exam.registration.slotId?.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-teal-400 font-semibold block mt-1">
                          Assigned Venue: {exam.registration.slotId?.labName || 'Lab'} (30 Max Capacity)
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/exam/${exam.id}`)}
                        className="w-full py-2.5 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition"
                      >
                        <Play className="w-4 h-4" />
                        <span>Launch Examination Arena</span>
                      </button>

                      <button
                        onClick={() => handleCancel(exam.id)}
                        disabled={isActionBusy}
                        className="w-full py-1.5 px-3 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs transition"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  ) : !isEligible ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500 space-y-2">
                      <Lock className="w-6 h-6 text-slate-600" />
                      <span className="text-xs">Level locked. Complete prerequisite level first.</span>
                    </div>
                  ) : !isRegOpen ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-amber-400/80 space-y-2">
                      <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
                      <span className="text-xs font-bold text-white">Registration Not Yet Open</span>
                      <span className="text-[11px] text-slate-400">
                        Opens on previous day at 9:00 PM.
                      </span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center space-y-1">
                      <XCircle className="w-6 h-6 text-rose-400 mx-auto mb-1" />
                      <span className="font-bold block">All Examination Slots are Full</span>
                      <span className="text-[11px] text-slate-400 block">
                        All 30/30 seats across Lab 1, Lab 2, and Lab 3 are booked. Filled slots are removed in real time.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Select Available Lab & Slot
                          </label>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            Real-Time Data
                          </span>
                        </div>

                        <select
                          value={selectedSlots[exam.id] || ''}
                          onChange={(e) =>
                            setSelectedSlots({ ...selectedSlots, [exam.id]: e.target.value })
                          }
                          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          {availableSlots.map((slot: any) => {
                            const remainingSeats = slot.capacity - slot.registeredCount;
                            return (
                              <option key={slot._id} value={slot._id}>
                                {slot.slotName} — {remainingSeats}/{slot.capacity} Seats Available
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center justify-between text-slate-300 font-semibold">
                          <span>Real-Time Seat Counter</span>
                          <span className="text-teal-400">30 Seats / Lab</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Slots with 0 seats remaining are hidden automatically. Choose an open slot to secure your seat.
                        </p>
                      </div>

                      <button
                        onClick={() => handleRegister(exam.id)}
                        disabled={isActionBusy || !selectedSlots[exam.id]}
                        className="w-full py-2.5 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition disabled:opacity-50"
                      >
                        {isActionBusy ? (
                          <span>Reserving slot...</span>
                        ) : (
                          <>
                            <span>Register Examination Slot</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
