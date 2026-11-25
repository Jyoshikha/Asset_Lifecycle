import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import styles from './AppHeader.module.css';

function GlobalSearch() {
  // Search needs an index across assets and employees; until then the field is shown disabled with the reason.
  return (
    <div className={styles.search} title="Search arrives with the migrated Assets page">
      <Icon name="search" size={16} />
      <input type="search" disabled placeholder="Search assets, employees" aria-label="Search (not available yet)" />
    </div>
  );
}

function NotificationButton() {
  return (
    <a href="#attention" className={styles.iconButton} aria-label="Go to items that need attention">
      <Icon name="bell" size={18} />
    </a>
  );
}

function UserMenu() {
  // The signed-in person comes from the backend login; the role is what this page is built for.
  return (
    <div className={styles.user}>
      <span className={styles.avatar} aria-hidden="true">
        A
      </span>
      <Text size="sm">Administrator</Text>
    </div>
  );
}

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Icon name="box" size={20} />
        <span>Asset Lifecycle</span>
      </div>
      <GlobalSearch />
      <div className={styles.actions}>
        <NotificationButton />
        <UserMenu />
      </div>
    </header>
  );
}
