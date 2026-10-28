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
  { label: 'Hardware assets', icon: 'laptop', href: `${UI5}/assets/index.html`, external: true },
  { label: 'Employees', icon: 'user', href: `${UI5}/employees/index.html`, external: true },
  { label: 'Departments', icon: 'org', href: `${UI5}/departments/index.html`, external: true },
  { label: 'Categories', icon: 'grid', href: `${UI5}/categories/index.html`, external: true },
  { label: 'Vendors', icon: 'store', href: `${UI5}/vendors/index.html`, external: true },
  { label: 'Maintenance', icon: 'wrench', href: `${UI5}/maintenance/index.html`, external: true },
  { label: 'Retirement & archive', icon: 'archive', href: `${UI5}/archive/index.html`, external: true },
  { label: 'Reports', icon: 'reports', href: '#', external: false, unavailable: 'Reports are not built yet' },
  { label: 'Settings', icon: 'settings', href: '#', external: false, unavailable: 'Settings are not built yet' },
];

/**
 * Where a shortcut lands. The status parameter is passed to the UI5 Assets list as a start-up filter;
 * this has not been verified in the UI5 app, so the migrated Assets page should own filtering.
 */
export const assetsUrl = (status?: string) =>
  `${UI5}/assets/index.html${status ? `?status=${encodeURIComponent(status)}` : ''}`;

export const maintenanceUrl = `${UI5}/maintenance/index.html`;
