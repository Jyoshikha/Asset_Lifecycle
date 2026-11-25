import Link from 'next/link';
import { Icon, type IconName } from './Icon';
import styles from './Button.module.css';

type LinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'quiet';
  icon?: IconName;
};

/** A link that looks like a button. Absolute URLs (the UI5 apps) render as ordinary anchors. */
export function LinkButton({ href, children, variant = 'quiet', icon }: LinkProps) {
  return (
    <Link href={href} className={`${styles.button} ${styles[variant]}`}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </Link>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'quiet' | 'danger';
  icon?: IconName;
  busy?: boolean;
  /** When set the button is shown disabled and this text explains why. It stays focusable so the reason can be read. */
  unavailable?: string;
};

export function Button({ children, onClick, type = 'button', variant = 'quiet', icon, busy = false, unavailable }: ButtonProps) {
  const off = Boolean(unavailable) || busy;
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${unavailable ? styles.off : ''}`}
      onClick={off ? undefined : onClick}
      aria-disabled={off || undefined}
      title={unavailable}
    >
      {icon && <Icon name={icon} size={16} />}
      {busy ? 'Working…' : children}
    </button>
  );
}
