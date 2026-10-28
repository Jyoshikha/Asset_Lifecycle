'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormDialog } from '@/components/ui/FormDialog';
import { Icon } from '@/components/ui/Icon';
import { Popover } from '@/components/ui/Popover';
import {
  ACTIVE_EMPLOYEE_OPTIONS, CATEGORY_OPTIONS, VENDOR_OPTIONS, useOptions,
} from '@/hooks/useOptions';
import { odataSend } from '@/lib/odata';
import type { AssetDetail } from '@/types/odata';
import { assetFields, assetInitial, assetPayload } from './assetForm';
import { LIFECYCLE, primaryAction, type LifecycleKey } from './lifecycle';
import styles from './AssetActions.module.css';

type Props = { asset: AssetDetail; onDone: (message: string) => void };

const EDIT = 'edit';

/** Edit, the next lifecycle step as the main button, and every other step in a menu with the reason when it is unavailable. */
export function AssetActions({ asset, onDone }: Props) {
  const [active, setActive] = useState<LifecycleKey | typeof EDIT | null>(null);
  const employees = useOptions(ACTIVE_EMPLOYEE_OPTIONS, 'employee_ID', 'fullName');
  const vendors = useOptions(VENDOR_OPTIONS, 'vendor_ID', 'name');
  const categories = useOptions(CATEGORY_OPTIONS, 'category_ID', 'name');

  const primary = primaryAction(asset);
  const current = LIFECYCLE.find((a) => a.key === active);

  return (
    <>
      <Button icon="edit" onClick={() => setActive(EDIT)}>
        Edit
      </Button>
      {primary && (
        <Button variant="primary" icon={primary.icon} onClick={() => setActive(primary.key)}>
          {primary.label}
        </Button>
      )}
      <Popover label="More actions" icon="more" role="menu">
        {(close) =>
          LIFECYCLE.filter((a) => a.key !== primary?.key).map((a) => {
            const allowed = asset[a.flag];
            return (
              <button
                key={a.key}
                type="button"
                role="menuitem"
                className={`${styles.item} ${allowed ? '' : styles.off}`}
                aria-disabled={!allowed || undefined}
                onClick={() => {
                  if (!allowed) return;
                  close();
                  setActive(a.key);
                }}
              >
                <span className={styles.line}>
                  <Icon name={a.icon} size={16} />
                  {a.label}
                </span>
                {!allowed && <span className={styles.reason}>{a.reason}</span>}
              </button>
            );
          })
        }
      </Popover>

      <FormDialog
        open={active === EDIT}
        title="Edit asset"
        description="Status and holder change only through the lifecycle actions."
        fields={assetFields(categories, vendors)}
        initial={assetInitial(asset)}
        submitLabel="Save changes"
        onSubmit={async (values) => {
          await odataSend('POST', 'updateAsset', { asset_ID: asset.asset_ID, ...assetPayload(values, true) });
          onDone('Asset updated.');
        }}
        onClose={() => setActive(null)}
      />

      {current && (
        <FormDialog
          open
          title={current.label}
          description={current.description}
          fields={current.fields({ employees, vendors })}
          submitLabel={current.submitLabel}
          danger={current.danger}
          onSubmit={async (values) => {
            await odataSend('POST', `AssetSrv(asset_ID=${asset.asset_ID},IsActiveEntity=true)/CatalogService.${current.key}`, current.body(values));
            onDone(current.done);
          }}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
