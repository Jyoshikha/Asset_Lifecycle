# Architecture

```
Browser ── approuter (.deploy/app-router, XSUAA login) ── CatalogService (srv/) ── db/ ── SQLite (dev) / HANA HDI (prod)
   │                                                           ▲
   └── app/*  (Fiori elements + freestyle UI5)  ── OData V4 ───┘
```

| Layer | Where | Notes |
|---|---|---|
| Domain model | `db/schema.cds`, `db/common.cds` | Namespace `Asset_Lifecycle`; shared types (`Guid`, `String50/100/120/255`) in `common` |
| Service | `srv/catservice.cds`, `srv/catservice.js` | One service, `CatalogService`; handlers enforce lifecycle rules |
| UI | `app/*` | npm workspaces (`"workspaces": ["app/*"]`); `cds-plugin-ui5` serves them in dev |
| Security | `xs-security.json`, `@requires`/`@restrict` in `catservice.cds` | Admin / Manager / User |
| Deployment | `mta.yaml` | srv module, HDI deployer, approuter; resources: XSUAA (`application` plan), HANA (`hdi-shared`) |
| Demo data | `test/data/*.csv` | Loaded in development only |

## Security model
Service-level `@requires: ['Admin','Manager','User']`, then per-entity `@restrict`. Master data (employees, departments, categories, vendors) is Admin only. Managers and users reach names through the read-only flattened views, so they never need master-data access. Users are filtered to rows where the holder's email equals `$user`.

## Profiles
`package.json` sets `[production]` to `auth: xsuaa`, `db: hana`. Development uses mocked auth and SQLite via `@cap-js/sqlite`.
