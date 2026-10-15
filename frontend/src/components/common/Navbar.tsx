import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Code2,
  LayoutDashboard,
  Calendar,
  BookOpen,
  Award,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  Bell,
  Menu,
  X,
  Layers,
  GraduationCap,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const isStudent = user.role === 'student';

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center space-x-3">
            <Link
              to={isStudent ? '/student/total-courses' : user.role === 'faculty' ? '/admin/exams' : '/admin/overview'}
              className="flex items-center space-x-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-xs">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                  College Assessment
                </span>
                <span className="text-[11px] text-slate-500 font-medium block leading-none">Programming Portal</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 ml-6">
              {isStudent && (
                <>
                  <Link
                    to="/student/total-courses"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/student/total-courses')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Total Courses</span>
                  </Link>

                  <Link
                    to="/student/my-courses"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/student/my-courses') || location.pathname.startsWith('/student/course/')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>My Courses</span>
                  </Link>

                </>
              )}

              {user.role === 'faculty' && (
                <>
                  <Link
                    to="/admin/exams"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/exams')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Exams</span>
                  </Link>
                  <Link
                    to="/admin/attendance"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/attendance')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Attendance</span>
                  </Link>
                </>
              )}

              {user.role !== 'student' && user.role !== 'faculty' && (
                <>
                  <Link
                    to="/admin/overview"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/overview')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview</span>
                  </Link>
                  <Link
                    to="/admin/students"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/students')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Students</span>
                  </Link>
                  <Link
                    to="/admin/languages"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/languages')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Languages</span>
                  </Link>
                  <Link
                    to="/admin/questions"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/questions')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Questions</span>
                  </Link>
                  <Link
                    to="/admin/exams"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/exams')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Exams</span>
                  </Link>
                  <Link
                    to="/admin/attendance"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/attendance')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Attendance</span>
                  </Link>
                  <Link
                    to="/admin/results"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin/results')
                        ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Results</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/security"
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                        isActive('/admin/security')
                          ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Security & Audit</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">
                {user.firstName} {user.lastName}
              </span>
              <div className="flex items-center space-x-1.5 justify-end">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {user.role}
                </span>
                {user.studentId && (
                  <span className="text-xs text-slate-500 font-mono">
                    {user.studentId}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-3 space-y-1 shadow-lg">
          {isStudent ? (
            <>
              <Link
                to="/student/total-courses"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Total Courses
              </Link>
              <Link
                to="/student/my-courses"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                My Courses
              </Link>
            </>
          ) : user.role === 'faculty' ? (
            <>
              <Link
                to="/admin/exams"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Exams
              </Link>
              <Link
                to="/admin/attendance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Attendance Gate
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/admin/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Overview
              </Link>
              <Link
                to="/admin/students"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Students
              </Link>
              <Link
                to="/admin/languages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Languages
              </Link>
              <Link
                to="/admin/questions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Questions
              </Link>
              <Link
                to="/admin/exams"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Exams
              </Link>
              <Link
                to="/admin/attendance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Attendance Gate
              </Link>
              <Link
                to="/admin/results"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Results
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                >
                  Security & Audit
                </Link>
              )}
            </>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">
              {user.firstName} {user.lastName} ({user.role})
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
