'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Popover.module.css';

type Props = {
  label: string;
  icon?: IconName;
  /** "menu" gives the panel menu semantics; use it only when the children are menu items. */
  role?: 'menu';
  align?: 'left' | 'right';
  /** The panel content; receives a function that closes it. */
  children: (close: () => void) => React.ReactNode;
};

/** A button that opens a small panel. Esc and a click outside close it and focus returns to the button. */
export function Popover({ label, icon, role, align = 'right', children }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={styles.root}>
      <button ref={button} type="button" className={styles.trigger} aria-haspopup={role ?? 'true'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {icon && <Icon name={icon} size={16} />}
        {label}
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div role={role} className={`${styles.panel} ${align === 'left' ? styles.left : styles.right}`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
