# Deployment & Self-Hosting Guide: College Programming Assessment Portal

This platform is completely self-hostable on college-controlled infrastructure with zero dependence on paid third-party examination platform subscriptions.

---

## 1. Local Development on Windows

### Prerequisites
1. **Node.js**: v18+ or v20+ (`node -v`)
2. **MongoDB Community Server**: Running locally on port `27017`
3. **C/C++ Compilers**: MinGW GCC & G++ (e.g. `C:\Program Files\CodeBlocks\MinGW\bin\gcc.exe`)
4. **Java Development Kit**: JDK 17+ (`javac` and `java` in PATH)
5. **Python 3**: Python 3.10+ in PATH

### Quick Start Commands
```powershell
# 1. Install all dependencies across all packages
npm install

# 2. Seed database with initial administrators, languages, questions, and exams
npm run seed

# 3. Start all three services concurrently (Execution Worker :5050, Backend :5000, Frontend :5173)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 2. Production Self-Hosted Deployment (Docker Compose)

For production deployment on a Linux server or Windows Server running Docker:

### 1. Configure Environment
Review `.env` in root:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/college_assessment_db
JWT_SECRET=replace_with_a_secure_long_random_key_in_production
EXECUTION_WORKER_URL=http://execution-worker:5050
EXECUTION_WORKER_SECRET=isolated_worker_internal_secret_998877
DEFAULT_TIMEZONE=Asia/Kolkata
COLLEGE_NETWORK_RANGES=10.0.0.0/8,192.168.0.0/16,127.0.0.1
SEB_QUIT_PASSWORD=CollegeExamSEBQuitPass2026
```

### 2. Launch Services
```bash
docker compose up -d --build
```

### 3. Run Initial Seed inside Backend Container
```bash
docker compose exec backend npm run seed
```

### 4. Verify Services
- **Frontend / Portal**: `http://<SERVER_IP>:80`
- **Backend API**: `http://<SERVER_IP>:5000/health`
- **Worker**: Internal only (not exposed to public internet for security)
- **Database**: Persistent storage mounted to `mongo_data` volume.

---

## 3. Database Backup & Disaster Recovery

### Create a Database Backup
```bash
# Docker environment:
docker compose exec mongo mongodump --db college_assessment_db --out /data/db/backup_$(date +%F)

# Standalone Windows environment:
mongodump --db college_assessment_db --out C:\backups\college_assessment_db
```

### Restore Database
```bash
# Docker environment:
docker compose exec mongo mongorestore --db college_assessment_db /data/db/backup_<DATE>/college_assessment_db

# Standalone Windows environment:
mongorestore --db college_assessment_db C:\backups\college_assessment_db
```

---

## 4. Upgrades & Maintenance
To update application code or compiler versions:
```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```
All student registrations, question banks, and level progressions are safely preserved in the persistent volume.

