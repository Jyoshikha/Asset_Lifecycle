# Build 1000 (pending): launch-admin

First page of the redesign: the admin overview, in `web/` (Next.js 16, React 19, TypeScript, Three.js). Captured 2026-10-28 from `npm run dev` against the local CAP backend with the demo data.

| File | View |
|---|---|
| 01-launch-admin-desktop.png | 1440 px, light |
| 02-launch-admin-desktop-dark.png | 1440 px, dark (follows the system setting) |
| 03-launch-admin-tablet.png | 820 px |
| 04-launch-admin-phone.png | 390 px |

Every figure is read from the service (counts computed by `$apply` / `$count`, no row limit). Not shown on purpose: trends "vs last month" (no history exists), Export report and the date range (no backend), search, Reports and Settings (disabled, with a reason).

Known limits: the Reports and Settings items, search and the notification bell are placeholders; shortcut links open the existing UI5 apps (the `?status=` filter is not verified there); the activity table scrolls sideways on a phone; the 3D card shows a generic laptop, not a real asset.
