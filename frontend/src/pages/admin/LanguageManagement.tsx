import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Code2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Cpu,
  Plus,
  Settings2,
  Clock,
  HardDrive,
  BookOpen,
  X,
  Layers,
  Edit3,
  Save,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseLevel {
  _id?: string;
  levelNumber: number;
  title: string;
  description: string;
  questionCount?: number;
  defaultPassingPercentage?: number;
}

interface CourseDetails {
  _id: string;
  name: string;
  slug: string;
  executionEngineId: string;
  totalLevels: number;
  isEnabled: boolean;
  isCompilerAvailable?: boolean;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
  description: string;
  levels?: CourseLevel[];
}

export const LanguageManagement: React.FC = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<any[]>([]);
  const [workerHealth, setWorkerHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add Course Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    slug: '',
    executionEngineId: 'gcc',
    totalLevels: 4,
    defaultTimeLimitMs: 4000,
    defaultMemoryLimitMb: 256,
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Course Details Modal State
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [editableLevels, setEditableLevels] = useState<CourseLevel[]>([]);
  const [isSavingLevels, setIsSavingLevels] = useState(false);

  const fetchLanguages = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/languages');
      if (res.data.success) {
        setLanguages(res.data.languages);
        setWorkerHealth(res.data.workerHealth);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading languages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleToggleEnable = async (lang: any) => {
    setError(null);
    setSuccessMsg(null);

    // If enabling, ensure compiler is physically present
    if (!lang.isEnabled && !lang.isCompilerAvailable) {
      setError(
        `Cannot enable ${lang.name}: Compiler/runtime '${lang.executionEngineId}' is not detected on the execution worker.`
      );
      return;
    }

    try {
      const res = await api.patch(`/admin/languages/${lang._id}`, {
        isEnabled: !lang.isEnabled
      });
      if (res.data.success) {
        setSuccessMsg(`Updated ${lang.name} status successfully.`);
        fetchLanguages();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update language.');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.post('/admin/languages', newCourse);
      if (res.data.success) {
        setSuccessMsg(`Course "${newCourse.name}" created successfully with ${newCourse.totalLevels} levels!`);
        setShowAddModal(false);
        setNewCourse({
          name: '',
          slug: '',
          executionEngineId: 'gcc',
          totalLevels: 4,
          defaultTimeLimitMs: 4000,
          defaultMemoryLimitMb: 256,
          description: ''
        });
        fetchLanguages();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create new course.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenCourseDetails = async (courseId: string) => {
    setIsLoadingDetails(true);
    setShowDetailsModal(true);
    setSelectedCourse(null);
    setError(null);

    try {
      const res = await api.get(`/admin/languages/${courseId}/details`);
      if (res.data.success) {
        setSelectedCourse(res.data.course);
        setEditableLevels(res.data.course.levels || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch course details.');
      setShowDetailsModal(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleLevelChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...editableLevels];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditableLevels(updated);
  };

  const handleSaveCurriculum = async () => {
    if (!selectedCourse) return;
    setIsSavingLevels(true);
    try {
      const payload = {
        levels: editableLevels.map((lvl) => ({
          levelNumber: lvl.levelNumber,
          title: lvl.title,
          description: lvl.description
        }))
      };
      const res = await api.put(`/admin/languages/${selectedCourse._id}/levels`, payload);
      if (res.data.success) {
        setSuccessMsg(`Curriculum details saved for ${selectedCourse.name}.`);
        handleOpenCourseDetails(selectedCourse._id);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update curriculum.');
    } finally {
      setIsSavingLevels(false);
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
            <Code2 className="w-6 h-6 text-teal-400" />
            <span>Courses & Assessment Tracks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure courses, curriculum levels, compiler sandboxes, and execution constraints.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-teal-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {languages.map((lang) => {
          const isEngineAvailable = lang.isCompilerAvailable;

          return (
            <div
              key={lang._id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition ${
                lang.isEnabled
                  ? 'bg-slate-900 border-teal-500/40 shadow-lg shadow-teal-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
                    Engine: {lang.executionEngineId}
                  </span>

                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isEngineAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    <span>{isEngineAvailable ? 'Compiler Online' : 'Unavailable'}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{lang.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{lang.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Curriculum</span>
                    <span className="font-bold text-white block mt-0.5">{lang.totalLevels} Levels</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Timeout</span>
                    <span className="font-bold text-teal-300 block mt-0.5">{lang.defaultTimeLimitMs}ms</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800/80 mt-5 space-y-3">
                <button
                  onClick={() => handleOpenCourseDetails(lang._id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-700/80 transition shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Course Details & Levels</span>
                </button>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Status:{' '}
                    <strong className={lang.isEnabled ? 'text-teal-400' : 'text-slate-500'}>
                      {lang.isEnabled ? 'Enabled' : 'Disabled'}
                    </strong>
                  </span>

                  <button
                    onClick={() => handleToggleEnable(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      lang.isEnabled
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md'
                    }`}
                  >
                    {lang.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-teal-400" />
                <span>Add New Course Track</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Course Name</label>
                  <input
                    type="text"
                    required
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    placeholder="e.g. Go Programming"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Slug / Code</label>
                  <input
                    type="text"
                    value={newCourse.slug}
                    onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })}
                    placeholder="e.g. go (auto-generated if empty)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Compiler / Execution Engine</label>
                  <select
                    value={newCourse.executionEngineId}
                    onChange={(e) => setNewCourse({ ...newCourse, executionEngineId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="gcc">GCC (C Engine)</option>
                    <option value="g++">G++ (C++ Engine)</option>
                    <option value="python3">Python 3 Runtime</option>
                    <option value="javac">OpenJDK (Java Runtime)</option>
                    <option value="node">Node.js (JavaScript Runtime)</option>
                    <option value="custom">Custom Compiler Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Total Curriculum Levels</label>
                  <select
                    value={newCourse.totalLevels}
                    onChange={(e) => setNewCourse({ ...newCourse, totalLevels: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value={1}>1 Level</option>
                    <option value={2}>2 Levels</option>
                    <option value={3}>3 Levels</option>
                    <option value={4}>4 Levels</option>
                    <option value={5}>5 Levels</option>
                    <option value={6}>6 Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Timeout Limit (ms)</label>
                  <input
                    type="number"
                    min={500}
                    max={15000}
                    value={newCourse.defaultTimeLimitMs}
                    onChange={(e) => setNewCourse({ ...newCourse, defaultTimeLimitMs: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Memory Limit (MB)</label>
                  <input
                    type="number"
                    min={64}
                    max={1024}
                    value={newCourse.defaultMemoryLimitMb}
                    onChange={(e) => setNewCourse({ ...newCourse, defaultMemoryLimitMb: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Course Description</label>
                <textarea
                  rows={3}
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Overview of curriculum, assessment goals, and core syllabus topics..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold flex items-center space-x-1.5 transition disabled:opacity-50"
                >
                  {isCreating ? 'Creating Course...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Details & Levels Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <Layers className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">
                  {selectedCourse?.name || 'Course Details'} - Curriculum & Level Breakdown
                </h3>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
              </div>
            ) : selectedCourse ? (
              <div className="space-y-5 text-xs">
                {/* Course Metadata Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Engine</span>
                    <span className="font-bold text-teal-300 text-sm">{selectedCourse.executionEngineId}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Curriculum</span>
                    <span className="font-bold text-white text-sm">{selectedCourse.totalLevels} Levels</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Execution Limit</span>
                    <span className="font-bold text-teal-300 text-sm">{selectedCourse.defaultTimeLimitMs}ms</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Memory Limit</span>
                    <span className="font-bold text-white text-sm">{selectedCourse.defaultMemoryLimitMb}MB</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">
                    Course Description
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedCourse.description}</p>
                </div>

                {/* Level Breakdown List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                      <span>Curriculum Levels & Multi-Question Bank</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Multi-question pools are randomly shuffled per student exam session.
                    </span>
                  </div>

                  <div className="space-y-3">
                    {editableLevels.map((lvl, idx) => (
                      <div
                        key={lvl.levelNumber || idx}
                        className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-300 text-xs uppercase tracking-wider font-mono">
                            Level {lvl.levelNumber}
                          </span>

                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                (lvl.questionCount || 0) >= 2
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {lvl.questionCount || 0} Questions Available
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                setShowDetailsModal(false);
                                navigate('/admin/questions');
                              }}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700"
                            >
                              Add Questions
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                              Level Title
                            </label>
                            <input
                              type="text"
                              value={lvl.title}
                              onChange={(e) => handleLevelChange(idx, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                              Syllabus / Focus Description
                            </label>
                            <input
                              type="text"
                              value={lvl.description}
                              onChange={(e) => handleLevelChange(idx, 'description', e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="text-[11px] text-slate-500">
                    Changes will update the syllabus details shown to students.
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowDetailsModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCurriculum}
                      disabled={isSavingLevels}
                      className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingLevels ? 'Saving...' : 'Save Curriculum Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
