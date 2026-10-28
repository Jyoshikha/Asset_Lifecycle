# Deployment

Local development and the BTP Cloud Foundry deployment differ as follows. Taken from `mta.yaml` and `package.json`; not deployed from this machine.

| Concern | Local | Cloud Foundry (MTA) |
|---|---|---|
| Database | SQLite via `@cap-js/sqlite` | HANA HDI container, plan `hdi-shared` |
| Auth | Mocked users | XSUAA, plan `application`, `tenant-mode: dedicated` |
| Demo CSVs | Loaded | Not part of the production build |
| Entry | `npm start` / `cds watch` | approuter (`.deploy/app-router`), welcome file `/launchpad.html` |
| Node | 22+ (CAP 10) | `nodejs_buildpack`; confirm the buildpack's Node version meets 22+ |

## Build
`mta.yaml` runs `npm ci` and `npx cds build --production` before all modules, then packages `gen/srv`, `gen/db` and the approuter. Commands: `mbt build`, then `cf deploy mta_archives/<name>.mtar`.

## After deploy
Assign role collections `Asset_Lifecycle_Admin`, `_Manager`, `_User` to users in BTP cockpit. A User only sees assets whose holder email matches their login.

## Not verified
No build or deploy has been run from this clone. Check that `package-lock.json` is in sync before relying on `npm ci`.
