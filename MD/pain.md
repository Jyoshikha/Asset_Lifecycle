# Pain: what can break and how badly

| Risk | Severity | Why |
|---|---|---|
| Wrong Node version | Blocks startup | CAP 10 needs Node 22+; native modules (SQLite) must be rebuilt after a major change |
| Duplicate XSUAA scopes (BUG-001) | May fail the cloud deploy | Service update can reject duplicate scope names |
| User login name differs from employee email | User sees no assets | Row filter is `currentHolder.email = $user` (DEC-006) |
| Employee not `active` | Cannot receive an asset | `assign` returns 409 |
| Editing an asset's holder or status directly in a draft | State drift between status, holder and ledger | The ledger is written only by the actions |
| No automated tests | Regressions go unnoticed | Lifecycle rules live in one 646-line handler file |
| Unreviewed dependency vulnerabilities (BUG-005) | Unknown | 3 critical reported |
| Renaming `deleteEmpoyee` (BUG-002) | Breaks any caller of the old name | Check callers first |
