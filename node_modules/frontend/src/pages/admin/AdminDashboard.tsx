import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  Activity,
  Cpu,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Code2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/overview');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load administrative overview.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <p className="font-semibold">{error || 'Unable to retrieve administrative metrics.'}</p>
        </div>
      </div>
    );
  }

  const { stats, recentSubmissions } = data;
  const workerHealth = stats.workerHealth;
  const compilers = workerHealth?.details?.compilers || {};

  const chartData = [
    { name: 'Passed', count: stats.passedResults, color: '#10b981' },
    { name: 'Failed', count: stats.failedResults, color: '#f43f5e' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
            <span>Administrative Assessment Control Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time infrastructure metrics, candidate registries, evaluation statistics, and isolated sandbox status.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/exams"
            className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Manage Examinations
          </Link>
          <Link
            to="/admin/questions"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs border border-slate-700 transition"
          >
            Question Bank
          </Link>
        </div>
      </div>

      {/* Compiler & Sandbox Service Health Banner */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl ${
              workerHealth?.healthy
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">Isolated Execution Worker</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  workerHealth?.healthy
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {workerHealth?.healthy ? 'Active & Isolated (Port 5050)' : 'Offline / Error'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict sandboxed process isolation for student compilation and runtime execution.
            </p>
          </div>
        </div>

        {/* Compiler runtime availability badges */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {Object.entries(compilers).map(([lang, isAvail]) => (
            <span
              key={lang}
              className={`px-2 py-1 rounded-lg border flex items-center space-x-1 ${
                isAvail
                  ? 'bg-slate-950 text-teal-300 border-teal-500/30'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-teal-400' : 'bg-slate-600'}`}
              />
              <span className="uppercase">{lang}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Candidates
            </span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white mt-2 block font-mono">
            {stats.totalStudents}
          </span>
          <span className="text-xs text-emerald-400 mt-1 block">
            {stats.activeStudents} Active Accounts
          </span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Assessments
            </span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white mt-2 block font-mono">
            {stats.totalExams}
          </span>
          <span className="text-xs text-indigo-400 mt-1 block">
            {stats.publishedExams} Published & Active
          </span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Submissions
            </span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white mt-2 block font-mono">
            {stats.totalSubmissions}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {stats.totalResults} Verified Sessions
          </span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pass Rate
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2 block font-mono">
            {stats.passPercentage}%
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {stats.passedResults} Passed / {stats.failedResults} Failed
          </span>
        </div>
      </div>

      {/* Visual Analytics & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pass/Fail Breakdown Chart */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Assessment Outcome Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified outcomes according to level passing criteria.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {stats.totalResults === 0 ? (
              <span className="text-xs text-slate-500">No examination attempts recorded yet.</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950">
              <span className="text-[11px] text-emerald-400 block font-semibold">Passed</span>
              <span className="text-base font-bold text-white">{stats.passedResults}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950">
              <span className="text-[11px] text-rose-400 block font-semibold">Failed</span>
              <span className="text-base font-bold text-white">{stats.failedResults}</span>
            </div>
          </div>
        </div>

        {/* Live Submissions Feed */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Real-Time Code Execution Feed</span>
            </h3>
            <Link to="/admin/results" className="text-xs text-teal-400 hover:underline">
              View All Results
            </Link>
          </div>

          {recentSubmissions?.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No student submissions yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {recentSubmissions.map((sub: any) => (
                <div key={sub._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">
                        {sub.studentId?.firstName} {sub.studentId?.lastName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ({sub.studentId?.studentId || sub.studentId?.email})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {sub.questionId?.title || 'Programming Problem'} • Language:{' '}
                      <strong className="text-slate-300 uppercase">{sub.language}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <span className="text-xs font-mono text-slate-300">
                      Score: {sub.score}/{sub.maxScore}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        sub.verdict === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {sub.verdict}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

