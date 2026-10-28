import { Icon, type IconName } from '@/components/ui/Icon';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Remote } from '@/hooks/useOData';
import styles from './AttentionItem.module.css';

type Props = {
  icon: IconName;
  title: string;
  description: string;
  count: Remote<number>;
  href: string;
  actionLabel: string;
  /** Urgent items use the warning colour only while there is something to do. */
  urgent?: boolean;
};

export function AttentionItem({ icon, title, description, count, href, actionLabel, urgent = false }: Props) {
  const n = count.state === 'ready' ? count.data : null;
  const active = urgent && n !== null && n > 0;
  return (
    <li className={styles.item}>
      <span className={`${styles.icon} ${active ? styles.urgent : ''}`}>
        <Icon name={icon} size={18} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.desc}>{description}</span>
      </span>
      {count.state === 'loading' ? (
        <Skeleton width={24} height={22} />
      ) : (
        <span className={styles.count} title={count.state === 'error' ? count.message : undefined}>
          {n ?? '—'}
        </span>
      )}
      <a href={href} className={styles.action}>
        {actionLabel}
        <Icon name="arrow" size={14} />
      </a>
    </li>
  );
}
