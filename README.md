Attendance Tracker — v129 manual sync control fix

Functional base
- v126 Admin Dashboard/student-card functionality is preserved.
- Firebase rules and authentication architecture are unchanged.

Sync status
- Account & Cloud successful status uses green text; failed status uses red text.
- Settings → Account & Cloud shows real sync state.
- Green ✓ = syncing / last successful sync.
- Red ✕ = sync failed / unavailable / signed out.
- Last successful sync time is shown.
- Admin Dashboard shows the admin account's sync state.
- Every student card shows that student's last cloud profile sync time.
- The existing automatic sync, reconnect sync, startup/login sync and manual sync remain in place, with a small “↻ Tap to Sync” control in Account & Cloud and Admin Dashboard.

Student detail
- Subject-wise Attendance remains first.
- Month selection is directly below Subject-wise Attendance.
- Attendance status filters are directly below the month selector.
- Daily records are displayed only for the selected month and selected filter.
- Filters: All, Present, Absent, Not Held, Extra Classes, Pending.
- Filtering is display-only and does not modify cloud data.

Theme
- Admin cards use the active edition's card surface instead of forcing a generic dark surface.
- Summary cards inherit the surrounding themed card treatment.

Firebase
- Project: attendance-tracker-3379f
- Firestore structure and security rules are unchanged from v126.
- Admin access remains based on the trusted Firebase Auth custom claim admin=true.
