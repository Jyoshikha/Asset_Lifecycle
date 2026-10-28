# Asset lifecycle flow

Read from the action handlers in `srv/catservice.js`. Statuses: `In Stock`, `Assigned`, `Maintenance`, `Retired`, `Archived`.

```
            assign                          sendToMaintenance
 In Stock ─────────> Assigned ─────────────────────────────┐
   │  ▲ ▲  <─ returnAsset ─┘                                │
   │  │ └────────────── sendToMaintenance (from In Stock) ──┤
   │  │                                                     ▼
   │  └── completeMaintenance: Fixed / Part Replaced ── Maintenance
   │          (back to Assigned if it still has a holder, else In Stock)
   │                                                        │
   │                      completeMaintenance: Beyond Repair│
   ▼                                                        ▼
 retire (from In Stock) ───────────────────────────────> Retired ── archive ──> Archived
```

| Action | Allowed from | Result | Writes |
|---|---|---|---|
| `assign(employee, notes)` | In Stock | Assigned | sets currentHolder, firstDistributionDate if empty; ledger row `Assign`. Employee must be `active` |
| `returnAsset(notes)` | Assigned | In Stock | ledger row |
| `sendToMaintenance(type, vendor, description)` | In Stock, Assigned | Maintenance | maintenance record with status `Open` |
| `completeMaintenance(outcome, cost, notes)` | Maintenance | see note | closes the open record (`Completed`). Outcome one of Fixed, Part Replaced, Beyond Repair |
| `retire(notes)` | In Stock | Retired | ledger row (`retire` is only allowed from In Stock, so an assigned asset must be returned first) |
| `archive(reason, disposalMethod, disposalCertNo)` | Retired | Archived | archive record |

`completeMaintenance` with `Beyond Repair` clears the holder, sets `Retired` and writes a ledger row `Retire` ("Beyond repair"). Fixed and Part Replaced restore `Assigned` when the asset still has a holder, otherwise `In Stock`.

Every action rejects a wrong starting status with HTTP 409. The UI hides unavailable actions through the computed flags `canAssign`, `canReturn`, `canSendToMaintenance`, `canCompleteMaintenance`, `canRetire`, `canArchive` on `AssetSrv` (`Core.OperationAvailable`).
