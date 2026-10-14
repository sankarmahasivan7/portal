# REST API Specification: College Programming Assessment Portal

All API routes are prefixed with `/api`. Authentication is passed via `Authorization: Bearer <JWT_TOKEN>`.

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/login`
- **Description**: Authenticate user and receive a JWT token.
- **Request Body**:
  ```json
  {
    "email": "student1@college.edu",
    "password": "Student@123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "661b...",
      "email": "student1@college.edu",
      "role": "student",
      "firstName": "Aarav",
      "lastName": "Sharma",
      "studentId": "CS2026-001"
    }
  }
  ```

### `POST /api/auth/register`
- **Description**: Self-registration for student candidates (when permitted by platform configuration).
- **Request Body**:
  ```json
  {
    "firstName": "Priya",
    "lastName": "Patel",
    "email": "priya.p@college.edu",
    "password": "Password123",
    "studentId": "CS2026-002",
    "department": "Computer Science and Engineering",
    "batch": "2022-2026",
    "enrollmentNumber": "ENR2026002"
  }
  ```

### `GET /api/auth/me`
- **Description**: Get current authenticated user profile and enrollment details.
- **Headers**: `Authorization: Bearer <TOKEN>`

---

## 2. Student Endpoints (`/api/student`)

### `GET /api/student/dashboard`
- **Description**: Returns live student profile, per-language progression status, registered slots, recent scorecards, and in-app notifications.
- **Headers**: `Authorization: Bearer <TOKEN>` (Role: `student`)

### `GET /api/student/notifications`
- **Description**: Fetch in-app notifications for the student.

### `PATCH /api/student/notifications/:id/read`
- **Description**: Mark a notification as read.

---

## 3. Examination & Session Endpoints (`/api/exams`)

### `GET /api/exams/available`
- **Description**: List all published examinations annotated with student eligibility (unlocked vs locked level indicator) and active registrations.

### `GET /api/exams/:id`
- **Description**: Retrieve examination details, instructions, and available slots.

### `POST /api/exams/:id/register`
- **Description**: Atomic examination slot booking. Verifies prerequisite eligibility and slot capacity.
- **Request Body**: `{ "slotId": "661b..." }`

### `POST /api/exams/:id/cancel-registration`
- **Description**: Cancel registration and decrement slot registered count.

### `POST /api/exams/:id/start-session`
- **Description**: Start an authoritative timed examination session. Enforces SEB verification and slot time windows.
- **Response**: `{ "success": true, "sessionId": "...", "deadline": "2026-10-14T11:00:00Z" }`

### `GET /api/exams/session/:sessionId`
- **Description**: Retrieve active session data. Returns sanitized questions (**hidden test cases are strictly filtered out**), remaining seconds, and autosaved code drafts.

### `POST /api/exams/session/:sessionId/draft`
- **Description**: Autosave question code draft.
- **Request Body**: `{ "questionId": "...", "language": "c", "code": "..." }`

### `POST /api/exams/session/:sessionId/run`
- **Description**: Run student code against public test cases or custom input in isolated execution worker.
- **Request Body**: `{ "questionId": "...", "language": "c", "code": "...", "customInput": "4 7" }`

### `POST /api/exams/session/:sessionId/submit`
- **Description**: Submit answer to a problem. Evaluates all public and hidden test cases on the isolated worker, calculates question score, and records submission.

### `POST /api/exams/session/:sessionId/finalize`
- **Description**: Finalize examination session. Aggregates scores, verifies passing percentage, and triggers server-authoritative level unlock if passed.

### `GET /api/exams/session/:sessionId/result`
- **Description**: Returns verified examination scorecard.

---

## 4. Administrative Endpoints (`/api/admin`)

- `GET /api/admin/overview`: Overview statistics (candidate counts, pass/fail ratios, worker health).
- `GET /api/admin/students`: List candidates with search and pagination.
- `POST /api/admin/students`: Create candidate account.
- `POST /api/admin/students/import-csv`: Bulk import students via CSV text.
- `GET /api/admin/students/export-csv`: Export student roster to CSV file.
- `GET /api/admin/languages`: View all programming languages and compiler status.
- `PATCH /api/admin/languages/:id`: Enable or disable language track.
- `GET /api/admin/questions`: Browse question bank with level filters.
- `POST /api/admin/questions`: Author new problem with public and hidden test cases.
- `GET /api/admin/exams`: List all scheduled examinations.
- `POST /api/admin/exams`: Create and publish examination with slots.
- `PATCH /api/admin/exams/:id/publish`: Toggle exam publication status.
- `GET /api/admin/results`: View all examination scorecards.
- `GET /api/admin/results/export-csv`: Download complete assessment grades as CSV.
- `GET /api/admin/audit-logs`: Audit log inspection.
- `GET /api/admin/config`: View campus network IP ranges and SEB settings.
- `PUT /api/admin/config`: Update security policies.
- `GET /api/admin/seb/download-config`: Download official Safe Exam Browser `.seb` profile.

