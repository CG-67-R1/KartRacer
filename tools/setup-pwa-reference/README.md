# Setup PWA reference (from KARTS Cursor project, 2026-09)

Standalone Vite+React PWA that drives tools/setup-engine: chassis setup sheets,
symptom -> advice analysis, session history, CSV logger analysis, calculators.
NOT a shipping product — reference UI for Cursor when building J2.1 (Kart Setup
hub) in the Expo app. Screens: ChassisScreen, AnalysisScreen, HistoryScreen,
LoggerScreen, ToolsScreen. To run standalone: npm install && npm run dev
(engine dep resolves via ../setup-engine if linked; original repo used a root
workspace).
