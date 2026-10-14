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
  HardDrive
} from 'lucide-react';

export const LanguageManagement: React.FC = () => {
  const [languages, setLanguages] = useState<any[]>([]);
  const [workerHealth, setWorkerHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
            <span>Programming Languages & Assessment Tracks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven execution limits, level thresholds, and compiler availability verification.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

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
                  <p className="text-xs text-slate-400 mt-1">{lang.description}</p>
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

              <div className="pt-5 border-t border-slate-800/80 mt-5 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Status: <strong className={lang.isEnabled ? 'text-teal-400' : 'text-slate-500'}>{lang.isEnabled ? 'Enabled' : 'Disabled'}</strong>
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
          );
        })}
      </div>
    </div>
  );
};

