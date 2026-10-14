# College Programming Assessment Portal

A self-hostable collegiate programming examination and automated evaluation platform inspired by commercial assessment portals. Developed for colleges to run autonomous programming examinations and curriculum progression using their own local or cloud infrastructure, without reliance on paid third-party examination subscriptions.

---

## 1. Project Overview

The College Programming Assessment Portal is a complete end-to-end examination platform built to facilitate sequential programming milestones for undergraduate and graduate computer science students. It features server-authoritative level progression, strict examination slot scheduling, an integrated Monaco code editor, an isolated sandboxed code execution engine, automatic evaluation against hidden benchmark test cases, and anti-cheating mechanisms including Safe Exam Browser (SEB) profiles and campus IP fencing.

---

## 2. Architecture

```
                  +----------------------------------------------+
                  |         Client Web Application               |
                  |  (React 18 + Vite + TypeScript + Monaco)     |
                  +----------------------+-----------------------+
                                         |
                                         | HTTP / REST (JWT)
                                         v
                  +----------------------------------------------+
                  |            Core API Backend                  |
                  |     (Node.js + Express + TypeScript)         |
                  |  - Auth & RBAC (Admin, Faculty, Student)     |
                  |  - Server-Authoritative Progression Engine   |
                  |  - Server-Side Timed Session Engine          |
                  |  - Audit Logger & In-App Notifications       |
                  +------------+--------------------+------------+
                               |                    |
             Internal HTTP API |                    | Mongoose ODM
       (x-worker-secret token) |                    |
                               v                    v
+------------------------------------+    +----------------------+
|     Isolated Execution Worker      |    |   MongoDB Database   |
| (Dedicated Sandboxed Process Host) |    |  (Persistent Storage)|
| - GCC 14 (C)      - MinGW G++ (C++)|    +----------------------+
| - OpenJDK (Java)  - Python 3.10    |
+------------------------------------+
```

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, `@monaco-editor/react`, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Mongoose ODM, JWT, BcryptJS, Helmet, Morgan, Express Rate Limit.
- **Database**: MongoDB 6.0+ (Indexes, relationships, data validation).
- **Execution Engine**: Dedicated isolated sandbox worker with GCC, G++, Java, and Python runners, strict timeout enforcement, and memory caps.
- **Infrastructure**: Docker Compose, multi-stage Dockerfiles, Nginx reverse proxy.

---

## 4. Project Structure

```
ps portal/
├── backend/                      # Core Express TypeScript API
│   ├── src/
│   │   ├── config/               # Database connection
│   │   ├── controllers/          # Auth, Student, Exam, Admin controllers
│   │   ├── middleware/           # JWT, RBAC, Campus IP, SEB, Error handlers
│   │   ├── models/               # User, Question, Exam, Session, Result, etc.
│   │   ├── routes/               # Express REST routes
│   │   ├── scripts/              # Database seeder (seed.ts)
│   │   ├── services/             # Progression engine, execution client, audit
│   │   ├── tests/                # Automated integration test suite
│   │   └── index.ts              # API server entry point
│   ├── package.json
│   └── tsconfig.json
├── execution-worker/             # Sandboxed Execution Runner
│   ├── src/
│   │   ├── runner/               # Process isolation, GCC/Java/Python runner
│   │   ├── index.ts              # Worker Express API (:5050)
│   │   └── types.ts              # Job and test case schemas
│   ├── package.json
│   └── tsconfig.json
├── frontend/                     # Modern React SPA
│   ├── src/
│   │   ├── api/                  # Axios HTTP client
│   │   ├── components/           # Navbar, modals, badges, UI elements
│   │   ├── context/              # AuthContext & session state
│   │   ├── pages/
│   │   │   ├── auth/             # Login & Student Register
│   │   │   ├── student/          # Dashboard, Schedule, ExamArena, Scorecard
│   │   │   └── admin/            # Overview, Students, Languages, Questions, Exams
│   │   ├── App.tsx               # Route hierarchy and access controls
│   │   └── main.tsx              # React DOM bootstrap
│   ├── package.json
│   └── vite.config.ts
├── infrastructure/
│   ├── docker/                   # Dockerfiles for frontend, backend, worker
│   └── reverse-proxy/            # Nginx reverse proxy config
├── documentation/                # API, Database, Deployment, Security guides
├── docker-compose.yml            # Multi-container orchestration
└── package.json                  # Root npm workspace configuration
```

---

## 5. Prerequisites

- **Node.js**: `v18+` or `v20+`
- **MongoDB**: Community Server running locally or via Docker on port `27017`
- **Compilers / Runtimes**:
  - C / C++: MinGW GCC and G++ in PATH (or CodeBlocks MinGW)
  - Java: JDK 17+ (`javac` and `java` in PATH)
  - Python: Python 3.10+ (`python` in PATH)

---

## 6. Installation Instructions

1. Clone or copy the repository to your workspace.
2. In the project root, install all npm workspace dependencies:
   ```bash
   npm install
   ```

---

## 7. Environment Configuration

Copy `.env.example` to `backend/.env` and `execution-worker/.env`:
- `PORT=5000`
- `NODE_ENV=development`
- `MONGODB_URI=mongodb://localhost:27017/college_assessment_db`
- `JWT_SECRET=college_ps_portal_super_secure_jwt_secret_change_in_prod`
- `EXECUTION_WORKER_URL=http://localhost:5050`
- `EXECUTION_WORKER_SECRET=isolated_worker_internal_secret_998877`
- `DEFAULT_TIMEZONE=Asia/Kolkata`
- `COLLEGE_NETWORK_RANGES=127.0.0.1,::1,10.0.0.0/8,192.168.0.0/16`
- `SEB_QUIT_PASSWORD=CollegeExamSEBQuitPass2026`

