import { Badge } from '@/components/ui/Badge';
import type { Option } from '@/types/odata';
import type { MasterConfig, Row } from './types';

const text = (r: Row, key: string): string => {
  const v = r[key];
  return v === null || v === undefined || v === '' ? '—' : String(v);
};
const str = (r: Row, key: string): string => (r[key] === null || r[key] === undefined ? '' : String(r[key]));

/** Empty strings become null so that clearing a field in the form clears it in the service. */
const nullable = (v: string): string | null => (v.trim() === '' ? null : v.trim());

const EMPLOYEE_STATUS: Option[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const q = encodeURIComponent;
const DEPARTMENTS = { path: `DepartmentSrv?$select=dept_ID,name&$filter=${q('IsActiveEntity eq true')}&$orderby=${q('name asc')}&$top=500`, value: 'dept_ID', label: 'name' };

export const EMPLOYEES: MasterConfig = {
  slug: 'employees',
  title: 'Employees',
  subtitle: 'People who can hold hardware assets.',
  singular: 'employee',
  plural: 'employees',
  entity: 'EmployeeSrv',
  idField: 'employee_ID',
  titleField: 'fullName',
  select: ['employee_ID', 'fullName', 'email', 'phone', 'location', 'status', 'department_dept_ID'],
  expand: 'department($select=name)',
  baseFilter: 'IsActiveEntity eq true',
  searchFields: ['fullName', 'email', 'location'],
  searchPlaceholder: 'Name, email or location',
  sortFields: ['fullName', 'email', 'location', 'status'],
  defaultSort: 'fullName',
  columns: [
    { id: 'fullName', header: 'Name', sortKey: 'fullName', render: (r) => <strong>{text(r, 'fullName')}</strong> },
    { id: 'email', header: 'Email', sortKey: 'email', render: (r) => text(r, 'email') },
    { id: 'department', header: 'Department', render: (r) => String((r.department as { name?: string } | null)?.name ?? '—') },
    { id: 'location', header: 'Location', sortKey: 'location', render: (r) => text(r, 'location') },
    { id: 'phone', header: 'Phone', nowrap: true, render: (r) => text(r, 'phone') },
    {
      id: 'status',
      header: 'Status',
      sortKey: 'status',
      render: (r) => <Badge tone={str(r, 'status') === 'Active' ? 'good' : 'neutral'}>{text(r, 'status')}</Badge>,
    },
  ],
  selectFilters: [
    { key: 'status', label: 'Status', field: 'status', options: EMPLOYEE_STATUS },
    { key: 'department', label: 'Department', field: 'department_dept_ID', lookup: DEPARTMENTS },
  ],
  formLookups: { department_dept_ID: DEPARTMENTS },
  fields: (l) => [
    { name: 'fullName', label: 'Full name', type: 'text', required: true, maxLength: 120 },
    { name: 'email', label: 'Email', type: 'text', required: true, maxLength: 120, hint: 'Also the login name that lets this person see their own assets.' },
    { name: 'phone', label: 'Phone', type: 'text', maxLength: 20 },
    { name: 'location', label: 'Location', type: 'text', maxLength: 100 },
    { name: 'department_dept_ID', label: 'Department', type: 'select', options: l.department_dept_ID ?? [] },
    { name: 'status', label: 'Status', type: 'select', required: true, options: EMPLOYEE_STATUS, hint: 'Only active employees can be assigned assets.' },
  ],
  createAction: 'createEmployee',
  updateAction: 'updateEmployee',
  // An employee keeps their ownership history, so they are set to Inactive instead of being deleted.
  canDelete: 'Employees are kept for the ownership history. Set the employee to Inactive instead.',
  payload: (v) => ({
    fullName: v.fullName?.trim(),
    email: v.email?.trim(),
    phone: nullable(v.phone ?? ''),
    location: nullable(v.location ?? ''),
    status: v.status,
    department_dept_ID: nullable(v.department_dept_ID ?? ''),
  }),
  initial: (r) => ({
    fullName: str(r, 'fullName'),
    email: str(r, 'email'),
    phone: str(r, 'phone'),
    location: str(r, 'location'),
    status: str(r, 'status') || 'Active',
    department_dept_ID: str(r, 'department_dept_ID'),
  }),
};

export { text, str, nullable };
