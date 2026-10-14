# Student Candidate User Guide: College Assessment Portal

## 1. Candidate Login
- Access the portal at `/login` using your institutional email and password (e.g., `student1@college.edu` / `Student@123`).

## 2. Dashboard & Progression Paths
- Your dashboard displays your enrollment profile and live progression matrices across all supported languages (C, C++, Java, Python, JavaScript).
- **Understanding Level Statuses**:
  - `Available` (Teal): Unlocked and ready for assessment registration. Level 1 is available by default without prerequisites!
  - `Locked` (Slate): Prerequisite requirement not yet met. Hover or click to inspect the reason (e.g. "Requires passing Level 1 first").
  - `Registered` (Indigo): You have an active slot reservation.
  - `In progress` (Amber): You have an active examination session. Click "Resume" to re-enter.
  - `Passed` (Emerald): Successfully passed with verified score and date. Next level unlocked!
  - `Failed` (Rose): Passing cutoff was not achieved. You may re-register for an available slot.

## 3. Examination Slot Registration
- Click "Available Examinations" or "Examinations" in the top navigation.
- Browse available published exams.
- Choose your preferred time slot and click "Register for Examination".
- You will receive an in-app confirmation notification.

## 4. Taking the Examination
- When your slot window opens, click "Launch Examination Arena".
- **Interface Overview**:
  - **Left Pane**: Problem description, constraints, input/output formats, and sample test cases.
  - **Center/Right**: Monaco code editor with syntax highlighting, language selector, and automatic indentation.
  - **Top Bar**: Live countdown timer synced directly to the server deadline.
  - **Autosave**: Your code drafts are automatically preserved on the server every few seconds. If your browser accidentally refreshes, your code is safely recovered upon reopening.
  - **Run Public Tests**: Runs your solution against example test cases and shows your output vs expected output.
  - **Submit Answer**: Submits your solution for the problem against all benchmark test cases.
  - **Finish & Submit Exam**: Finalizes your examination session and computes your official grade.

## 5. Reviewing Scorecards
- Upon submitting your examination, you are presented with the verified scorecard detailing your marks obtained, total marks, percentage, and verdict.
- If passed, the next level is automatically unlocked on your dashboard!

