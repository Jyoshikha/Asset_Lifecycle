import { Heading, Text } from '@/components/ui/Text';
import { LinkButton } from '@/components/ui/Button';
import { assetsUrl } from '@/lib/nav';
import styles from './DashboardToolbar.module.css';

export function DashboardToolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.title}>
        <Heading level={1}>Asset lifecycle overview</Heading>
        <Text tone="muted">Monitor inventory, ownership and lifecycle operations.</Text>
      </div>
      <LinkButton href={assetsUrl()} variant="primary" icon="plus" external>
        Register asset
      </LinkButton>
    </div>
  );
}
