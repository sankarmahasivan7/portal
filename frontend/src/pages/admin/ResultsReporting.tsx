import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Trophy,
  Award,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  GraduationCap,
  Building,
  Layers,
  Sparkles,
  RefreshCw,
  Star,
  Crown,
  BookOpen,
  Calendar,
  X
} from 'lucide-react';
import { ALL_COLLEGE_DEPARTMENTS } from '../../utils/collegeEmail';

interface ClearedLevel {
  languageId: string;
  languageName: string;
  languageSlug: string;
  levelNumber: number;
  points: number;
  obtainedMarks: number;
  percentage: number;
  passedAt: string;
}

interface RankedStudent {
  studentId: string;
  rollNumber: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  year: number;
  section: string;
  totalPoints: number;
  levelsClearedCount: number;
  highestLevel: number;
  averageScore: number;
  clearedLevels: ClearedLevel[];
  lastPassedAt?: string;
  rank: number;
  badge: string;
}

interface RankingsSummary {
  totalStudents: number;
  rankedStudentsCount: number;
  totalPointsAwarded: number;
  topStudent: RankedStudent | null;
}

export const ResultsReporting: React.FC = () => {
  const [rankings, setRankings] = useState<RankedStudent[]>([]);
  const [departments, setDepartments] = useState<string[]>(ALL_COLLEGE_DEPARTMENTS);
  const [summary, setSummary] = useState<RankingsSummary>({
    totalStudents: 0,
    rankedStudentsCount: 0,
    totalPointsAwarded: 0,
    topStudent: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'points_desc' | 'points_asc' | 'year_asc' | 'year_desc' | 'department_asc' | 'name_asc'>('points_desc');

  const fetchRankings = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      const params: any = {
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        year: yearFilter !== 'all' ? yearFilter : undefined,
        sortBy,
        search: search.trim() ? search.trim() : undefined
      };

      const res = await api.get('/admin/results', { params });

      if (res.data.success) {
        setRankings(res.data.rankings || []);
        if (res.data.summary) setSummary(res.data.summary);
        const incomingDepts = res.data.departments || [];
        setDepartments(Array.from(new Set([...ALL_COLLEGE_DEPARTMENTS, ...incomingDepts])).sort());
      }
    } catch (err: any) {
      console.error('Error fetching rankings:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [departmentFilter, yearFilter, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRankings(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [isExporting, setIsExporting] = useState(false);

  const generateClientSideCsv = () => {
    let csv = 'Rank,RollNumber,CandidateName,Email,Department,Year,TotalPoints,LevelsClearedCount,ClearedLevelsSummary,AverageScore\n';
    if (rankings && rankings.length > 0) {
      rankings.forEach((s, idx) => {
        const clearedSummary = (s.clearedLevels || [])
          .map((cl) => `${cl.languageName} L${cl.levelNumber} (${cl.points} pts)`)
          .join(' | ');
        csv += `"${s.rank || idx + 1}","${s.rollNumber}","${s.name}","${s.email}","${s.department}","Year ${s.year}","${s.totalPoints}","${s.levelsClearedCount}","${clearedSummary}","${s.averageScore}%"\n`;
      });
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    const deptSlug = departmentFilter !== 'all' ? `_${departmentFilter.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : '';
    const yearSlug = yearFilter !== 'all' ? `_year${yearFilter}` : '';
    link.setAttribute('download', `student_academic_rankings${deptSlug}${yearSlug}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const params: any = {};
      if (departmentFilter && departmentFilter !== 'all') params.department = departmentFilter;
      if (yearFilter && yearFilter !== 'all') params.year = yearFilter;
      if (sortBy) params.sortBy = sortBy;
      if (search.trim()) params.search = search.trim();

      const response = await api.get('/admin/results/export-csv', {
        params,
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      const deptSlug = departmentFilter !== 'all' ? `_${departmentFilter.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : '';
      const yearSlug = yearFilter !== 'all' ? `_year${yearFilter}` : '';
      link.setAttribute('download', `student_academic_rankings${deptSlug}${yearSlug}_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.warn('API CSV export error, invoking client fallback:', err);
      generateClientSideCsv();
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentFilter('all');
    setYearFilter('all');
    setSortBy('points_desc');
  };

  const hasActiveFilters = search || departmentFilter !== 'all' || yearFilter !== 'all' || sortBy !== 'points_desc';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Student Academic Leaderboard & Merit Rankings</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Authoritative rankings based on curriculum level progression: Level 1 = 2 Pts, Level 2 = 4 Pts (+2 Pts per level).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            onClick={() => fetchRankings(true)}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center space-x-1.5 transition shadow-xs disabled:opacity-50"
            title="Refresh Leaderboard Records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs border border-teal-500 flex items-center space-x-1.5 shadow-md shadow-teal-900/20 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download CSV report of rankings"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce text-teal-200' : ''}`} />
            <span>{isExporting ? 'Exporting CSV...' : 'Export Rankings to CSV'}</span>
          </button>
        </div>
      </div>

      {/* Summary Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top Ranked Student */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-600/30 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span className="flex items-center space-x-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Rank #1 Leader</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
              Gold
            </span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white truncate">
              {summary.topStudent?.name || 'No records yet'}
            </div>
            <div className="text-xs text-amber-300/80 font-mono flex items-center space-x-1.5 mt-0.5">
              <span>{summary.topStudent?.department || 'Department'}</span>
              <span>•</span>
              <span>Year {summary.topStudent?.year || 'N/A'}</span>
            </div>
          </div>
          <div className="text-xs font-bold text-amber-400 font-mono pt-1">
            {summary.topStudent ? `${summary.topStudent.totalPoints} Total Merit Points` : '0 Points'}
          </div>
        </div>

        {/* Total Ranked Students */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-teal-400" />
              <span>Ranked Candidates</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              Enrolled
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {summary.rankedStudentsCount} <span className="text-xs text-slate-400 font-normal">/ {summary.totalStudents} students</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Candidates with verified assessment level completions.
          </p>
        </div>

        {/* Total Merit Points */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Total Points Awarded</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-teal-950 text-teal-300 border border-teal-800/40 px-2 py-0.5 rounded-full font-bold">
              Campus Score
            </span>
          </div>
          <div className="text-2xl font-extrabold text-teal-300 font-mono">
            {summary.totalPointsAwarded} <span className="text-xs text-slate-400 font-normal font-sans">Pts</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Cumulative merit points earned across all academic courses.
          </p>
        </div>

        {/* Point Rules Card */}
        <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-800/40 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs text-teal-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Points Tier Formula</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono pt-1 text-slate-300">
            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 block text-[9px]">L1</span>
              <strong className="text-teal-300 font-bold">2 Pts</strong>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 block text-[9px]">L2</span>
              <strong className="text-teal-300 font-bold">4 Pts</strong>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 block text-[9px]">L3</span>
              <strong className="text-teal-300 font-bold">6 Pts</strong>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 block text-[9px]">L4</span>
              <strong className="text-teal-300 font-bold">8 Pts</strong>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 block text-[9px]">L5</span>
              <strong className="text-teal-300 font-bold">10 Pts</strong>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 block text-[9px]">L6</span>
              <strong className="text-teal-300 font-bold">12 Pts</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Filters & Sorting Toolbar */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, student ID, email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Department Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <label className="text-slate-400 text-[11px] font-semibold">Dept:</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer max-w-[280px] truncate"
              >
                <option value="all" className="bg-slate-900 text-white">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter (1, 2, 3, 4) */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <label className="text-slate-400 text-[11px] font-semibold">Year:</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Years (1 - 4)</option>
                <option value="1" className="bg-slate-900 text-white">1st Year (Year 1)</option>
                <option value="2" className="bg-slate-900 text-white">2nd Year (Year 2)</option>
                <option value="3" className="bg-slate-900 text-white">3rd Year (Year 3)</option>
                <option value="4" className="bg-slate-900 text-white">4th Year (Year 4)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <label className="text-slate-400 text-[11px] font-semibold">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-teal-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="points_desc" className="bg-slate-900 text-white">Rank: Points (High to Low)</option>
                <option value="points_asc" className="bg-slate-900 text-white">Rank: Points (Low to High)</option>
                <option value="year_asc" className="bg-slate-900 text-white">Year: 1 → 4 (First to Final)</option>
                <option value="year_desc" className="bg-slate-900 text-white">Year: 4 → 1 (Final to First)</option>
                <option value="department_asc" className="bg-slate-900 text-white">Department (A to Z)</option>
                <option value="name_asc" className="bg-slate-900 text-white">Candidate Name (A to Z)</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/40 transition flex items-center space-x-1"
                title="Reset all filters to default"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rankings Leaderboard Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 w-16 text-center">Rank</th>
                <th className="px-5 py-3.5">Candidate Name</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5 text-center">Academic Year</th>
                <th className="px-5 py-3.5">Passed Levels & Points Breakdown</th>
                <th className="px-5 py-3.5 text-center">Levels Cleared</th>
                <th className="px-5 py-3.5 text-center">Avg Score</th>
                <th className="px-5 py-3.5 text-right font-bold text-teal-300">Total Merit Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-teal-500/20 border-t-teal-400 rounded-full animate-spin mx-auto mb-2" />
                    <span>Calculating student rankings and compiling merit ledger...</span>
                  </td>
                </tr>
              ) : rankings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Trophy className="w-8 h-8 text-slate-600" />
                      <span className="font-semibold text-slate-400">No student rankings found</span>
                      <span className="text-[11px] text-slate-500">
                        {search || departmentFilter !== 'all' || yearFilter !== 'all'
                          ? 'No students match your active filter criteria.'
                          : 'No students registered or ranked yet.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                rankings.map((student) => {
                  const isTop1 = student.rank === 1 && student.totalPoints > 0;
                  const isTop2 = student.rank === 2 && student.totalPoints > 0;
                  const isTop3 = student.rank === 3 && student.totalPoints > 0;

                  return (
                    <tr
                      key={student.studentId}
                      className={`transition ${
                        isTop1
                          ? 'bg-amber-950/20 hover:bg-amber-950/30'
                          : isTop2
                          ? 'bg-slate-800/50 hover:bg-slate-800/70'
                          : isTop3
                          ? 'bg-amber-950/10 hover:bg-amber-950/20'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="px-5 py-4 text-center font-bold">
                        {isTop1 ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
                            <span>🥇</span>
                            <span>1st</span>
                          </span>
                        ) : isTop2 ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-300 text-slate-900 shadow-md">
                            <span>🥈</span>
                            <span>2nd</span>
                          </span>
                        ) : isTop3 ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-700/80 text-amber-100 shadow-md">
                            <span>🥉</span>
                            <span>3rd</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-slate-400 font-mono font-bold text-xs">
                            #{student.rank}
                          </span>
                        )}
                      </td>

                      {/* Candidate Name & Roll Number */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                          <span>{student.name}</span>
                          {isTop1 && <Crown className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-teal-300 font-semibold border border-slate-700">
                            {student.rollNumber}
                          </span>
                          <span className="text-slate-500">{student.email}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4 text-slate-300 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[200px]" title={student.department}>
                            {student.department}
                          </span>
                        </div>
                      </td>

                      {/* Academic Year (1, 2, 3, 4) */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                            student.year === 1
                              ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                              : student.year === 2
                              ? 'bg-blue-950/60 text-blue-300 border border-blue-800/50'
                              : student.year === 3
                              ? 'bg-teal-950/60 text-teal-300 border border-teal-800/50'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          }`}
                        >
                          Year {student.year}
                        </span>
                      </td>

                      {/* Levels Cleared with Points Breakdown */}
                      <td className="px-5 py-4">
                        {student.clearedLevels.length === 0 ? (
                          <span className="text-slate-500 italic text-[11px]">
                            No levels cleared yet (0 Pts)
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {student.clearedLevels.map((lvl, lIdx) => (
                              <span
                                key={lIdx}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950 border border-teal-800/50 text-[11px] font-semibold text-slate-200"
                                title={`Completed with ${lvl.percentage}% on ${new Date(lvl.passedAt).toLocaleDateString()}`}
                              >
                                <span className="text-teal-400 font-bold">{lvl.languageName}</span>
                                <span className="text-slate-400">L{lvl.levelNumber}</span>
                                <span className="text-amber-400 font-mono font-bold">
                                  +{lvl.points}p
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Total Levels Cleared */}
                      <td className="px-5 py-4 text-center font-mono font-semibold text-slate-300">
                        {student.levelsClearedCount > 0 ? (
                          <span className="inline-flex items-center space-x-1 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{student.levelsClearedCount} Levels</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">0</span>
                        )}
                      </td>

                      {/* Average Score */}
                      <td className="px-5 py-4 text-center font-mono font-bold text-slate-200">
                        {student.levelsClearedCount > 0 ? `${student.averageScore}%` : '—'}
                      </td>

                      {/* Total Merit Points */}
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono font-black text-sm shadow-xs ${
                            student.totalPoints >= 6
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : student.totalPoints > 0
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                              : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>{student.totalPoints} Pts</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            Displaying <strong>{rankings.length}</strong> students. Merit scoring rule: <strong>Level Number × 2 Points</strong> (Level 1: 2 pts, Level 2: 4 pts, Level 3: 6 pts, etc.)
          </span>
          <span className="text-teal-400 font-mono">
            College Assessment Portal • Live Ranking Engine
          </span>
        </div>
      </div>
    </div>
  );
};
