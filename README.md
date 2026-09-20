Attendance Tracker v139

Based on the confirmed v135 baseline. Surgical maintenance release only: removed clearly unreachable legacy export/helper code, reduced redundant startup rendering, corrected the service-worker version reference, and replaced the blank preboot period with a lightweight visual boot shell so the first screen and bottom navigation are visible immediately. Attendance logic, Firebase sync/migration, themes, designs, filters, calculations, authentication, and all other functional code are preserved.


Maintenance: removed only clearly unreachable legacy PDF/cloud helper code; startup now gives the initial shell a paint opportunity before the main app render to reduce blank-screen and navigation flicker. No attendance, sync, Firebase, schedule, theme, design, or calculation behavior was intentionally changed.

Startup loading state: themed Please Wait screen with a rotating Rod of Asclepius remains visible until Firebase authentication state is resolved and startup rendering completes.


Version 144: startup authentication performance maintenance. Existing cached Firebase ID tokens are used for startup admin-role detection instead of forcing a token refresh; cloud profile/data hydration continues in the background after the authenticated app shell is shown. No attendance, sync, Firebase rules, schedule, theme, or UI logic was intentionally changed.


Version 146: Attendance Report white-page text visibility fix only. All text inside .pdfReport is explicitly forced to solid black, including WebKit text fill and opacity, across every edition. No other app behavior or layout was changed.


## v153 surgical startup optimization
- Kept only the four current rotating medical loading icons.
- Removed obsolete CSS animation rules left from the previous 11-icon loading system.
- Deferred service-worker registration until browser idle/short fallback so startup authentication/rendering is not competing with SW registration.
- No attendance, Firebase, schedule, theme, Admin Dashboard, report, or data logic changed.
