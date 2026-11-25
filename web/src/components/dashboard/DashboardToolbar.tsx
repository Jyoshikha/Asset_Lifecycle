import { LinkButton } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

export function DashboardToolbar() {
  return (
    <PageHeader
      crumbs={[{ label: 'Asset Lifecycle' }, { label: 'Overview' }]}
      title="Asset lifecycle overview"
      subtitle="Monitor inventory, ownership and lifecycle operations."
      actions={
        <LinkButton href="/assets?new=1" variant="primary" icon="plus">
          Register asset
        </LinkButton>
      }
    />
  );
}
