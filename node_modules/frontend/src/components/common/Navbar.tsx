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
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const isStudent = user.role === 'student';
  const isAdminOrFaculty = ['admin', 'faculty', 'controller'].includes(user.role);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center space-x-3">
            <Link to={isStudent ? '/student/dashboard' : '/admin/overview'} className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                  College Assessment
                </span>
                <span className="text-xs text-slate-400 block leading-none">Self-Hosted Platform</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 ml-6">
              {isStudent && (
                <>
                  <Link
                    to="/student/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/student/dashboard')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/student/schedule"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/student/schedule')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Examinations</span>
                  </Link>
                </>
              )}

              {isAdminOrFaculty && (
                <>
                  <Link
                    to="/admin/overview"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/overview')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview</span>
                  </Link>
                  <Link
                    to="/admin/students"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/students')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Students</span>
                  </Link>
                  <Link
                    to="/admin/languages"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/languages')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Languages</span>
                  </Link>
                  <Link
                    to="/admin/questions"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/questions')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Questions</span>
                  </Link>
                  <Link
                    to="/admin/exams"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/exams')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Exams</span>
                  </Link>
                  <Link
                    to="/admin/results"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/results')
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Results</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/security"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                        isActive('/admin/security')
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
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
              <span className="text-sm font-semibold text-white">
                {user.firstName} {user.lastName}
              </span>
              <div className="flex items-center space-x-1.5 justify-end">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-teal-500/30">
                  {user.role}
                </span>
                {user.studentId && (
                  <span className="text-xs text-slate-400 font-mono">
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
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-3 space-y-1">
          {isStudent ? (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/student/schedule"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Examinations
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/admin/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Overview
              </Link>
              <Link
                to="/admin/students"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Students
              </Link>
              <Link
                to="/admin/languages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Languages
              </Link>
              <Link
                to="/admin/questions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Questions
              </Link>
              <Link
                to="/admin/exams"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Exams
              </Link>
              <Link
                to="/admin/results"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Results
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {user.firstName} {user.lastName} ({user.role})
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-sm text-rose-400 hover:text-rose-300 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

