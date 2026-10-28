'use client';

import type { Column } from './DataTable';
import { Popover } from './Popover';
import styles from './TableControls.module.css';

type ColumnsProps = {
  columns: { id: string; header: string }[];
  visible: string[];
  onChange: (visible: string[]) => void;
};

/** Lets the person choose which columns the table shows. At least one stays on. */
export function ColumnsMenu({ columns, visible, onChange }: ColumnsProps) {
  return (
    <Popover label="Columns" icon="columns">
      {() => (
        <fieldset className={styles.group}>
          <legend className={styles.legend}>Show columns</legend>
          {columns.map((c) => {
            const on = visible.includes(c.id);
            return (
              <label key={c.id} className={styles.row}>
                <input
                  type="checkbox"
                  checked={on}
                  disabled={on && visible.length === 1}
                  onChange={() => onChange(on ? visible.filter((v) => v !== c.id) : columns.map((x) => x.id).filter((id) => id === c.id || visible.includes(id)))}
                />
                {c.header}
              </label>
            );
          })}
        </fieldset>
      )}
    </Popover>
  );
}

export type Density = 'comfortable' | 'compact';

export function DensityMenu({ value, onChange }: { value: Density; onChange: (d: Density) => void }) {
  return (
    <Popover label="Density">
      {(close) => (
        <div className={styles.group} role="group" aria-label="Row density">
          {(['comfortable', 'compact'] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={`${styles.choice} ${value === d ? styles.on : ''}`}
              aria-pressed={value === d}
              onClick={() => {
                onChange(d);
                close();
              }}
            >
              {d === 'comfortable' ? 'Comfortable' : 'Compact'}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}

/** Columns that are currently visible, in table order. */
export function pickColumns<T>(all: Column<T>[], visible: string[]): Column<T>[] {
  return all.filter((c) => visible.includes(c.id));
}
