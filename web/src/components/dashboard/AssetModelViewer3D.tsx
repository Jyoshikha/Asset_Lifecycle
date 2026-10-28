'use client';

import dynamic from 'next/dynamic';
import { Panel } from '@/components/ui/Panel';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';

// three.js is loaded only when this card renders, and never on the server.
const ModelCanvas = dynamic(() => import('./ModelCanvas'), {
  ssr: false,
  loading: () => <Skeleton height={190} />,
});

/** Optional 3D preview. It shows a generic shape until assets have models to display. */
export function AssetModelViewer3D() {
  return (
    <Panel title="Asset preview" subtitle="Drag to rotate">
      <ModelCanvas />
      <Text tone="muted" size="sm">Generic hardware shape. Not linked to a selected asset yet.</Text>
    </Panel>
  );
}
