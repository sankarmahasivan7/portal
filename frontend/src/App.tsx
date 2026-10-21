import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Student Pages
import { TotalCourses } from './pages/student/TotalCourses';
import { CourseOverview } from './pages/student/CourseOverview';
import { MyCourses } from './pages/student/MyCourses';
import { LevelDetailPage } from './pages/student/LevelDetailPage';
import { ExamArena } from './pages/student/ExamArena';
import { ExamFeedbackVerification } from './pages/student/ExamFeedbackVerification';
import { ExamResultView } from './pages/student/ExamResultView';
import { SlotHistory } from './pages/student/SlotHistory';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagement } from './pages/admin/StudentManagement';
import { LanguageManagement } from './pages/admin/LanguageManagement';
import { QuestionBank } from './pages/admin/QuestionBank';
import { ExamManagement } from './pages/admin/ExamManagement';
import { AttendanceManagement } from './pages/admin/AttendanceManagement';
import { ResultsReporting } from './pages/admin/ResultsReporting';
import { SecurityAudit } from './pages/admin/SecurityAudit';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({
  children,
  roles
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-teal-600">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <Navigate
        to={
          user.role === 'student'
            ? '/student/total-courses'
            : user.role === 'faculty'
            ? '/admin/exams'
            : '/admin/languages'
        }
        replace
      />
    );
  }

  return <>{children}</>;
};

// Layout wrapper to hide standard Navbar inside ExamArena full-screen room
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isExamRoom = location.pathname.startsWith('/exam/') && !location.pathname.startsWith('/exam/result');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {!isExamRoom && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Public Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route
              path="/student/total-courses"
              element={
                <ProtectedRoute roles={['student']}>
                  <TotalCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/course-overview/:languageSlug"
              element={
                <ProtectedRoute roles={['student']}>
                  <CourseOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-courses"
              element={
                <ProtectedRoute roles={['student']}>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/slot-history"
              element={
                <ProtectedRoute roles={['student']}>
                  <SlotHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/course/:languageId/level/:levelNumber"
              element={
                <ProtectedRoute roles={['student']}>
                  <LevelDetailPage />
                </ProtectedRoute>
              }
            />
            {/* Redirect legacy routes to the two student pages */}
            <Route path="/student/dashboard" element={<Navigate to="/student/total-courses" replace />} />
            <Route path="/student/schedule" element={<Navigate to="/student/my-courses" replace />} />
            <Route
              path="/exam/:examId"
              element={
                <ProtectedRoute roles={['student', 'admin', 'faculty']}>
                  <ExamArena />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/feedback/:sessionId"
              element={
                <ProtectedRoute roles={['student', 'admin', 'faculty']}>
                  <ExamFeedbackVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/result/:sessionId"
              element={
                <ProtectedRoute roles={['student', 'admin', 'faculty']}>
                  <ExamResultView />
                </ProtectedRoute>
              }
            />

            {/* Admin / Faculty Routes */}
            {/* Admin Core Pages: Courses, Questions, Results */}
            <Route
              path="/admin/languages"
              element={
                <ProtectedRoute roles={['admin', 'controller']}>
                  <LanguageManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <ProtectedRoute roles={['admin', 'controller']}>
                  <QuestionBank />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <ProtectedRoute roles={['admin', 'controller']}>
                  <ResultsReporting />
                </ProtectedRoute>
              }
            />

            {/* Faculty Dedicated Pages: Exams & Attendance Gate */}
            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute roles={['faculty', 'admin', 'controller']}>
                  <ExamManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <ProtectedRoute roles={['faculty', 'admin', 'controller']}>
                  <AttendanceManagement />
                </ProtectedRoute>
              }
            />

            {/* Redirects for removed admin pages */}
            <Route path="/admin/overview" element={<Navigate to="/admin/languages" replace />} />
            <Route path="/admin/students" element={<Navigate to="/admin/languages" replace />} />
            <Route path="/admin/security" element={<Navigate to="/admin/languages" replace />} />
            <Route path="/admin/audit-logs" element={<Navigate to="/admin/languages" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/languages" replace />} />

            {/* Default Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
