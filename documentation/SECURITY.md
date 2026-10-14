# Examination Security & Anti-Cheating Architecture

The College Programming Assessment Portal is engineered with strict, defense-in-depth security principles.

---

## 1. Server-Authoritative Progression & Timer Security

### Client Clock Tampering Protection
- The examination countdown timer is purely decorative on the frontend. The server calculates and persists the authoritative `deadline` timestamp at the moment a session starts (`Math.min(now + duration, slot.endTime)`).
- When any code submission is made, the backend compares server clock against `session.deadline + 15000` (15s latency grace period). If exceeded, the submission is rejected and the session is marked `expired`.
- Altering the client computer clock, modifying localStorage, or editing browser JavaScript has zero effect on the server deadline.

### Accidental Refresh & Network Recovery
- If a candidate accidentally reloads the browser, loses power, or disconnects, the portal matches the student's active session and resumes state seamlessly with accurate remaining seconds.

### Level Progression Server Authority
- Level 1 has no prerequisite.
- Level N (N > 1) can **NEVER** be unlocked via frontend manipulation or direct API tampering.
- Unlocking is triggered only when `ProgressionService.finalizeExamSession()` executes on the backend, calculates the verified score from test runs on the isolated worker, and proves `percentage >= examination.passingPercentage`.
- Progression engine operations are idempotent to prevent race conditions or duplicate awards.

---

## 2. Safe Exam Browser (SEB) Integration

Safe Exam Browser turns any computer into a secured workstation by locking down access to external websites, system shortcuts, dual monitors, and background applications.

### Verification Mechanism
- SEB injects custom HTTP headers on each web request:
  - `X-SafeExamBrowser-RequestHash`: Hash of the request URL salted with the configuration key.
  - `X-SafeExamBrowser-ConfigKeyHash`: SHA256 hash of the `.seb` profile XML.
- The backend middleware verifies these headers against the administrator's configured `sebConfigKey`.
- Administrators can download the official `.seb` configuration directly from the portal at `/api/admin/seb/download-config`.
- In local development mode (`NODE_ENV=development`), requests are permitted with an informative header `X-SEB-Mode: Optional` to facilitate rapid debugging.

### Important Notice on Security Limitations
- As emphasized by academic security engineering, network and browser restrictions alone do not prove physical identity or prevent secondary device usage (e.g. smartphones). Physical invigilation or supervised computer labs remain an essential component of formal examinations.

---

## 3. College Network IP Fencing

- Access to examinations and candidate portals can be restricted to designated college campus network IP ranges (e.g., campus subnets `10.0.0.0/8`, `192.168.0.0/16`, lab IPs).
- The middleware parses `X-Forwarded-For` from reverse proxies and checks IP membership against CIDR blocks.
- **Admin Exemption**: Administrators and accounts with `collegeIpExempt: true` are always permitted access to prevent administrative lockout during emergencies.

---

## 4. Isolated Execution Worker & Code Sandboxing

- Student submitted source code is treated as completely untrusted.
- Code execution is decoupled from the core application backend and delegated to a dedicated execution worker service (port 5050) protected by internal secret headers (`x-worker-secret`).
- Execution features:
  - Per-submission temporary scratch folders (`temp_sandbox/<uuid>`).
  - Strict wall-clock process timeouts (`4000ms` default).
  - Clean process tree termination (`taskkill /F /T` on Windows or `kill -9` on POSIX) to kill runaway processes.
  - Output buffer caps (`512KB`) to defeat infinite output bombs.
  - Immediate file cleanup in `finally` blocks.
  - Hidden test case inputs and expected outputs are **never** returned to the student browser.

