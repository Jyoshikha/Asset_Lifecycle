'use client';

import { useId, useState } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Section.module.css';

type Props = {
  id: string;
  title: string;
  icon: IconName;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

/** A card whose body can be folded away. The heading is the toggle, so it is reachable by keyboard. */
export function Section({ id, title, icon, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <h2 className={styles.heading} id={`${id}-title`}>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
          <span className={styles.icon}>
            <Icon name={icon} size={18} />
          </span>
          <span className={styles.title}>{title}</span>
          <span className={`${styles.chevron} ${open ? styles.up : ''}`}>
            <Icon name="chevron" size={18} />
          </span>
        </button>
      </h2>
      <div id={bodyId} hidden={!open} className={styles.body}>
        {children}
      </div>
    </section>
  );
}
