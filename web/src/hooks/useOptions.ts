'use client';

import type { Option } from '@/types/odata';
import { useLookup } from './useList';

/** Options for a select, read from the service once. An empty list is shown until it arrives or if it fails. */
export function useOptions(path: string | null, valueField: string, labelField: string): Option[] {
  const { result } = useLookup<Record<string, string | null>>(path);
  return result.state === 'ready'
    ? result.data.map((r) => ({ value: String(r[valueField] ?? ''), label: String(r[labelField] ?? '') }))
    : [];
}

const q = encodeURIComponent;

export const CATEGORY_OPTIONS = `AssetCategorieSrv?$select=category_ID,name&$orderby=${q('name asc')}&$top=500`;
export const VENDOR_OPTIONS = `VendorSrv?$select=vendor_ID,name&$orderby=${q('name asc')}&$top=500`;
export const DEPARTMENT_OPTIONS = `DepartmentSrv?$select=dept_ID,name&$orderby=${q('name asc')}&$top=500`;
export const ACTIVE_EMPLOYEE_OPTIONS =
  `EmployeeSrv?$select=employee_ID,fullName&$filter=${q("status eq 'Active'")}&$orderby=${q('fullName asc')}&$top=1000`;
