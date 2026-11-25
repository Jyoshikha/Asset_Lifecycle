import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { MasterPage } from '@/components/master/MasterPage';

export const metadata: Metadata = { title: 'Employees | Asset Lifecycle' };

export default function Page() {
  return (
    <PageFrame>
      <MasterPage slug="employees" />
    </PageFrame>
  );
}
