Attendance Tracker v138

Based on the confirmed v135 baseline. Surgical maintenance release only: removed clearly unreachable legacy export/helper code, reduced redundant startup rendering, corrected the service-worker version reference, and replaced the blank preboot period with a lightweight visual boot shell so the first screen and bottom navigation are visible immediately. Attendance logic, Firebase sync/migration, themes, designs, filters, calculations, authentication, and all other functional code are preserved.


Maintenance: removed only clearly unreachable legacy PDF/cloud helper code; startup now gives the initial shell a paint opportunity before the main app render to reduce blank-screen and navigation flicker. No attendance, sync, Firebase, schedule, theme, design, or calculation behavior was intentionally changed.
