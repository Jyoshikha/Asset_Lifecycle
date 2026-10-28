import { Heading, Text } from './Text';
import styles from './Panel.module.css';

type Props = {
  title: string;
  subtitle?: string;
  id?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

/** The white card every dashboard module sits in. */
export function Panel({ title, subtitle, id, action, children }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={styles.panel} aria-labelledby={headingId}>
      <header className={styles.header}>
        <div>
          <Heading level={2} id={headingId}>
            {title}
          </Heading>
          {subtitle && (
            <Text tone="muted" size="sm">
              {subtitle}
            </Text>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
