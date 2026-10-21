import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  Eye,
  Trash2,
  X,
  FileCode,
  Shuffle,
  Filter,
  Layers
} from 'lucide-react';

export const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    exampleInput: '',
    exampleOutput: '',
    languageId: '',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    publicInput: '',
    publicOutput: '',
    hiddenInput: '',
    hiddenOutput: ''
  });

  const fetchQuestionsAndLanguages = async () => {
    try {
      setIsLoading(true);
      let url = `/admin/questions?search=${encodeURIComponent(search)}`;
      if (levelFilter) url += `&level=${levelFilter}`;
      if (courseFilter) url += `&languageId=${courseFilter}`;

      const [qRes, lRes] = await Promise.all([
        api.get(url),
        api.get('/admin/languages')
      ]);

      if (qRes.data.success) {
        setQuestions(qRes.data.questions);
      }
      if (lRes.data.success) {
        setLanguages(lRes.data.languages);
        if (!formData.languageId && lRes.data.languages.length > 0) {
          setFormData((prev) => ({ ...prev, languageId: lRes.data.languages[0]._id }));
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error fetching questions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsAndLanguages();
  }, [search, levelFilter, courseFilter]);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedLang = languages.find((l) => l._id === formData.languageId);
      const allowedLangs = selectedLang?.executionEngineId
        ? [selectedLang.executionEngineId, 'c', 'cpp', 'java', 'python']
        : ['c', 'cpp', 'java', 'python', 'javascript'];

      const payload = {
        title: formData.title,
        description: formData.description,
        inputFormat: formData.inputFormat,
        outputFormat: formData.outputFormat,
        constraints: formData.constraints,
        examples: [
          {
            input: formData.exampleInput,
            output: formData.exampleOutput,
            explanation: 'Sample Case'
          }
        ],
        languageId: formData.languageId || undefined,
        targetLevel: Number(formData.targetLevel),
        difficulty: formData.difficulty,
        marks: Number(formData.marks),
        allowedLanguages: allowedLangs,
        testCases: [
          {
            input: formData.publicInput || formData.exampleInput,
            expectedOutput: formData.publicOutput || formData.exampleOutput,
            isHidden: false,
            weight: 1
          },
          {
            input: formData.hiddenInput,
            expectedOutput: formData.hiddenOutput,
            isHidden: true,
            weight: 1
          }
        ]
      };

      const res = await api.post('/admin/questions', payload);
      if (res.data.success) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          inputFormat: '',
          outputFormat: '',
          constraints: '',
          exampleInput: '',
          exampleOutput: '',
          languageId: languages[0]?._id || '',
          targetLevel: 1,
          difficulty: 'Easy',
          marks: 100,
          publicInput: '',
          publicOutput: '',
          hiddenInput: '',
          hiddenOutput: ''
        });
        fetchQuestionsAndLanguages();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create question.');
    }
  };

  const handleArchive = async (id: string) => {
    if (!window.confirm('Archive this question? It will no longer be assigned to exam sessions.')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      fetchQuestionsAndLanguages();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Archive error.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-teal-400" />
            <span>Question Bank & Multi-Question Benchmark Suites</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author multi-question pools per course & level. Each candidate session receives an independently shuffled 2-question subset.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-teal-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Problem</span>
        </button>
      </div>

      {/* Info Callout about Shuffling & Multi-Questions */}
      <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs flex items-start space-x-2.5">
        <Shuffle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-teal-300 font-semibold block mb-0.5">Automated Per-Student Question Shuffling Active:</strong>
          <span>
            You can assign multiple questions to the same course and level. The exam engine dynamically samples and shuffles 2 questions from this pool for each student session, preventing duplicate questions across adjacent lab terminals.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-500 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by title..."
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="">All Courses & Tracks</option>
          {languages.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="">All Curriculum Levels</option>
          <option value="1">Level 1 (Fundamentals)</option>
          <option value="2">Level 2 (Data Structures)</option>
          <option value="3">Level 3 (Algorithms)</option>
          <option value="4">Level 4 (Advanced Logic)</option>
          <option value="5">Level 5 (Optimization)</option>
          <option value="6">Level 6 (Mastery)</option>
        </select>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">
            No problems found for the selected course and level criteria. Click "Create Problem" to add one!
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      {q.languageId?.name || 'General Track'}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">
                      L{q.targetLevel} • {q.difficulty}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {q.marks} Marks
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{q.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-3">{q.description}</p>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <span className="text-slate-500">Test Cases:</span>
                  <span className="text-emerald-400">
                    {q.testCases?.filter((t: any) => !t.isHidden).length || 0} Public
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400">
                    {q.testCases?.filter((t: any) => t.isHidden).length || 0} Hidden
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono uppercase truncate max-w-[200px]">
                  {q.allowedLanguages?.join(', ')}
                </span>
                <button
                  onClick={() => handleArchive(q._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Archive problem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Problem Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-teal-400" />
                <span>Create Programming Problem</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Course / Track</label>
                  <select
                    value={formData.languageId}
                    onChange={(e) => setFormData({ ...formData, languageId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="">General (All Languages)</option>
                    {languages.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.totalLevels} Levels)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Curriculum Target Level</label>
                  <select
                    value={formData.targetLevel}
                    onChange={(e) => setFormData({ ...formData, targetLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value={1}>Level 1 (Fundamentals)</option>
                    <option value={2}>Level 2 (Data Structures)</option>
                    <option value={3}>Level 3 (Algorithms)</option>
                    <option value={4}>Level 4 (Advanced)</option>
                    <option value={5}>Level 5 (Optimization)</option>
                    <option value={6}>Level 6 (Mastery)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Problem Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Count Vowels in a String"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Problem Statement</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the problem, input specifications, and expected solution..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Input Format</label>
                  <input
                    type="text"
                    required
                    value={formData.inputFormat}
                    onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                    placeholder="e.g. Single line with string S"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Output Format</label>
                  <input
                    type="text"
                    required
                    value={formData.outputFormat}
                    onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                    placeholder="e.g. Print count of vowels"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Constraints</label>
                  <input
                    type="text"
                    required
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    placeholder="1 <= |S| <= 10^5"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Marks</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Sample Test Case */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-300 block">Sample Public Test Case</span>
                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    rows={2}
                    value={formData.publicInput}
                    onChange={(e) => setFormData({ ...formData, publicInput: e.target.value })}
                    placeholder="Sample input..."
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono text-[11px]"
                  />
                  <textarea
                    rows={2}
                    value={formData.publicOutput}
                    onChange={(e) => setFormData({ ...formData, publicOutput: e.target.value })}
                    placeholder="Expected output..."
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Hidden Benchmark Case */}
              <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/20 space-y-2">
                <span className="font-semibold text-amber-400 block">Hidden Benchmark Test Case</span>
                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    rows={2}
                    value={formData.hiddenInput}
                    onChange={(e) => setFormData({ ...formData, hiddenInput: e.target.value })}
                    placeholder="Hidden edge-case input..."
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono text-[11px]"
                  />
                  <textarea
                    rows={2}
                    value={formData.hiddenOutput}
                    onChange={(e) => setFormData({ ...formData, hiddenOutput: e.target.value })}
                    placeholder="Hidden expected output..."
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono text-[11px]"
                  />
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
                  className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/10"
                >
                  Create Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
