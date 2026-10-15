import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Calendar,
  Plus,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Globe,
  X,
  FileCheck,
  UserCheck
} from 'lucide-react';

export const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState<string | null>(null);

  // New Exam Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    languageId: '',
    levelNumber: 1,
    registrationStartDate: new Date().toISOString().slice(0, 16),
    registrationEndDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    examDate: new Date().toISOString().slice(0, 16),
    durationMinutes: 60,
    passingPercentage: 60,
    maxStudents: 50,
    selectedQuestions: [] as string[],
    sebRequired: false,
    collegeNetworkOnly: false,
    slotName: 'General Session',
    slotCapacity: 50
  });

  // New Slot Form
  const [slotData, setSlotData] = useState({
    slotName: 'Afternoon Session',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16),
    capacity: 50
  });

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const [examsRes, langsRes, qsRes] = await Promise.all([
        api.get('/admin/exams'),
        api.get('/admin/languages'),
        api.get('/admin/questions')
      ]);

      if (examsRes.data.success) setExams(examsRes.data.exams);
      if (langsRes.data.success) {
        setLanguages(langsRes.data.languages);
        if (langsRes.data.languages.length > 0 && !formData.languageId) {
          setFormData((prev) => ({ ...prev, languageId: langsRes.data.languages[0]._id }));
        }
      }
      if (qsRes.data.success) setQuestions(qsRes.data.questions);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error fetching exams.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/exams/${id}/publish`, { isPublished: !currentStatus });
      fetchExams();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle publication status.');
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        languageId: formData.languageId,
        levelNumber: Number(formData.levelNumber),
        registrationStartDate: new Date(formData.registrationStartDate),
        registrationEndDate: new Date(formData.registrationEndDate),
        examDate: new Date(formData.examDate),
        durationMinutes: Number(formData.durationMinutes),
        passingPercentage: Number(formData.passingPercentage),
        maxStudents: Number(formData.maxStudents),
        questions: formData.selectedQuestions,
        sebRequired: formData.sebRequired,
        collegeNetworkOnly: formData.collegeNetworkOnly,
        isPublished: true,
        slots: [
          {
            slotName: formData.slotName,
            startTime: new Date(formData.examDate),
            endTime: new Date(new Date(formData.examDate).getTime() + Number(formData.durationMinutes) * 60000),
            capacity: Number(formData.slotCapacity)
          }
        ]
      };

      const res = await api.post('/admin/exams', payload);
      if (res.data.success) {
        setShowCreateModal(false);
        fetchExams();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create examination.');
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddSlotModal) return;

    try {
      const res = await api.post(`/admin/exams/${showAddSlotModal}/slots`, slotData);
      if (res.data.success) {
        setShowAddSlotModal(null);
        fetchExams();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error adding slot.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Calendar className="w-6 h-6 text-teal-400" />
            <span>Examinations & Slot Administration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure examination levels, duration, slots, passing cutoffs, and publication states.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Examination</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-slate-800 text-teal-400 border border-teal-500/30">
                    {exam.languageId?.name} • Level {exam.levelNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      exam.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {exam.isPublished ? 'Published & Active' : 'Unpublished (Draft)'}
                  </span>
                  {exam.sebRequired && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      SEB Enforced
                    </span>
                  )}
                  {exam.collegeNetworkOnly && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Campus IP Only
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mt-1.5">{exam.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{exam.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/admin/attendance?examId=${exam._id}`}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold text-xs border border-teal-500/30 transition flex items-center space-x-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Lab Attendance ({exam.registeredCount || 0})</span>
                </Link>

                <button
                  onClick={() => setShowAddSlotModal(exam._id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
                >
                  + Add Slot
                </button>

                <button
                  onClick={() => handleTogglePublish(exam._id, exam.isPublished)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    exam.isPublished
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                  }`}
                >
                  {exam.isPublished ? 'Unpublish' : 'Publish Examination'}
                </button>
              </div>
            </div>

            {/* Slots Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              {exam.slots?.map((slot: any) => (
                <Link
                  key={slot._id}
                  to={`/admin/attendance?examId=${exam._id}&slotId=${slot._id}`}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/60 space-y-1 block transition group"
                  title="Click to view and mark attendance for this slot"
                >
                  <div className="flex items-center justify-between font-semibold text-white group-hover:text-teal-300 transition">
                    <span>{slot.slotName}</span>
                    <span className="text-teal-400 font-mono">
                      {slot.registeredCount}/{slot.capacity}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                <span>Create Programming Examination</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Examination Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. C Programming - Level 1 Foundation Examination"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the examination curriculum and scope..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Language Track</label>
                  <select
                    value={formData.languageId}
                    onChange={(e) => setFormData({ ...formData, languageId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {languages.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Level Number</label>
                  <select
                    value={formData.levelNumber}
                    onChange={(e) => setFormData({ ...formData, levelNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                    <option value={4}>Level 4</option>
                    <option value={5}>Level 5</option>
                    <option value={6}>Level 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Passing Cutoff %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.passingPercentage}
                    onChange={(e) => setFormData({ ...formData, passingPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Exam Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Problem Selection */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Questions</label>
                <div className="max-h-36 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                  {questions.map((q) => (
                    <label key={q._id} className="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedQuestions.includes(q._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            selectedQuestions: checked
                              ? [...prev.selectedQuestions, q._id]
                              : prev.selectedQuestions.filter((id) => id !== q._id)
                          }));
                        }}
                        className="rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-0"
                      />
                      <span>
                        [Lvl {q.targetLevel}] {q.title} ({q.marks} Marks)
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Create & Publish Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Add Examination Slot</span>
            </h3>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Slot Name</label>
                <input
                  type="text"
                  required
                  value={slotData.slotName}
                  onChange={(e) => setSlotData({ ...slotData, slotName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={slotData.startTime}
                  onChange={(e) => setSlotData({ ...slotData, startTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  required
                  value={slotData.endTime}
                  onChange={(e) => setSlotData({ ...slotData, endTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Seat Capacity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={slotData.capacity}
                  onChange={(e) => setSlotData({ ...slotData, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

