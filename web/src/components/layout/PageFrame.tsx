import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { AppShell } from './AppShell';

/** The shell plus the Suspense boundary that pages reading the URL (search, filters, page) need. */
export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={<Skeleton height={200} />}>{children}</Suspense>
    </AppShell>
  );
}
