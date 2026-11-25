import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { AssetsListPage } from '@/components/assets/AssetsListPage';

export const metadata: Metadata = { title: 'Hardware assets | Asset Lifecycle' };

export default function Page() {
  return (
    <PageFrame>
      <AssetsListPage />
    </PageFrame>
  );
}
