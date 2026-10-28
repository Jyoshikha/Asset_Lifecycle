import styles from './Badge.module.css';

type Props = { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'danger' };

/** Status labels always carry text; colour only reinforces it. */
export function Badge({ children, tone = 'neutral' }: Props) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
