# Decisions

One entry per design decision, `DEC-NNN`. Decisions DEC-001 to DEC-007 were inferred from the code on 2026-10-28; the original authors' reasoning was not available, so "Reason" is what the code evidently achieves. Correct them if the intent was different.

| ID | Decision | Reason |
|---|---|---|
| DEC-001 | One service, `CatalogService`, for all entities | Single OData endpoint and a single `@requires` gate |
| DEC-002 | Lifecycle changes only through bound actions, with status guards returning HTTP 409 | An asset cannot reach an invalid state by editing `status` in a form |
| DEC-003 | `can*` flags computed in the `AssetSrv` projection and bound to `Core.OperationAvailable` | The Fiori UI shows only the actions valid for the current status |
| DEC-004 | Every assign / return / retire writes an `OwnershipLedgers` row | Auditable ownership history |
| DEC-005 | Read-only flattened views (`AssetOverviewSrv`, `AssetHistorySrv`, `MaintenanceOverviewSrv`, `MyProfileSrv`) for dashboards | Managers and users see names without access to master-data entities |
| DEC-006 | Users are row-filtered by `currentHolder.email = $user` | Employees see only their own assets; login name must equal the employee email |
| DEC-007 | SQLite + mocked auth in development, HANA + XSUAA under the `[production]` profile | No cloud services needed to run locally |
| DEC-008 | 2026-10-28: Documentation follows the TARANG guide: `MD/` folder, Builds from 1000, InBuls from 1, tags as source of truth | Requested by the project owner; see `MD/README.md` |
| DEC-009 | 2026-10-28: Local runs use Node 26 (portable) because `@sap/cds` 10.1.1 requires Node 22+ and the system Node is 20.20.2 | Admin rights were unavailable to upgrade system Node. Node 24 LTS is the safer long-term choice |
