import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Zap,
  Search,
  Check,
  CheckCircle2,
  X,
  BookOpen,
  Clock,
  Building,
  User,
  AlertCircle,
  ChevronRight,
  Code2,
  Sparkles
} from 'lucide-react';

interface StudentInfo {
  _id?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
}

interface ExamSlot {
  _id: string;
  slotNumber: number;
  labName: string;
  timeWindow: string;
}

interface ExamItem {
  _id: string;
  title: string;
  description: string;
  levelNumber: number;
  passingPercentage: number;
  durationMinutes: number;
  isPublished: boolean;
  languageId: {
    _id: string;
    name: string;
    slug: string;
  };
  slots: ExamSlot[];
}

interface AssignCourseExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  preSelectedStudent?: StudentInfo | null;
  currentLab?: string;
  currentTiming?: string;
  preSelectedExamId?: string;
}

export const AssignCourseExamModal: React.FC<AssignCourseExamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preSelectedStudent,
  currentLab,
  currentTiming,
  preSelectedExamId
}) => {
  const [studentInput, setStudentInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(null);
  const [studentSuggestions, setStudentSuggestions] = useState<StudentInfo[]>([]);
  const [isSearchingStudents, setIsSearchingStudents] = useState(false);

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);

  const [labName, setLabName] = useState(
    currentLab && currentLab !== 'all' ? currentLab : 'Lab 1'
  );
  const [timeWindow, setTimeWindow] = useState(currentTiming || '09:15 to 10:15');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (!isOpen) {
      setStudentInput('');
      setSelectedStudent(null);
      setSelectedExam(null);
      setErrorMsg(null);
      setCourseSearch('');
      setStudentSuggestions([]);
      return;
    }

    if (preSelectedStudent) {
      setSelectedStudent(preSelectedStudent);
      setStudentInput(preSelectedStudent.studentId || preSelectedStudent.email || '');
    } else {
      setSelectedStudent(null);
      setStudentInput('');
    }

    if (currentLab && currentLab !== 'all') {
      setLabName(currentLab);
    }
    if (currentTiming) {
      setTimeWindow(currentTiming);
    }

    // Fetch published exams for course selection
    const fetchExams = async () => {
      try {
        setIsLoadingExams(true);
        const res = await api.get('/admin/exams');
        if (res.data.success) {
          const published = (res.data.exams || []).filter((e: ExamItem) => e.isPublished);
          setExams(published);

          if (preSelectedExamId) {
            const match = published.find((e: ExamItem) => e._id === preSelectedExamId);
            if (match) setSelectedExam(match);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch exams for assignment', err);
      } finally {
        setIsLoadingExams(false);
      }
    };

    fetchExams();
  }, [isOpen, preSelectedStudent, preSelectedExamId, currentLab, currentTiming]);

  // Search students by input with debounce
  useEffect(() => {
    if (!studentInput || selectedStudent) {
      setStudentSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingStudents(true);
        const res = await api.get('/admin/attendance/search-students', {
          params: { query: studentInput }
        });
        if (res.data.success) {
          setStudentSuggestions(res.data.students || []);
        }
      } catch (err) {
        // Silently catch suggestion errors
      } finally {
        setIsSearchingStudents(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [studentInput, selectedStudent]);

  if (!isOpen) return null;

  // Filter exams by course search
  const filteredExams = exams.filter((exam) => {
    const q = courseSearch.toLowerCase();
    const langName = exam.languageId?.name?.toLowerCase() || '';
    const langSlug = exam.languageId?.slug?.toLowerCase() || '';
    const title = exam.title.toLowerCase();
    const levelStr = `level ${exam.levelNumber}`;
    return !q || langName.includes(q) || langSlug.includes(q) || title.includes(q) || levelStr.includes(q);
  });

  // Group exams by course / language
  const coursesMap = new Map<string, { languageName: string; slug: string; exams: ExamItem[] }>();
  filteredExams.forEach((exam) => {
    const langKey = exam.languageId?.slug || 'other';
    const langName = exam.languageId?.name || 'Curriculum Track';
    if (!coursesMap.has(langKey)) {
      coursesMap.set(langKey, { languageName: langName, slug: langKey, exams: [] });
    }
    coursesMap.get(langKey)!.exams.push(exam);
  });
  const courseGroups = Array.from(coursesMap.values());

  const handleSelectStudentSuggestion = (st: StudentInfo) => {
    setSelectedStudent(st);
    setStudentInput(st.studentId || st.email || '');
    setStudentSuggestions([]);
  };

  const handleClearSelectedStudent = () => {
    setSelectedStudent(null);
    setStudentInput('');
    setStudentSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const identifier = selectedStudent?.studentId || selectedStudent?.email || studentInput.trim();
    if (!identifier) {
      setErrorMsg('Please enter or select a Student ID.');
      return;
    }

    if (!selectedExam) {
      setErrorMsg('Please select a course & examination to assign.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/admin/attendance/assign-course-exam', {
        studentIdentifier: identifier,
        examinationId: selectedExam._id,
        labName,
        timeWindow
      });

      if (res.data.success) {
        onSuccess(
          res.data.message ||
            `Successfully assigned ${selectedExam.title} to student! Attendance verified Present.`
        );
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to assign course examination.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Zap className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Assign Fast-Track Course Test</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wide">
                  Lab Optimization
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cleared in 20 minutes? Assign another course assessment immediately for the remaining lab time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Student Identification */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Step 1: Student Identification (Roll No / ID)
            </label>

            {selectedStudent ? (
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-mono">
                        {selectedStudent.studentId || 'ID'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {selectedStudent.email} {selectedStudent.department ? `• ${selectedStudent.department}` : ''}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelectedStudent}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline ml-2"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Student ID (e.g. STU001, 2024CS01) or search by name..."
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                  {isSearchingStudents && (
                    <div className="absolute right-3 top-3">
                      <div className="w-4 h-4 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Autocomplete Dropdown Suggestions */}
                {studentSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-20 max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {studentSuggestions.map((st) => (
                      <div
                        key={st._id}
                        onClick={() => handleSelectStudentSuggestion(st)}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">
                            {st.firstName} {st.lastName}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-2 font-mono">
                            ({st.studentId})
                          </span>
                        </div>
                        <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          Select
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: Course & Examination Search & Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 2: Search Courses & Click To Assign
              </label>
              {selectedExam && (
                <span className="text-xs font-bold text-teal-700 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Selected: {selectedExam.languageId?.name} (Level {selectedExam.levelNumber})</span>
                </span>
              )}
            </div>

            {/* Course Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search course tracks (e.g. Python, Java, C++, C, Level 1)..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>

            {/* Courses & Levels List */}
            {isLoadingExams ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                <span className="text-xs">Loading available course tracks & exams...</span>
              </div>
            ) : courseGroups.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                No active published course examinations found matching &quot;{courseSearch}&quot;.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {courseGroups.map((group) => (
                  <div
                    key={group.slug}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-xs uppercase">
                          {group.slug.slice(0, 2)}
                        </div>
                        <span className="font-bold text-xs text-slate-900">
                          {group.languageName} Course
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {group.exams.length} Level {group.exams.length === 1 ? 'Exam' : 'Exams'}
                      </span>
                    </div>

                    {/* Level Examination Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.exams.map((exam) => {
                        const isSelected = selectedExam?._id === exam._id;

                        return (
                          <div
                            key={exam._id}
                            onClick={() => setSelectedExam(exam)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-start justify-between ${
                              isSelected
                                ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-500/20 text-teal-900 shadow-xs'
                                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-xs">
                                  Level {exam.levelNumber}:
                                </span>
                                <span className="text-xs truncate max-w-[150px] font-medium">
                                  {exam.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 block">
                                {exam.durationMinutes} mins • Passing: {exam.passingPercentage}%
                              </span>
                            </div>

                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: Lab & Slot Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Step 3: Lab Room & Timing (Current Lab Session)
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-semibold">Assigned Lab</label>
                <div className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900">
                  <Building className="w-4 h-4 text-teal-600" />
                  <span>{labName}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-semibold">Slot Window</label>
                <div className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>{timeWindow}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Attendance is verified <strong>Present</strong> instantly upon assignment. The student can launch the test arena without delay.</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !selectedExam || (!selectedStudent && !studentInput.trim())}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-sm hover:shadow flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Authorizing Fast-Track Test...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Confirm & Authorize Test Immediately</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AssignCourseExamModal;
