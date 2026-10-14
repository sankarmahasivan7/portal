import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Award,
  Download,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export const ResultsReporting: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      let query = '';
      if (levelFilter) query += `&level=${levelFilter}`;
      if (languageFilter) query += `&languageId=${languageFilter}`;
      if (statusFilter) query += `&passed=${statusFilter}`;

      const [resResults, resLangs] = await Promise.all([
        api.get(`/admin/results?${query}`),
        api.get('/admin/languages')
      ]);

      if (resResults.data.success) setResults(resResults.data.results);
      if (resLangs.data.success) setLanguages(resLangs.data.languages);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error fetching results.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [levelFilter, languageFilter, statusFilter]);

  const handleExportCsv = () => {
    window.open('/api/admin/results/export-csv', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Award className="w-6 h-6 text-teal-400" />
            <span>Assessment Results & Grade Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative examination records, verified scorecards, and historical progression data.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs border border-slate-700 flex items-center space-x-1.5 shadow-md transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Scorecards to CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <Filter className="w-4 h-4 text-slate-500 ml-2" />

        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-white px-3 py-2 focus:outline-none"
        >
          <option value="">All Programming Languages</option>
          {languages.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-white px-3 py-2 focus:outline-none"
        >
          <option value="">All Levels</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4</option>
          <option value="5">Level 5</option>
          <option value="6">Level 6</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-white px-3 py-2 focus:outline-none"
        >
          <option value="">All Outcomes</option>
          <option value="true">Passed Only</option>
          <option value="false">Failed Only</option>
        </select>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Examination</th>
                <th className="px-5 py-3.5">Language & Level</th>
                <th className="px-5 py-3.5">Marks Obtained</th>
                <th className="px-5 py-3.5">Percentage</th>
                <th className="px-5 py-3.5">Verdict</th>
                <th className="px-5 py-3.5">Verified At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No results recorded for the selected criteria.
                  </td>
                </tr>
              ) : (
                results.map((res) => (
                  <tr key={res._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">
                        {res.studentId?.firstName} {res.studentId?.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {res.studentId?.studentId || res.studentId?.email}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">
                      {res.examinationId?.title}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-teal-300">
                      {res.languageId?.name} • Level {res.levelNumber}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-200">
                      {res.obtainedMarks} / {res.totalMarks}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {res.percentage}%
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          res.passed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {res.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">
                      {new Date(res.verifiedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