---

## 8. Database Setup

Ensure MongoDB is running locally:
```powershell
Get-Service -Name MongoDB
```
Or run MongoDB via Docker:
```bash
docker run -d -p 27017:27017 --name local-mongo mongo:6.0
```

---

## 9. Initial Administrator & Seed Creation

Seed the database with pre-configured administrators, faculty, candidate accounts, languages, questions, and examinations:
```bash
npm run seed
```

### Pre-Configured Demo Accounts:
- **System Administrator**: `admin@college.edu` | Password: `Admin@123`
- **Faculty / Question Setter**: `faculty@college.edu` | Password: `Faculty@123`
- **Candidate Student 1**: `student1@college.edu` | Password: `Student@123`
- **Candidate Student 2**: `student2@college.edu` | Password: `Student@123`

---

## 10. Local Development Instructions

Start all three services simultaneously (Execution Worker, Backend API, and Frontend Vite dev server):
```bash
npm run dev
```

Or run them individually in separate terminal windows:
```bash
# Terminal 1: Isolated Execution Worker
npm run dev:worker

# Terminal 2: Core Backend API
npm run dev:backend

# Terminal 3: React Frontend Application
npm run dev:frontend
```

Access the application in your browser at:
`http://localhost:5173`

---

## 11. Code Execution Setup

The isolated execution worker (`execution-worker/`) runs on port 5050. When a student executes or submits code:
1. The code is sent via internal HTTP API with `x-worker-secret`.
2. The worker allocates a unique sandbox folder in `temp_sandbox/<uuid>/`.
3. The source code is compiled (using `gcc`, `g++`, or `javac`) or interpreted (`python`).
4. Test cases are fed via standard input (`stdin`) with wall-clock timeout controls (`4000ms`).
5. Process trees are terminated cleanly to prevent hanging or runaway processes.
6. Temporary folders are purged immediately after execution.

---

## 12. Language Support Configuration

- Initial supported languages: **C** (6 levels), **C++** (6 levels), **Java** (6 levels), **Python** (6 levels), **JavaScript** (4 levels).
- Administrators can enable or configure new languages via the admin interface (`/admin/languages`). The platform automatically verifies compiler availability before enabling any language.

---

## 13. Question Creation

- Administrators and faculty can author questions via `/admin/questions`.
- Supports: Problem statement, input/output formats, constraints, example test cases, public test cases, and hidden benchmark test cases with custom weights.
- **Security Guarantee**: Hidden test case inputs and expected outputs are never returned to student-facing APIs.

---

## 14. Examination Creation

- Create exams via `/admin/exams` by specifying Language, Level Number (1 to 6), Duration (in minutes), Passing Cutoff Percentage, and attaching questions.
- Assign examination slots with start/end times and seat capacities.
- Set publication status to make exams available to candidates.

---

## 15. Slot Registration

- Students view eligible exams and available slots at `/student/schedule`.
- Registrations are processed atomically on the backend, preventing overbooking and duplicate registrations.

---

## 16. Level Progression Rules

1. **Level 1**: Open to all eligible student accounts with no prerequisite.
2. **Level 2 to 6**: Strictly locked until the student achieves a passing result in the preceding level.
3. **Independent Progression**: Passing Level 1 in C does not unlock Level 2 in Python.
4. **Server-Authoritative**: Client-side tampering, localStorage editing, or API manipulation cannot unlock levels.

---

## 17. Safe Exam Browser (SEB) Integration

- Supports Safe Exam Browser configuration files (`.seb`) and request header validation (`X-SafeExamBrowser-RequestHash`, `X-SafeExamBrowser-ConfigKeyHash`).
- Download the official `.seb` profile from `/admin/security` or `/api/admin/seb/download-config`.
- Development mode allows bypass for rapid local testing.

---

## 18. College-Network Restrictions

- Fences assessment access to designated campus IP ranges (CIDR blocks e.g. `10.0.0.0/8`, `192.168.0.0/16`, `127.0.0.1`).
- Administrators are exempt to maintain emergency recovery access.

---

## 19. Security Limitations

- Network restrictions and browser lock-down tools provide defense-in-depth, but do not prevent external device usage (e.g. smartphones). Physical invigilation remains necessary for formal high-stakes assessments.

---

## 20. Production Deployment

Deploy with Docker Compose:
```bash
docker compose up -d --build
docker compose exec backend npm run seed
```

---

## 21. Backup and Recovery

- **Backup**: `mongodump --db college_assessment_db --out /path/to/backup`
- **Restore**: `mongorestore --db college_assessment_db /path/to/backup/college_assessment_db`

---

## 22. Troubleshooting

- **Compiler unavailable in execution worker**: Ensure GCC, G++, Java, or Python are installed and their paths match `execution-worker/.env`.
- **Examination slot says locked**: Verify the student has passed the previous level in that specific language track.

---

## 23. Testing Instructions

Run automated test suites:
```bash
# Backend integration test suite (Auth, RBAC, Level Progression, Sessions, Security)
npm --prefix backend test

# Execution worker unit test suite (GCC, G++, Java, Python, Timeouts, Runtime Errors)
npm --prefix execution-worker test

# Or run all tests together:
npm run test
```

