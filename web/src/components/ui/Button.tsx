import Link from 'next/link';
import { Icon, type IconName } from './Icon';
import styles from './Button.module.css';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'quiet';
  icon?: IconName;
  external?: boolean;
};

/** A link that looks like a button. External targets (the UI5 apps) open as plain anchors. */
export function LinkButton({ href, children, variant = 'quiet', icon, external = false }: Props) {
  const cls = `${styles.button} ${styles[variant]}`;
  const content = (
    <>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
