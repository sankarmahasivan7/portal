# Administrator & Question Setter User Guide

## 1. Initial Login & Overview
- Log in at `/login` with credentials `admin@college.edu` / `Admin@123`.
- The Overview screen displays:
  - Total candidate count & active status.
  - Active published exams.
  - Overall pass/fail percentage metrics.
  - Execution worker status and compiler detection pills (GCC, G++, Java, Python, Node).

## 2. Candidate Management
- **Add Single Student**: Click "Add Student", enter name, email, student ID, department, batch, and enrollment number.
- **Bulk Import via CSV**: Click "Import CSV", paste student records adhering to the header schema:
  `email,firstName,lastName,studentId,department,batch,enrollmentNumber,password`
- **Reset Credentials**: Locate candidate in the directory, click "Reset Password", and enter the new password.
- **Deactivate Account**: Click "Deactivate" to suspend examination privileges.

## 3. Programming Languages
- Navigate to "Languages".
- Initial tracks supported: **C** (6 levels), **C++** (6 levels), **Java** (6 levels), **Python** (6 levels), **JavaScript** (4 levels).
- To enable a language, click "Enable". The platform will automatically verify that the execution engine compiler is physically present before allowing it to be activated.

## 4. Question Bank Authoring
- Navigate to "Questions" -> Click "Create New Problem".
- Fill in:
  - Title, Problem Statement, Input Format, Output Format, Constraints.
  - Target Level (Level 1 to 6) and Difficulty.
  - Marks (e.g. 100).
  - Public Test Cases (visible to candidates for self-testing).
  - Hidden Benchmark Test Cases (used by the server to calculate official scorecards).

## 5. Examination Scheduling & Slots
- Navigate to "Exams" -> Click "Schedule New Examination".
- Select Language and Level Number.
- Specify duration (in minutes) and passing cutoff percentage (default: 60%).
- Select problems to attach to the examination.
- Configure Examination Slots (Name, Start Time, End Time, Seat Capacity).
- Toggle "Publish Examination" to make it visible to eligible candidates.

## 6. Scorecards & Results
- Navigate to "Results" to review the live ledger of examination outcomes.
- Filter by Language, Level, or Outcome (Passed / Failed).
- Click "Export Scorecards to CSV" to generate institutional academic reports.

## 7. Security & SEB Configuration
- Navigate to "Security & Audit".
- Update campus CIDR IP ranges.
- Toggle Safe Exam Browser enforcement.
- Click "Download Safe Exam Browser (.seb) Profile" to distribute the lock-down file to computer labs.

