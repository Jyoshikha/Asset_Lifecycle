# Setup

## Requirements
- **Node.js 22 or higher.** `@sap/cds` 10 refuses to start on Node 20. Node 24 LTS is the safe choice; Node 26 also worked in testing.
- npm (ships with Node), git.

## Install Node (Windows)
Administrator terminal: `choco upgrade nodejs-lts -y`. Or use the installer from <https://nodejs.org>. Then open a **new** terminal and check `node --version`.

No admin rights? Download the zip for your platform from nodejs.org, check its SHA-256 against `SHASUMS256.txt` on the same page, unzip it, and put its folder first on `PATH` for the shell you use.

## Run
```bash
git clone https://github.com/Jyoshikha/Asset_Lifecycle
cd Asset_Lifecycle
npm install
npm start            # or: npx cds watch
```
If you installed dependencies under a different Node major, run `npm rebuild` first.

Open <http://localhost:4004>, then `app/launchpad.html`, or one app directly (for example `/dashboard/index.html`).

## Mocked development users
| User | Password | Role |
|---|---|---|
| `admin` | `admin` | Admin |
| `manager` | `manager` | Manager |
| `john.smith@company.com` | `user` | User (own assets only) |

## Versioning
Builds and InBuls: see `MD/README.md`. Script: `scripts/changelog.mjs` (needs Node 18+).
