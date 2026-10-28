import styles from './Text.module.css';

type TextProps = {
  children: React.ReactNode;
  tone?: 'default' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
};

export function Text({ children, tone = 'default', size = 'md', className }: TextProps) {
  return <span className={[styles.text, styles[tone], styles[size], className].filter(Boolean).join(' ')}>{children}</span>;
}

type HeadingProps = {
  children: React.ReactNode;
  level: 1 | 2 | 3;
  id?: string;
};

export function Heading({ children, level, id }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={styles[`h${level}`]}>
      {children}
    </Tag>
  );
}
