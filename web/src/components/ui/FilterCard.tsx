'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import styles from './FilterCard.module.css';

type Props = {
  onApply: () => void;
  onClear: () => void;
  /** Always-visible fields. */
  children: React.ReactNode;
  /** Fields kept behind "More filters". */
  more?: React.ReactNode;
  /** Open "More filters" from the start, because one of its fields is in use. */
  moreInUse?: boolean;
};

/** The filter card every list page starts with: fields, "More filters", Apply and Clear all. */
export function FilterCard({ onApply, onClear, children, more, moreInUse = false }: Props) {
  const [showMore, setShowMore] = useState(moreInUse);

  return (
    <form
      className={styles.card}
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <div className={styles.fields}>{children}</div>
      {showMore && more && <div className={styles.fields}>{more}</div>}
      <div className={styles.actions}>
        {more && (
          <button type="button" className={styles.more} aria-expanded={showMore} onClick={() => setShowMore((s) => !s)}>
            <Icon name="filter" size={16} />
            More filters
            <Icon name="chevron" size={14} />
          </button>
        )}
        <Button type="submit" variant="primary">
          Apply filters
        </Button>
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear all
        </button>
      </div>
    </form>
  );
}
