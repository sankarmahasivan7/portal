import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Code2, Lock, Mail, ArrowRight, ShieldCheck, Terminal, GraduationCap } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('student1@college.edu');
  const [password, setPassword] = useState('Student@123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        if (['admin', 'faculty', 'controller'].includes(res.data.user.role)) {
          navigate('/admin/overview');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setRolePreset = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4 shadow-lg shadow-teal-500/5">
          <Code2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          College Programming Assessment Portal
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Independent, self-hostable examination platform for collegiate computer science.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center space-x-2">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Institutional Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition"
                  placeholder="student@college.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Selectors */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <span className="text-xs font-medium text-slate-400 block mb-3 text-center">
              Quick Demo Access Presets:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRolePreset('student1@college.edu', 'Student@123')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 text-slate-300 hover:text-teal-300 transition text-left"
              >
                <GraduationCap className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span className="truncate">Student (Aarav)</span>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset('admin@college.edu', 'Admin@123')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 text-slate-300 hover:text-teal-300 transition text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">Administrator</span>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset('faculty@college.edu', 'Faculty@123')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 text-slate-300 hover:text-teal-300 transition text-left"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Faculty Setter</span>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset('student2@college.edu', 'Student@123')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 text-slate-300 hover:text-teal-300 transition text-left"
              >
                <GraduationCap className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span className="truncate">Student 2 (Priya)</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-400">New student? </span>
            <Link to="/register" className="text-xs text-teal-400 hover:underline font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

