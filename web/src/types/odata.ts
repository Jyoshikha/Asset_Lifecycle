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
