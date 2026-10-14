import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  ShieldCheck,
  Download,
  Save,
  Globe,
  Lock,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';

export const SecurityAudit: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editable config state
  const [ipRangesInput, setIpRangesInput] = useState('');
  const [sebEnforced, setSebEnforced] = useState(false);
  const [sebQuitPassword, setSebQuitPassword] = useState('');
  const [allowSelfReg, setAllowSelfReg] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [logsRes, configRes] = await Promise.all([
        api.get('/admin/audit-logs?limit=50'),
        api.get('/admin/config')
      ]);

      if (logsRes.data.success) setLogs(logsRes.data.logs);
      if (configRes.data.success) {
        const cfg = configRes.data.config;
        setConfig(cfg);
        setIpRangesInput((cfg.collegeNetworkRanges || []).join(', '));
        setSebEnforced(cfg.sebEnforced || false);
        setSebQuitPassword(cfg.sebQuitPassword || 'CollegeExamQuit2026');
        setAllowSelfReg(cfg.allowStudentSelfRegistration ?? true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error fetching security data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ranges = ipRangesInput.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.put('/admin/config', {
        collegeNetworkRanges: ranges,
        sebEnforced,
        sebQuitPassword,
        allowStudentSelfRegistration: allowSelfReg
      });
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Platform security configurations updated.' });
        fetchData();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    }
  };

  const handleDownloadSeb = () => {
    window.open('/api/admin/seb/download-config', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <span>Campus Security Policies & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            College network IP fencing, Safe Exam Browser profiles, and tamper-resistant audit logs.
          </p>
        </div>

        <button
          onClick={handleDownloadSeb}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
        >
          <Download className="w-4 h-4" />
          <span>Download Safe Exam Browser (.seb) Profile</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Security Policies Form */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Globe className="w-5 h-5 text-teal-400" />
          <span>College Network Access & Browser Constraints</span>
        </h2>

        <form onSubmit={handleSaveConfig} className="space-y-5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Authorized Campus Network IP Ranges / Subnets (CIDR)
            </label>
            <input
              type="text"
              value={ipRangesInput}
              onChange={(e) => setIpRangesInput(e.target.value)}
              placeholder="127.0.0.1, ::1, 10.0.0.0/8, 192.168.0.0/16"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Comma-separated list of IPv4 and IPv6 CIDR subnets. Administrators remain exempt for emergency recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
              <input
                type="checkbox"
                id="sebCheck"
                checked={sebEnforced}
                onChange={(e) => setSebEnforced(e.target.checked)}
                className="mt-0.5 rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-0"
              />
              <label htmlFor="sebCheck" className="cursor-pointer">
                <span className="font-semibold text-white block">Safe Exam Browser Enforcement</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Restricts examinations to the official Safe Exam Browser environment. (In development mode, requests are passed with informational headers).
                </span>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
              <input
                type="checkbox"
                id="selfRegCheck"
                checked={allowSelfReg}
                onChange={(e) => setAllowSelfReg(e.target.checked)}
                className="mt-0.5 rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-0"
              />
              <label htmlFor="selfRegCheck" className="cursor-pointer">
                <span className="font-semibold text-white block">Open Student Self-Registration</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  When enabled, candidates can create their own accounts via the registration page.
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">SEB Quit Password</label>
            <input
              type="text"
              value={sebQuitPassword}
              onChange={(e) => setSebQuitPassword(e.target.value)}
              className="w-full max-w-sm px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Security Policies</span>
          </button>
        </form>
      </div>

      {/* Security Audit Trail */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Activity className="w-5 h-5 text-teal-400" />
          <span>Security & Operational Audit Log</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-bold text-teal-300">
                      {log.action}
                    </td>
                    <td className="px-4 py-2.5 text-white">{log.userEmail || 'System'}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                        {log.role || 'GUEST'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
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

