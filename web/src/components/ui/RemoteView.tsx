import type { Remote } from '@/hooks/useOData';
import { Skeleton } from './Skeleton';
import { Text } from './Text';
import styles from './RemoteView.module.css';

type Props<T> = {
  remote: Remote<T>;
  retry: () => void;
  /** Shown while loading; sized like the real content so the card does not jump. */
  placeholder?: React.ReactNode;
  children: (data: T) => React.ReactNode;
};

/** One place that decides what a card shows while loading or after a failure. */
export function RemoteView<T>({ remote, retry, placeholder, children }: Props<T>) {
  if (remote.state === 'loading') {
    return (
      <div role="status" aria-label="Loading">
        {placeholder ?? <Skeleton height={48} />}
      </div>
    );
  }
  if (remote.state === 'error') {
    return (
      <div role="alert" className={styles.error}>
        <Text tone="muted" size="sm">
          Could not load this section. {remote.message}
        </Text>
        <button type="button" className={styles.retry} onClick={retry}>
          Try again
        </button>
      </div>
    );
  }
  return <>{children(remote.data)}</>;
}
