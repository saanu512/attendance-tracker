Attendance Tracker v119 — Admin student-card click/navigation fix

ATTENDANCE TRACKER — FIREBASE v108 SETUP
========================================

This build is based on Attendance Tracker v103 and adds Firebase Authentication,
Cloud Firestore sync, Student Login, Admin Login, password reset, Sync Now,
automatic sync after save actions, and an Admin Dashboard.

FIREBASE PROJECT
----------------
Project ID: attendance-tracker-3379f
Web app: Attendance Tracker Web
Authentication: Email/Password
Firestore: Standard, default database

CLOUD DATA STRUCTURE
--------------------
attendanceUsers/{uid}
  uid, email, name, rollNumber, course, required, rollLocked,
  edition, theme, schedule, updatedAt

attendanceUsers/{uid}/days/{YYYY-MM-DD}
  date, status, records, note, holiday, overrides, extraClasses, updatedAt

SECURITY
--------
Use firestore.rules in the Firebase Console Rules tab.

Student access is restricted to their own UID.
Admin access requires the Firebase Auth custom claim:
  admin == true

IMPORTANT ADMIN SECURITY NOTE
-----------------------------
Do NOT implement admin by storing a client-editable "isAdmin" field.
The app checks the trusted Firebase Auth custom claim.
The custom claim must be assigned from a trusted Admin SDK environment.

The app intentionally refuses Admin Dashboard access when the signed-in
account does not have the admin claim.

ONE-TIME ADMIN PROVISIONING
---------------------------
1. Create the intended Admin account in Firebase Authentication > Users.
2. Obtain that user's Firebase Auth UID.
3. From a trusted server/Admin SDK environment, set:
     { admin: true }
   as a custom user claim.
4. Sign out/in again so the refreshed ID token contains the claim.

Never put a Firebase service-account private key in this web app.

APP BEHAVIOR
------------
- Student Login is in Settings.
- Admin Login is in Settings.
- Forgot Password is available from the login/account UI.
- Logout is available after sign-in.
- Sync Now is available after sign-in.
- Save Attendance, Save Note, Save Settings, schedule changes,
  class edits, extra classes, holiday changes and edition/settings changes
  trigger cloud synchronization when a user is signed in.
- Local storage remains a temporary/offline cache.
- When an existing cloud profile is found at login, the cloud copy is loaded.
- When no cloud profile exists, the current device data is uploaded to create it.

ADMIN DASHBOARD
---------------
Admin can list students and open a student record.
The student view includes name, roll, email, overall counts,
subject-wise attendance and detailed cloud records with day/date/time,
subject, class type, attendance status and notes.
CSV export and browser Print/Save as PDF are included.

THEME
-----
All Firebase/account/admin pages use the existing theme variables and therefore
follow the currently selected Attendance Tracker edition.

NO GOOGLE DRIVE
---------------
Google Drive is not used.
