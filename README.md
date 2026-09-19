# Attendance Tracker v134

Built from the known-good v126 functional baseline.

## v134 changes
- Real Firebase sync status in Account & Cloud: Syncing, last successful sync time, and sync failed/unavailable state with green/red symbols.
- Last successful sync time is persisted locally so it remains visible after app reload/logout.
- Admin student detail now uses month selection before displaying daily records.
- Monthly attendance filters: All, Present, Absent, Not Held, Extra Classes, Pending.
- Month and status filtering is display-only and does not modify cloud data.
- Admin/Cloud cards use the active edition's existing card surface variables.
- Existing Firebase rules, authentication, attendance logic, student-card click behavior, and v126 sync architecture are preserved.
