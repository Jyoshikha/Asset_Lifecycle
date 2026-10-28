# Tried and failed

| Date | What | Why it failed | What to do instead |
|---|---|---|---|
| 2026-10-28 | Start with system Node 20.20.2 | `@sap/cds` 10.1.1 requires Node 22+ | Use Node 22+ |
| 2026-10-28 | `winget install` Node | `winget` is not installed | Use Chocolatey or the nodejs.org installer |
| 2026-10-28 | `choco upgrade nodejs -y` | Needs Administrator rights; `lib-bkp` and `lib\nodejs.install` access denied. The existing Node 20 install was left intact | Run from an elevated terminal |
