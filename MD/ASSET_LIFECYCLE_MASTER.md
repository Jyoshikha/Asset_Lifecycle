# Asset Lifecycle: master reference

State as of 2026-10-28, read from the code at commit `31efdc7`. Open the source before relying on a detail.

## What it is
SAP CAP (Node.js) backend plus SAPUI5 / Fiori front ends for managing IT hardware from procurement to archive. Package `asset_lifecycle` 1.0.0, `@sap/cds` ^10 (needs Node 22+), SQLite in development, SAP HANA + XSUAA in production.

## Data model (`db/schema.cds`, namespace `Asset_Lifecycle`)
All entities use `managed` (createdAt/By, modifiedAt/By).

| Entity | Key | Notes |
|---|---|---|
| Departments | dept_ID | name, costCenter; has many Employees |
| Employees | employee_ID | fullName, email, phone, location, status, department; owns Assets via currentHolder |
| AssetCategories | category_ID | name, lifespanMonths |
| Vendors | vendor_ID | name, email |
| Assets | asset_ID | assetTag, serialNumber, model, purchaseDate/Cost, warrantyExpiry, firstDistributionDate, `status` (default `In Stock`), category, vendor, currentHolder |
| OwnershipLedgers | ledger_ID | asset, from/toEmployee, action, transitionDate, recordedBy, notes |
| MaintenanceRecords | maintenance_ID | asset, type, reportedBy, serviceVendor, reported/completedDate, status, outcome, cost, coveredByWarranty, nextDueDate |
| ArchiveRecords | archive_ID | asset, archivedAt/By, reason, disposalMethod, disposalCertNo |

## Service (`srv/catservice.cds`, `srv/catservice.js`)
`CatalogService`, OData V4 at `/odata/v4/catalog/`.

- Draft-enabled projections: `AssetSrv`, `AssetCategorieSrv`, `VendorSrv`, `EmployeeSrv`, `DepartmentSrv`.
- Plain projections: `OwnershipLedgerSrv`, `MaintenanceRecordSrv`, `ArchiveRecordSrv`.
- Read-only dashboard views with flattened names: `AssetOverviewSrv`, `AssetHistorySrv`, `MaintenanceOverviewSrv`, `MyProfileSrv`.
- Bound lifecycle actions on `AssetSrv`: `assign`, `returnAsset`, `sendToMaintenance`, `completeMaintenance`, `retire`, `archive` (see `flow.md`).
- Unbound `create*`, `update*`, `delete*` actions for every entity (admin only).

## Access control
| Role | Scope | Can do |
|---|---|---|
| Admin | `$XSAPPNAME.Admin` | Full CRUD on everything, all lifecycle actions, dashboard, reports |
| Manager | `$XSAPPNAME.Manager` | Read assets, ledgers, maintenance, archive; dashboards |
| User | `$XSAPPNAME.User` | Read only own assets, history and maintenance (matched on `currentHolder.email = $user`) |

Role collections: `Asset_Lifecycle_Admin`, `_Manager`, `_User` (`xs-security.json`).

## Apps (`app/`)
Fiori elements: assets, employees, departments, categories, vendors, maintenance, archive.
Freestyle UI5: `dashboard` (Admin), `managerdashboard` (Manager), `userdashboard` (My Assets).
`app/launchpad.html` bundles them as tiles. Details in `frontend.md`.

## Run
See `SETUP.md`. `npm install`, then `npm start` or `npx cds watch`, open <http://localhost:4004>.
Mocked dev users: `admin`/`admin`, `manager`/`manager`, `john.smith@company.com`/`user`.

## Tests
None. `npm test` is the npm placeholder and exits 1. `test/data/` holds demo CSVs only.

## Known issues
See `bugs.md`.
