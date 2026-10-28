# Old UI snapshots (UI5 frontend, before the redesign)

Captured 2026-10-28 (do not delete; kept as the "before" record) from the local dev server (<http://localhost:4004>, mocked users, demo data from `test/data/`) with headless Chrome, 1440x900 desktop and 390x844 phone. Not committed to any build; these are evidence for the findings in `MD/bugs.md`.

| File | Screen | User | Related findings |
|---|---|---|---|
| 01-launchpad-admin.png | Launchpad (all 10 tiles) | admin | BUG-007 |
| 02-admin-dashboard.png | Admin dashboard (full page) | admin | BUG-018 to BUG-022 |
| 03-assets-list.png | Assets list | admin | BUG-025 |
| 04-assets-object-page.png | Asset object page, lifecycle actions | admin | BUG-016, BUG-017 |
| 05-employees-list.png | Employees | admin | |
| 06-departments-list.png | Departments | admin | |
| 07-categories-list.png | Categories | admin | |
| 08-vendors-list.png | Vendors | admin | |
| 09-maintenance-list.png | Maintenance | admin | |
| 10-archive-list.png | Retirement & Archive | admin | |
| 11-manager-dashboard.png | Manager dashboard (full page) | manager | BUG-023 |
| 12-user-my-assets.png | My Assets | john.smith@company.com | BUG-024 |
| 13-user-asset-history.png | My Assets, history dialog | john.smith@company.com | BUG-014 |
| 14-admin-dashboard-phone.png | Admin dashboard at phone width | admin | BUG-022 |
| 15-user-my-assets-phone.png | My Assets at phone width | john.smith@company.com | |

To retake them: start the server (see `SETUP.md`) and run a headless browser against the URLs above.
