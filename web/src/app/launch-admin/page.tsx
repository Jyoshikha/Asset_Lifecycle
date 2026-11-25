import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = { title: 'Admin dashboard | Asset Lifecycle' };

export default function LaunchAdminPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
