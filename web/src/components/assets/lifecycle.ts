import type { IconName } from '@/components/ui/Icon';
import type { FieldDef } from '@/components/ui/FormDialog';
import type { AssetDetail, Option } from '@/types/odata';

export type LifecycleKey = 'assign' | 'returnAsset' | 'sendToMaintenance' | 'completeMaintenance' | 'retire' | 'archive';

export type LifecycleOptions = { employees: Option[]; vendors: Option[] };

export type LifecycleAction = {
  key: LifecycleKey;
  label: string;
  icon: IconName;
  /** The service computes whether the action is allowed; this is the matching flag on the asset. */
  flag: keyof Pick<
    AssetDetail,
    'canAssign' | 'canReturn' | 'canSendToMaintenance' | 'canCompleteMaintenance' | 'canRetire' | 'canArchive'
  >;
  /** Shown when the action is not available. */
  reason: string;
  description: string;
  submitLabel: string;
  done: string;
  danger?: boolean;
  fields: (o: LifecycleOptions) => FieldDef[];
  body: (v: Record<string, string>) => Record<string, unknown>;
};

const opt = (values: string[]): Option[] => values.map((v) => ({ value: v, label: v }));
const text = (v: string) => (v.trim() ? v.trim() : undefined);

// The allowed values are the ones the service accepts (srv/catservice.js).
const MAINTENANCE_TYPES = ['Repair', 'Preventive', 'Upgrade', 'Warranty Claim', 'Inspection'];
const OUTCOMES = ['Fixed', 'Part Replaced', 'Beyond Repair'];
const ARCHIVE_REASONS = ['End of Life', 'Obsolete', 'Beyond Repair', 'Lost'];
const DISPOSAL_METHODS = ['Recycle', 'Donate', 'Sell', 'Destroy'];

export const LIFECYCLE: LifecycleAction[] = [
  {
    key: 'assign',
    label: 'Assign',
    icon: 'user',
    flag: 'canAssign',
    reason: 'Only assets that are In Stock can be assigned.',
    description: 'Hand this asset to an active employee. The change is recorded in the ownership history.',
    submitLabel: 'Assign',
    done: 'Asset assigned.',
    fields: (o) => [
      { name: 'employee', label: 'Assign to', type: 'select', required: true, options: o.employees },
      { name: 'notes', label: 'Notes', type: 'textarea', maxLength: 255 },
    ],
    body: (v) => ({ employee: v.employee, notes: text(v.notes ?? '') }),
  },
  {
    key: 'returnAsset',
    label: 'Return',
    icon: 'swap',
    flag: 'canReturn',
    reason: 'Only assigned assets can be returned.',
    description: 'Take this asset back into stock. The holder is cleared.',
    submitLabel: 'Return asset',
    done: 'Asset returned to stock.',
    fields: () => [{ name: 'notes', label: 'Return notes', type: 'textarea', maxLength: 255 }],
    body: (v) => ({ notes: text(v.notes ?? '') }),
  },
  {
    key: 'sendToMaintenance',
    label: 'Send to maintenance',
    icon: 'wrench',
    flag: 'canSendToMaintenance',
    reason: 'Only assets that are In Stock or Assigned can be sent to maintenance.',
    description: 'Open a maintenance record. The asset is marked In maintenance until the work is completed.',
    submitLabel: 'Send to maintenance',
    done: 'Maintenance record opened.',
    fields: (o) => [
      { name: 'type', label: 'Type', type: 'select', required: true, options: opt(MAINTENANCE_TYPES) },
      { name: 'vendor', label: 'Service vendor', type: 'select', options: o.vendors },
      { name: 'description', label: 'Description', type: 'textarea', maxLength: 255 },
    ],
    body: (v) => ({ type: v.type, vendor: text(v.vendor ?? ''), description: text(v.description ?? '') }),
  },
  {
    key: 'completeMaintenance',
    label: 'Complete maintenance',
    icon: 'check',
    flag: 'canCompleteMaintenance',
    reason: 'Only assets that are in maintenance can be completed.',
    description:
      'Close the open maintenance record. Fixed or Part Replaced puts the asset back where it was; Beyond Repair retires it.',
    submitLabel: 'Complete maintenance',
    done: 'Maintenance completed.',
    fields: () => [
      { name: 'outcome', label: 'Outcome', type: 'select', required: true, options: opt(OUTCOMES) },
      { name: 'cost', label: 'Cost', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea', maxLength: 255 },
    ],
    body: (v) => ({ outcome: v.outcome, cost: v.cost?.trim() ? Number(v.cost) : undefined, notes: text(v.notes ?? '') }),
  },
  {
    key: 'retire',
    label: 'Retire',
    icon: 'archive',
    flag: 'canRetire',
    reason: 'Only assets that are In Stock can be retired. Return an assigned asset first.',
    description: 'Take this asset out of use. A retired asset can then be archived.',
    submitLabel: 'Retire asset',
    done: 'Asset retired.',
    danger: true,
    fields: () => [{ name: 'notes', label: 'Retirement notes', type: 'textarea', maxLength: 255 }],
    body: (v) => ({ notes: text(v.notes ?? '') }),
  },
  {
    key: 'archive',
    label: 'Archive',
    icon: 'inventory',
    flag: 'canArchive',
    reason: 'Only retired assets can be archived.',
    description: 'Record how the asset was disposed of. This is the last step of the lifecycle.',
    submitLabel: 'Archive asset',
    done: 'Asset archived.',
    danger: true,
    fields: () => [
      { name: 'reason', label: 'Reason', type: 'select', required: true, options: opt(ARCHIVE_REASONS) },
      { name: 'disposalMethod', label: 'Disposal method', type: 'select', required: true, options: opt(DISPOSAL_METHODS) },
      { name: 'disposalCertNo', label: 'Disposal certificate no.', type: 'text', maxLength: 40 },
    ],
    body: (v) => ({ reason: v.reason, disposalMethod: v.disposalMethod, disposalCertNo: text(v.disposalCertNo ?? '') }),
  },
];

/** The action offered as the main button: the next step an administrator most likely wants. */
const PRIMARY_ORDER: LifecycleKey[] = ['assign', 'completeMaintenance', 'archive', 'returnAsset', 'sendToMaintenance', 'retire'];

export function primaryAction(asset: AssetDetail): LifecycleAction | undefined {
  for (const key of PRIMARY_ORDER) {
    const a = LIFECYCLE.find((x) => x.key === key);
    if (a && asset[a.flag]) return a;
  }
  return undefined;
}
