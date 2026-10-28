# Build 1000: Admin overview page on the new Next.js front end

Date: 2026-10-28

## What changed
Adds the launch-admin page in web/ (Next.js, React, TypeScript, Three.js): header, sidebar, five KPI cards, asset status donut, assets by category, recent activity, needs-attention list and a small 3D preview. Figures come from the CAP service; nothing is estimated.

## Why
First page of the redesign on branch ui/ux-improvements: an operational overview in place of a page of tiles, built from small reusable components with a minimal neutral look.

## How it was verified
Production build and type-check pass; page checked in headless Chrome at 1440, 820 and 390 px in light and dark with no sideways scroll or console errors; counts match the old dashboard (9 assets, 2 warranties expiring, 1 overdue maintenance). Screenshots in ui upgrade/build-1000/.

## What to improve next
Hardware assets page (so KPI and legend shortcuts can filter), real role from the login, verify the ?status= shortcut in the UI5 app, a notification count, and a test for the data queries.

<!-- files:start (rebuilt from git, do not edit below) -->
## Files changed
- `M` .gitignore
- `A` ui upgrade/build-1000/01-launch-admin-desktop.png
- `A` ui upgrade/build-1000/02-launch-admin-desktop-dark.png
- `A` ui upgrade/build-1000/03-launch-admin-tablet.png
- `A` ui upgrade/build-1000/04-launch-admin-phone.png
- `A` ui upgrade/build-1000/README.md
- `A` web/AGENTS.md
- `A` web/next.config.ts
- `A` web/package-lock.json
- `A` web/package.json
- `A` web/src/app/globals.css
- `A` web/src/app/icon.svg
- `A` web/src/app/launch-admin/page.tsx
- `A` web/src/app/layout.tsx
- `A` web/src/app/page.tsx
- `A` web/src/components/dashboard/AssetModelViewer3D.tsx
- `A` web/src/components/dashboard/AssetStatusChart.module.css
- `A` web/src/components/dashboard/AssetStatusChart.tsx
- `A` web/src/components/dashboard/AttentionItem.module.css
- `A` web/src/components/dashboard/AttentionItem.tsx
- `A` web/src/components/dashboard/AttentionPanel.module.css
- `A` web/src/components/dashboard/AttentionPanel.tsx
- `A` web/src/components/dashboard/CategoryBarChart.module.css
- `A` web/src/components/dashboard/CategoryBarChart.tsx
- `A` web/src/components/dashboard/DashboardContent.module.css
- `A` web/src/components/dashboard/DashboardContent.tsx
- `A` web/src/components/dashboard/DashboardToolbar.module.css
- `A` web/src/components/dashboard/DashboardToolbar.tsx
- `A` web/src/components/dashboard/KPIGrid.module.css
- `A` web/src/components/dashboard/KPIGrid.tsx
- `A` web/src/components/dashboard/MetricCard.module.css
- `A` web/src/components/dashboard/MetricCard.tsx
- `A` web/src/components/dashboard/ModelCanvas.module.css
- `A` web/src/components/dashboard/ModelCanvas.tsx
- `A` web/src/components/dashboard/RecentActivityTable.module.css
- `A` web/src/components/dashboard/RecentActivityTable.tsx
- `A` web/src/components/layout/AppHeader.module.css
- `A` web/src/components/layout/AppHeader.tsx
- `A` web/src/components/layout/AppShell.module.css
- `A` web/src/components/layout/AppShell.tsx
- `A` web/src/components/layout/SidebarNavigation.module.css
- `A` web/src/components/layout/SidebarNavigation.tsx
- `A` web/src/components/ui/Badge.module.css
- `A` web/src/components/ui/Badge.tsx
- `A` web/src/components/ui/Button.module.css
- `A` web/src/components/ui/Button.tsx
- `A` web/src/components/ui/Icon.tsx
- `A` web/src/components/ui/Panel.module.css
- `A` web/src/components/ui/Panel.tsx
- `A` web/src/components/ui/RemoteView.module.css
- `A` web/src/components/ui/RemoteView.tsx
- `A` web/src/components/ui/Skeleton.module.css
- `A` web/src/components/ui/Skeleton.tsx
- `A` web/src/components/ui/Text.module.css
- `A` web/src/components/ui/Text.tsx
- `A` web/src/hooks/useDashboardData.ts
- `A` web/src/hooks/useOData.ts
- `A` web/src/lib/dates.ts
- `A` web/src/lib/nav.ts
- `A` web/src/lib/odata.ts
- `A` web/src/lib/queries.ts
- `A` web/src/lib/status.ts
- `A` web/src/styles/tokens.css
- `A` web/src/types/odata.ts
- `A` web/tsconfig.json
