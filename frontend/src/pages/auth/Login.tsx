import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Code2, Lock, Mail, ArrowRight, ShieldCheck, Terminal, GraduationCap, CheckCircle2 } from 'lucide-react';
import { parseCollegeEmail } from '../../utils/collegeEmail';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('sangaras.ug.24.it@francisxavier.ac.in');
  const [password, setPassword] = useState('Student@123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailInfo = parseCollegeEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        if (res.data.user.role === 'faculty') {
          navigate('/admin/exams');
        } else if (['admin', 'controller'].includes(res.data.user.role)) {
          navigate('/admin/overview');
        } else {
          navigate('/student/total-courses');
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 mb-4 shadow-sm">
          <Code2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Francis Xavier Assessment Portal
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in with your institutional college credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Institutional College Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition"
                  placeholder="sangaras.ug.24.it@francisxavier.ac.in"
                />
              </div>

              {/* Categorization Preview */}
              {emailInfo.isValid && (
                <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[11px] font-semibold text-teal-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{emailInfo.departmentName} • {emailInfo.yearLabel}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out cursor-pointer disabled:opacity-50"
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
          <div className="mt-6 pt-6 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-3 text-center">
              Quick Demo Access Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRolePreset('sangaras.ug.24.it@francisxavier.ac.in', 'Student@123')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 hover:border-teal-400 text-teal-800 transition text-left col-span-2 shadow-xs"
              >
                <GraduationCap className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <div className="truncate">
                  <strong className="block text-teal-950">Sangaras (IT - 3rd Year)</strong>
                  <span className="text-[10px] text-teal-700">sangaras.ug.24.it@francisxavier.ac.in</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset('admin@college.edu', 'Admin@123')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-700 hover:text-teal-700 transition text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span className="truncate">Administrator</span>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset('faculty@college.edu', 'Faculty@123')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-700 hover:text-teal-700 transition text-left"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="truncate">Faculty Setter</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-500">New student candidate? </span>
            <Link to="/register" className="text-xs text-teal-600 hover:underline font-semibold">
              Register with College Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
