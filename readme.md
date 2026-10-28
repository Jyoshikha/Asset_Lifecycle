# Asset Lifecycle

SAP CAP backend (`db/`, `srv/`) for managing the full lifecycle of IT hardware: procurement, assignment, maintenance,
retirement and archive. Two front ends read the same service:

- `app/`: the original SAPUI5 / Fiori apps.
- `web/`: the redesigned front end (Next.js, React, TypeScript, Three.js), being built page by page on branch `ui/ux-improvements`.

## Project layout

File or Folder | Purpose
---------|----------
`web/` | New front end. `src/components/ui` (primitives), `layout` (header, sidebar, shell), `dashboard` (page modules); `src/hooks` and `src/lib` (typed OData queries, loading and error states); `src/app` (routes); `src/styles/tokens.css` (design tokens)
`app/` | UI5 apps: `assets`, `employees`, `departments`, `categories`, `vendors`, `maintenance`, `archive` (Fiori elements) and `dashboard` (Admin), `managerdashboard` (Manager), `userdashboard` (My Assets) (freestyle UI5). `launchpad.html` bundles them as tiles.
`db/` | Domain model (`Asset_Lifecycle` namespace)
`srv/` | `CatalogService` (OData V4, `/odata/v4/catalog/`) and its handlers
`scripts/` | `changelog.mjs`: build and internal-change numbering (see Versioning)
`test/data/` | Demo data (CSV) loaded automatically in development, not part of a production build
`xs-security.json` | XSUAA scopes and role collections (`Asset_Lifecycle_Admin`, `_Manager`, `_User`)

## Requirements

- Node.js 22 or higher for the CAP backend (`@sap/cds` 10 refuses to start on Node 20).
- Node.js 20.9 or higher for `web/` (Next.js 16).

## Run locally

Backend and UI5 apps:

```bash
npm install
npm start            # or: npx cds watch
```

Open <http://localhost:4004> and choose `app/launchpad.html`, or one app directly, e.g. `/dashboard/index.html`.

New front end (the backend above must be running; `/odata` is proxied to it):

```bash
cd web
npm install
npm run dev          # http://localhost:3000, opens /launch-admin
```

Other `web/` scripts: `npm run build`, `npm run typecheck`. Set `CAP_URL` if the backend is not on `http://localhost:4004`,
and `NEXT_PUBLIC_UI5_URL` to change where links to the not-yet-migrated UI5 apps point.

Mocked users (development). The browser asks for them the first time the page reads data:

User | Password | Role
---------|----------|----------
`admin` | `admin` | Admin
`manager` | `manager` | Manager
`john.smith@company.com` | `user` | User (sees only assets assigned to John Smith)

## Pages in the new front end

Page | Route | State
---------|----------|----------
Admin overview | `/launch-admin` | Built (Build 1000): KPIs, asset status, assets by category, recent activity, needs attention, small 3D preview. Every figure comes from the service.
Hardware assets | `/assets` | Built (Build 1001): filters, server-side sort and paging, Columns and Density, CSV export, Register asset. Filters live in the URL, so dashboard shortcuts open it filtered.
Asset page | `/assets/<id>` | Built (Build 1002): details, ownership history, maintenance and archive record, Edit, and the lifecycle actions (assign, return, send to maintenance, complete maintenance, retire, archive).
Employees | `/employees` | Built (Build 1003): search, status and department filters, add and edit. Employees are set to Inactive, never deleted, so the ownership history stays intact.
Departments, categories, vendors, maintenance, archive, manager and user views | | Not migrated yet; the links open the UI5 apps

Reports, Settings and global search are shown disabled until they exist.

## UI5 dashboards

- **Admin** (`/dashboard`): KPIs, filters, lifecycle and category charts, attention list, data summary, Download PDF and Email Report.
- **Manager** (`/managerdashboard`): read-only operational view with notifications and PDF export.
- **User** (`/userdashboard`): My Assets with permitted history.

## Versioning

- A **Build** is a numbered, user-visible release, starting at 1000 and pinned by the git tag `build-N` (the tag is the source of truth).
- An **InBul** is an internal change (docs, tooling, bookkeeping), titled `InBulNN: ...` and tagged `InBulNN`.
- `node scripts/changelog.mjs --pending "<title>" "<summary>"` prepares a build, `--next-internal` prints the next InBul number, and `--tag` pins the number after the commit.
- Working notes, build reports and screenshots are kept locally and are not part of the repository.

## Learn more

<https://cap.cloud.sap>
