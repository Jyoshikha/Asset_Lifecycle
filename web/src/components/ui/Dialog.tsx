'use client';

import { useEffect, useRef } from 'react';
import { Heading } from './Text';
import styles from './Dialog.module.css';

type Props = { open: boolean; title: string; onClose: () => void; children: React.ReactNode };

/** The browser's own modal <dialog>: it traps focus, closes on Esc and restores focus to the opener. */
export function Dialog({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className={styles.body}>
          <Heading level={2}>{title}</Heading>
          {children}
        </div>
      )}
    </dialog>
  );
}
