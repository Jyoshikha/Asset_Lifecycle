import type { IconName } from '@/components/ui/Icon';

// The existing UI5 apps stay in use until each page is migrated to this app.
const UI5 = process.env.NEXT_PUBLIC_UI5_URL ?? 'http://localhost:4004';

export type NavItemConfig = {
  label: string;
  icon: IconName;
  href: string;
  external: boolean;
  /** Set when the destination does not exist yet; the item is shown disabled with this reason. */
  unavailable?: string;
};

export const NAV: NavItemConfig[] = [
  { label: 'Overview', icon: 'overview', href: '/launch-admin', external: false },
  { label: 'Hardware assets', icon: 'laptop', href: '/assets', external: false },
  { label: 'Employees', icon: 'user', href: `${UI5}/employees/index.html`, external: true },
  { label: 'Departments', icon: 'org', href: `${UI5}/departments/index.html`, external: true },
  { label: 'Categories', icon: 'grid', href: `${UI5}/categories/index.html`, external: true },
  { label: 'Vendors', icon: 'store', href: `${UI5}/vendors/index.html`, external: true },
  { label: 'Maintenance', icon: 'wrench', href: `${UI5}/maintenance/index.html`, external: true },
  { label: 'Retirement & archive', icon: 'archive', href: `${UI5}/archive/index.html`, external: true },
  { label: 'Reports', icon: 'reports', href: '#', external: false, unavailable: 'Reports are not built yet' },
  { label: 'Settings', icon: 'settings', href: '#', external: false, unavailable: 'Settings are not built yet' },
];

/** The assets list, optionally filtered by status or by warranties ending within 30 days. */
export function assetsUrl(opts: { status?: string; warranty?: boolean } = {}): string {
  const p = new URLSearchParams();
  if (opts.status) p.set('status', opts.status);
  if (opts.warranty) p.set('warranty', '30');
  const qs = p.toString();
  return qs ? `/assets?${qs}` : '/assets';
}

export const maintenanceUrl = `${UI5}/maintenance/index.html`;
