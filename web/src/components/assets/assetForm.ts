import type { FieldDef } from '@/components/ui/FormDialog';
import type { AssetDetail, Option } from '@/types/odata';

// Status and holder are not here on purpose: they only change through the lifecycle actions,
// so the status, the holder and the ownership history can never disagree.
export function assetFields(categories: Option[], vendors: Option[]): FieldDef[] {
  return [
    { name: 'assetTag', label: 'Asset tag', type: 'text', required: true, maxLength: 50 },
    { name: 'model', label: 'Model', type: 'text', required: true, maxLength: 100 },
    { name: 'serialNumber', label: 'Serial number', type: 'text', maxLength: 100 },
    { name: 'category_category_ID', label: 'Category', type: 'select', required: true, options: categories },
    { name: 'vendor_vendor_ID', label: 'Vendor', type: 'select', options: vendors },
    { name: 'purchaseDate', label: 'Purchase date', type: 'date' },
    { name: 'purchaseCost', label: 'Purchase cost', type: 'number' },
    { name: 'warrantyExpiry', label: 'Warranty expiry', type: 'date' },
  ];
}

export function assetInitial(a: AssetDetail): Record<string, string> {
  return {
    assetTag: a.assetTag ?? '',
    model: a.model ?? '',
    serialNumber: a.serialNumber ?? '',
    category_category_ID: a.category_category_ID ?? '',
    vendor_vendor_ID: a.vendor_vendor_ID ?? '',
    purchaseDate: a.purchaseDate ?? '',
    purchaseCost: a.purchaseCost === null ? '' : String(a.purchaseCost),
    warrantyExpiry: a.warrantyExpiry ?? '',
  };
}

/** Form values to the service's field types. When creating, empty fields are left out; when updating they are cleared. */
export function assetPayload(values: Record<string, string>, clearEmpty: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, raw] of Object.entries(values)) {
    const v = raw.trim();
    if (v === '') {
      if (clearEmpty) out[name] = null;
      continue;
    }
    out[name] = name === 'purchaseCost' ? Number(v) : v;
  }
  return out;
}
