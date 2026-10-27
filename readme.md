# Asset Lifecycle

SAP CAP backend (`db/`, `srv/`) with SAPUI5 / Fiori apps (`app/`) for managing the full lifecycle of IT hardware:
procurement, assignment, maintenance, retirement and archive.

## Project layout

File or Folder | Purpose
---------|----------
`app/` | UI apps: `assets`, `employees`, `departments`, `categories`, `vendors`, `maintenance`, `archive` (Fiori elements) and `dashboard` (Admin), `managerdashboard` (Manager), `userdashboard` (My Assets) (freestyle UI5). `launchpad.html` bundles them as tiles.
`db/` | Domain model (`Asset_Lifecycle` namespace)
`srv/` | `CatalogService` (OData V4, `/odata/v4/catalog/`) and its handlers
`test/data/` | Demo data (CSV) loaded automatically in development, not part of a production build
`xs-security.json` | XSUAA scopes and role collections (`Asset_Lifecycle_Admin`, `_Manager`, `_User`)

## Run locally

```bash
npm install
npm start            # or: npx cds watch
```

Open <http://localhost:4004> and choose `app/launchpad.html`, or one app directly, e.g. `/dashboard/index.html`.

Mocked users (development):

User | Password | Role
---------|----------|----------
`admin` | `admin` | Admin
`manager` | `manager` | Manager
`john.smith@company.com` | `user` | User (sees only assets assigned to John Smith)

## Dashboards

- **Admin** (`/dashboard`): KPIs, filters, lifecycle and category charts, attention list, data summary, Download PDF and Email Report.
- **Manager** (`/managerdashboard`): read-only operational view with notifications and PDF export.
- **User** (`/userdashboard`): My Assets with permitted history.

## Learn more

<https://cap.cloud.sap>
