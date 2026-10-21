import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Code2, Lock, Mail, User as UserIcon, GraduationCap, CheckCircle2, AlertCircle, Building2, Calendar, ShieldCheck } from 'lucide-react';
import { parseCollegeEmail } from '../../utils/collegeEmail';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    studentId: '',
    enrollmentNumber: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailInfo = parseCollegeEmail(formData.email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-populate firstName if currently empty and valid email is entered
      if (name === 'email') {
        const info = parseCollegeEmail(value);
        if (info.isValid && info.name && !prev.firstName) {
          const capitalized = info.name.charAt(0).toUpperCase() + info.name.slice(1);
          updated.firstName = capitalized;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email pattern
    if (!emailInfo.isValid) {
      setError(emailInfo.error || "Please enter a valid college email matching '<name>.ug.<year>.<dept>@francisxavier.ac.in'.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', {
        ...formData,
        department: emailInfo.departmentName,
        year: emailInfo.year,
        batch: emailInfo.batch
      });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/student/total-courses');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please verify institutional details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 mb-3 shadow-sm">
          <Code2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Student Examination Registration
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Institutional candidate portal for Francis Xavier Engineering College.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* College Email Field with Pattern Guide */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official College Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition ${
                    formData.email
                      ? emailInfo.isValid
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-rose-400 ring-2 ring-rose-400/20'
                      : 'border-slate-300 focus:ring-2 focus:ring-teal-500'
                  }`}
                  placeholder="sangaras.ug.24.it@francisxavier.ac.in"
                />
              </div>

              {/* Real-time Email Verification & Categorization Card */}
              {formData.email && (
                emailInfo.isValid ? (
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-fade-in text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Institutional Email Categorized Successfully</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-white/80 p-2 rounded-lg border border-emerald-200/60">
                        <span className="text-slate-500 block">Department:</span>
                        <strong className="text-slate-900">{emailInfo.departmentName} ({emailInfo.departmentCode?.toUpperCase()})</strong>
                      </div>
                      <div className="bg-white/80 p-2 rounded-lg border border-emerald-200/60">
                        <span className="text-slate-500 block">Academic Standing:</span>
                        <strong className="text-slate-900">{emailInfo.yearLabel} ({emailInfo.batch})</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
                    <strong>Format required:</strong> <code>&lt;name&gt;.ug.&lt;year&gt;.&lt;dept&gt;@francisxavier.ac.in</code>
                    <div className="mt-1 text-slate-600">
                      • <strong>Year:</strong> 26 (1st Yr), 25 (2nd Yr), 24 (3rd Yr), 23 (4th Yr)<br />
                      • <strong>Department:</strong> it (IT), ad (AI&DS), cb (CSBS), me (Mechanical), cv (Civil), cs (CSE)
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Candidate Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Sangaras"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="FX"
                />
              </div>
            </div>

            {/* Student ID & Enrollment Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Student Roll / ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  placeholder={emailInfo.isValid ? `FX${emailInfo.batchCode}${emailInfo.departmentCode?.toUpperCase()}-001` : 'FX24IT-001'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Enrollment No.
                </label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  placeholder={emailInfo.isValid ? `ENR${emailInfo.batchCode}${emailInfo.departmentCode?.toUpperCase()}001` : 'ENR24IT001'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Choose a secure password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (formData.email.length > 0 && !emailInfo.isValid)}
              className="w-full mt-2 flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : 'Register College Account'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link to="/login" className="text-xs text-teal-600 hover:underline font-semibold">
              Sign in with College Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
