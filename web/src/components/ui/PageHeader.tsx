import Link from 'next/link';
import { Heading, Text } from './Text';
import styles from './PageHeader.module.css';

export type Crumb = { label: string; href?: string };

type Props = {
  crumbs: Crumb[];
  title: React.ReactNode;
  /** A status shown next to the title. */
  badge?: React.ReactNode;
  /** A tile shown before the title (for example an icon). */
  leading?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageHeader({ crumbs, title, badge, leading, subtitle, actions }: Props) {
  return (
    <header className={styles.header}>
      <nav aria-label="Breadcrumb">
        <ol className={styles.crumbs}>
          {crumbs.map((c, i) => (
            <li key={c.label} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.row}>
        <div className={styles.identity}>
          {leading}
          <div className={styles.title}>
            <div className={styles.titleLine}>
              <Heading level={1}>{title}</Heading>
              {badge}
            </div>
            {subtitle && <Text tone="muted">{subtitle}</Text>}
          </div>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}
