export type ODataList<T> = { value: T[]; '@odata.count'?: number };

export type StatusCount = { status: string; n: number };
export type CategoryCount = { categoryName: string | null; n: number };

export type HistoryRow = {
  ledger_ID: string;
  assetTag: string | null;
  action: string | null;
  transitionDate: string | null;
  fromName: string | null;
  toName: string | null;
};

/** A row of the read-only asset view (names already joined in). */
export type AssetRow = {
  asset_ID: string;
  assetTag: string | null;
  serialNumber: string | null;
  model: string | null;
  status: string | null;
  categoryName: string | null;
  vendorName: string | null;
  holderName: string | null;
  holderLocation: string | null;
  warrantyExpiry: string | null;
  purchaseDate: string | null;
};

type Named = { fullName: string | null } | null;

export type LedgerEntry = {
  ledger_ID: string;
  action: string | null;
  transitionDate: string | null;
  notes: string | null;
  fromEmployee: Named;
  toEmployee: Named;
};

export type MaintenanceEntry = {
  maintenance_ID: string;
  type: string | null;
  status: string | null;
  outcome: string | null;
  cost: string | number | null;
  reportedDate: string | null;
  completedDate: string | null;
  description: string | null;
  serviceVendor: { name: string | null } | null;
};

export type ArchiveEntry = {
  archive_ID: string;
  archivedAt: string | null;
  reason: string | null;
  disposalMethod: string | null;
  disposalCertNo: string | null;
};

export type AssetDetail = {
  asset_ID: string;
  assetTag: string | null;
  serialNumber: string | null;
  model: string | null;
  purchaseDate: string | null;
  purchaseCost: string | number | null;
  warrantyExpiry: string | null;
  firstDistributionDate: string | null;
  status: string | null;
  category_category_ID: string | null;
  vendor_vendor_ID: string | null;
  canAssign: boolean;
  canReturn: boolean;
  canSendToMaintenance: boolean;
  canCompleteMaintenance: boolean;
  canRetire: boolean;
  canArchive: boolean;
  category: { name: string | null } | null;
  vendor: { name: string | null } | null;
  currentHolder: { fullName: string | null; email: string | null; location: string | null } | null;
  ownershipHistory: LedgerEntry[];
  maintenanceRecords: MaintenanceEntry[];
  archiveRecords: ArchiveEntry[];
};

/** A row of the read-only maintenance view. */
export type MaintenanceRow = {
  maintenance_ID: string;
  assetId: string | null;
  assetTag: string | null;
  type: string | null;
  status: string | null;
  outcome: string | null;
  cost: string | number | null;
  reportedDate: string | null;
  completedDate: string | null;
  vendorName: string | null;
};

export type ArchiveRow = ArchiveEntry & {
  asset: { asset_ID: string; assetTag: string | null; model: string | null } | null;
};

export type Option = { value: string; label: string };
