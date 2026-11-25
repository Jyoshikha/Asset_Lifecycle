'use client';

import { MasterListPage } from './MasterListPage';
import { EMPLOYEES } from './entities';

// The configs hold functions (cell renderers, form builders), so they are looked up here, on the client side,
// and the route files only pass a plain name.
const CONFIGS = { employees: EMPLOYEES };

export function MasterPage({ slug }: { slug: keyof typeof CONFIGS }) {
  return <MasterListPage config={CONFIGS[slug]} />;
}
