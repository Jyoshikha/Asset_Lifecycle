import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Remote } from '@/hooks/useOData';
import styles from './MetricCard.module.css';

type Props = {
  label: string;
  icon: IconName;
  value: Remote<number>;
  /** Short line under the value; only facts the data supports (a share, a window), never a trend. */
  hint?: string;
  href: string;
};

/** A summary figure that is also a shortcut to the matching records. */
export function MetricCard({ label, icon, value, hint, href }: Props) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.icon}>
        <Icon name={icon} size={20} />
      </span>
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        {value.state === 'loading' && <Skeleton width={48} height={28} />}
        {value.state === 'error' && (
          <span className={styles.value} title={value.message}>
            —
          </span>
        )}
        {value.state === 'ready' && <span className={styles.value}>{value.data}</span>}
        <span className={styles.hint}>{value.state === 'error' ? 'Could not load' : hint}</span>
      </span>
    </Link>
  );
}
