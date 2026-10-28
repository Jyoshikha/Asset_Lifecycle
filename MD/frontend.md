# Frontend

Ten apps under `app/`, each its own npm workspace with `ui5.yaml` and `webapp/`. SAPUI5 version proxied in development: 1.153.0.

| App | Type | Audience | Open in dev |
|---|---|---|---|
| assets | Fiori elements | Admin | `/assets/index.html` |
| employees | Fiori elements | Admin | `/employees/index.html` |
| departments | Fiori elements | Admin | `/departments/index.html` |
| categories | Fiori elements | Admin | `/categories/index.html` |
| vendors | Fiori elements | Admin | `/vendors/index.html` |
| maintenance | Fiori elements | Admin / Manager | `/maintenance/index.html` |
| archive | Fiori elements | Admin / Manager | `/archive/index.html` |
| dashboard | Freestyle | Admin | `/dashboard/index.html` |
| managerdashboard | Freestyle | Manager (read-only) | `/managerdashboard/index.html` |
| userdashboard | Freestyle | User (My Assets) | `/userdashboard/index.html` |

`app/launchpad.html` shows all as tiles. Annotations for the Fiori elements apps are in each `app/<name>/annotations.cds`, wired together in `app/services.cds`.

## Dashboards
- **Admin**: KPIs, filters, lifecycle and category charts, attention list, data summary, Download PDF, Email Report.
- **Manager**: read-only operational view, notifications, PDF export.
- **User**: My Assets with permitted history.

The dashboard app has `i18n` files for default, `en` and `de`.

## Dev shortcuts
`npm run watch-<app>` (for example `watch-dashboard`) starts `cds watch` and opens that app.
