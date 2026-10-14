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
  FileCode
} from 'lucide-react';

export const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    exampleInput: '',
    exampleOutput: '',
    targetLevel: 1,
    difficulty: 'Easy',
    marks: 100,
    publicInput: '',
    publicOutput: '',
    hiddenInput: '',
    hiddenOutput: ''
  });

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const url = `/admin/questions?search=${encodeURIComponent(search)}${
        levelFilter ? `&level=${levelFilter}` : ''
      }`;
      const res = await api.get(url);
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error fetching questions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, levelFilter]);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
        targetLevel: Number(formData.targetLevel),
        difficulty: formData.difficulty,
        marks: Number(formData.marks),
        allowedLanguages: ['c', 'cpp', 'java', 'python', 'javascript'],
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
        fetchQuestions();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create question.');
    }
  };

  const handleArchive = async (id: string) => {
    if (!window.confirm('Archive this question?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      fetchQuestions();
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
            <span>Question Bank & Benchmark Test Suites</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author programming questions, constraints, public examples, and hidden test cases.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Problem</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex items-center space-x-2">
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
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="">All Curriculum Levels</option>
          <option value="1">Level 1 (Fundamentals)</option>
          <option value="2">Level 2 (Data Structures)</option>
          <option value="3">Level 3 (Algorithms)</option>
          <option value="4">Level 4 (Advanced)</option>
        </select>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((q) => (
          <div
            key={q._id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-teal-400">
                  Level {q.targetLevel} • {q.difficulty}
                </span>
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
              <span className="text-[11px] text-slate-500 font-mono uppercase">
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
        ))}
      </div>

      {/* Create Problem Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
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
                  placeholder="Describe the problem, inputs, and desired algorithm clearly..."
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
                  <label className="block text-slate-400 mb-1 font-semibold">Target Level</label>
                  <select
                    value={formData.targetLevel}
                    onChange={(e) => setFormData({ ...formData, targetLevel: Number(e.target.value) })}
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
                  className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
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

