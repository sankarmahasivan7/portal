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
      fetchExams();
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
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2.5 tracking-tight">
              <Calendar className="w-6 h-6 text-teal-600" />
              <span>Examination Schedule & Lab Slot Booking</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Official timetable of college programming assessments. 
              <strong className="text-teal-700 ml-1">
                Registration opens strictly on the previous day at 9:00 PM. Filled slots (30/30) disappear in real time.
              </strong>
            </p>
          </div>

          <button
            onClick={fetchExams}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-teal-700 text-xs font-bold border border-slate-200 shadow-sm transition"
          >
            ↻ Refresh Real-Time Slots
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Policy Reminder Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Official Collegiate Examination Policy</span>
              <span className="text-slate-500 block text-xs mt-0.5">
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
                className={`p-6 rounded-2xl border transition shadow-sm ${
                  isPassed
                    ? 'bg-white border-emerald-200'
                    : isRegistered
                    ? 'bg-white border-teal-300 ring-2 ring-teal-500/10'
                    : isEligible
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-slate-100/60 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-3 max-w-2xl flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-100 text-teal-700 border border-slate-200 font-mono">
                        {exam.language} • Level {exam.levelNumber}
                      </span>

                      {isPassed && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed & Passed</span>
                        </span>
                      )}

                      {isRegistered && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registered</span>
                        </span>
                      )}

                      {!isEligible && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Prerequisite Locked</span>
                        </span>
                      )}

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isRegOpen
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isRegOpen ? 'Registration Open' : 'Opens Previous Day 9:00 PM'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{exam.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Duration: {exam.durationMinutes} Minutes</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Passing Cutoff: {exam.passingPercentage}%</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Exam Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {!isEligible && (
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-amber-700 flex items-center space-x-2">
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>{exam.lockReason}</span>
                      </div>
                    )}

                    {/* Previous Day 9:00 PM Notice if not yet open */}
                    {!isRegOpen && isEligible && !isRegistered && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                        <div className="flex items-center space-x-2 font-bold text-amber-800">
                          <Lock className="w-4 h-4 text-amber-600" />
                          <span>Slot Selection Locked until Previous Day 9:00 PM</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {exam.registrationMessage}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          Available labs (Lab 1, 2, 3) and 30-capacity slots will become visible once the registration time begins.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right side: Slot selector & registration button */}
                  <div className="lg:w-96 shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                    {isRegistered ? (
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                          <span className="text-xs font-semibold text-teal-800 block">
                            Confirmed Registration:
                          </span>
                          <span className="text-sm font-bold text-slate-900 block mt-0.5">
                            {exam.registration.slotId?.slotName || 'Reserved Slot'}
                          </span>
                          <span className="text-xs text-slate-600 block mt-1 font-mono">
                            {new Date(exam.registration.slotId?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {new Date(exam.registration.slotId?.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/exam/${exam.id}`)}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center space-x-2"
                          >
                            <span>Enter Exam Arena</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleCancel(exam.id)}
                            disabled={isActionBusy}
                            title="Cancel Registration"
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : isPassed ? (
                      <div className="text-center py-4 space-y-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-emerald-800 block">
                          Level Examination Cleared
                        </span>
                        <p className="text-[11px] text-slate-500">
                          You have cleared this assessment and unlocked the next programming tier.
                        </p>
                      </div>
                    ) : isEligible ? (
                      <div className="space-y-3">
                        {!isRegOpen ? (
                          <div className="text-center py-4 space-y-1">
                            <span className="text-xs font-bold text-amber-700 block">
                              Registration Pending
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Opens at 9:00 PM on the previous day.
                            </p>
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="text-center py-4 space-y-1">
                            <span className="text-xs font-bold text-rose-600 block">
                              All Slots Full
                            </span>
                            <p className="text-[11px] text-slate-500">
                              All 15 slots (450 seats across Lab 1, 2, 3) are completely filled.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Select Available Lab Slot:
                              </label>
                              <select
                                value={selectedSlots[exam.id] || ''}
                                onChange={(e) =>
                                  setSelectedSlots((prev) => ({ ...prev, [exam.id]: e.target.value }))
                                }
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                              >
                                {availableSlots.map((slot: any) => (
                                  <option key={slot._id} value={slot._id}>
                                    {slot.slotName} ({30 - slot.registeredCount} of 30 seats available)
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              onClick={() => handleRegister(exam.id)}
                              disabled={isActionBusy}
                              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center space-x-2"
                            >
                              {isActionBusy ? (
                                <span>Registering...</span>
                              ) : (
                                <>
                                  <Calendar className="w-4 h-4" />
                                  <span>Book Examination Slot</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 space-y-1">
                        <Lock className="w-6 h-6 text-slate-400 mx-auto" />
                        <span className="text-xs font-bold text-slate-500 block">
                          Progression Locked
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Clear prerequisite levels to book this slot.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ExamSchedule;
