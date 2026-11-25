'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { AppHeader } from './AppHeader';
import { SidebarNavigation } from './SidebarNavigation';
import styles from './AppShell.module.css';

const STORAGE_KEY = 'asset-lifecycle:sidebar-collapsed';
const PANEL_ID = 'main-navigation';

/** Header on top, collapsible navigation on the left, page content in the remaining space. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // The choice is remembered per browser. Storage can be blocked, so every access is guarded.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      /* keep the default */
    }
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(STORAGE_KEY, c ? '0' : '1');
      } catch {
        /* not remembered, still works */
      }
      return !c;
    });
  };

  return (
    <div className={styles.shell}>
      <AppHeader />
      <div className={`${styles.body} ${collapsed ? styles.bodyCollapsed : ''}`}>
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
          <button
            type="button"
            className={styles.toggle}
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-controls={PANEL_ID}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <Icon name="sidebar" size={20} />
          </button>
          <SidebarNavigation id={PANEL_ID} collapsed={collapsed} />
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
