'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { NAV, type NavItemConfig } from '@/lib/nav';
import styles from './SidebarNavigation.module.css';

function Item({ item, current }: { item: NavItemConfig; current: boolean }) {
  const body = (
    <>
      <Icon name={item.icon} size={18} />
      <span>{item.label}</span>
    </>
  );

  if (item.unavailable) {
    return (
      <span className={`${styles.item} ${styles.disabled}`} aria-disabled="true" title={item.unavailable}>
        {body}
      </span>
    );
  }
  const cls = `${styles.item} ${current ? styles.current : ''}`;
  return item.external ? (
    <a href={item.href} className={cls}>
      {body}
    </a>
  ) : (
    <Link href={item.href} className={cls} aria-current={current ? 'page' : undefined}>
      {body}
    </Link>
  );
}

export function SidebarNavigation() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.list}>
        {NAV.map((item) => (
          <li key={item.label}>
            <Item item={item} current={!item.external && item.href === pathname} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
