import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { AssetDetailPage } from '@/components/assets/AssetDetailPage';

export const metadata: Metadata = { title: 'Asset | Asset Lifecycle' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageFrame>
      <AssetDetailPage id={id} />
    </PageFrame>
  );
}
