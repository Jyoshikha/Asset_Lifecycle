import { AppHeader } from './AppHeader';
import { SidebarNavigation } from './SidebarNavigation';
import styles from './AppShell.module.css';

/** Header on top, navigation on the left, page content in the remaining space. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AppHeader />
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <SidebarNavigation />
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
