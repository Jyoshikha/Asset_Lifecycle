# Product requirements

Reconstructed from what the code does today. Edit it into the real requirements as they are agreed.

| ID | Requirement | Status |
|---|---|---|
| R1 | Maintain master data: departments, employees, categories (with lifespan), vendors | Implemented (Admin) |
| R2 | Register assets with tag, serial, model, cost, purchase and warranty dates | Implemented |
| R3 | Assign, return, send to maintenance, complete maintenance, retire, archive, with status guards | Implemented |
| R4 | Ownership ledger of every assign / return / transition | Implemented |
| R5 | Maintenance records with type, vendor, cost, warranty flag, next due date | Implemented |
| R6 | Archive records with disposal method and certificate number | Implemented |
| R7 | Role-based access: Admin, Manager, User (own assets only) | Implemented |
| R8 | Admin dashboard with KPIs, charts, PDF download, email report | Implemented in UI; not verified here |
| R9 | Manager dashboard with notifications and PDF export | Implemented in UI; not verified here |
| R10 | User "My Assets" view | Implemented in UI; not verified here |
| R11 | Automated tests | **Missing** |
| R12 | Cloud deployment (HANA, XSUAA, approuter) | Configured in `mta.yaml`; not verified here |
