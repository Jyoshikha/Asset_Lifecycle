'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { NAV, type NavItemConfig } from '@/lib/nav';
import styles from './SidebarNavigation.module.css';

function Item({ item, current, collapsed }: { item: NavItemConfig; current: boolean; collapsed: boolean }) {
  const body = (
    <>
      <Icon name={item.icon} size={18} />
      <span className={styles.label}>{item.label}</span>
    </>
  );
  // In the rail the text is hidden, so the name is kept for screen readers and shown as a tooltip.
  const name = { 'aria-label': item.label, title: item.unavailable ?? (collapsed ? item.label : undefined) };

  if (item.unavailable) {
    return (
      <span className={`${styles.item} ${styles.disabled}`} aria-disabled="true" role="link" {...name}>
        {body}
      </span>
    );
  }
  const cls = `${styles.item} ${current ? styles.current : ''}`;
  return item.external ? (
    <a href={item.href} className={cls} {...name}>
      {body}
    </a>
  ) : (
    <Link href={item.href} className={cls} aria-current={current ? 'page' : undefined} {...name}>
      {body}
    </Link>
  );
}

export function SidebarNavigation({ id, collapsed }: { id: string; collapsed: boolean }) {
  const pathname = usePathname();
  return (
    <nav id={id} className={`${styles.nav} ${collapsed ? styles.rail : ''}`} aria-label="Main">
      <ul className={styles.list}>
        {NAV.map((item) => (
          <li key={item.label}>
            <Item item={item} collapsed={collapsed} current={!item.external && (item.href === pathname || pathname.startsWith(`${item.href}/`))} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
