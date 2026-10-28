import { Heading, Text } from './Text';
import styles from './TableCard.module.css';

type Props = {
  title: string;
  /** e.g. "9 assets" */
  count?: string;
  /** Controls such as Columns and Density. */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
};

/** The white card around a table, with its title, the result count and the table controls. */
export function TableCard({ title, count, toolbar, children }: Props) {
  return (
    <section className={styles.card} aria-label={title}>
      <header className={styles.header}>
        <div className={styles.title}>
          <Heading level={2}>{title}</Heading>
          {count && (
            <Text tone="muted" size="sm">
              {count}
            </Text>
          )}
        </div>
        {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
      </header>
      {children}
    </section>
  );
}
