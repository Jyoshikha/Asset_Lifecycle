'use client';

import {
  fetchCategoryCounts,
  fetchOverdueMaintenance,
  fetchRecentActivity,
  fetchStatusCounts,
  fetchWarrantyExpiring,
} from '@/lib/queries';
import { useRemote } from './useOData';

// One hook per figure, so a failing request only affects the cards that use it.
export const useStatusCounts = () => useRemote(fetchStatusCounts);
export const useCategoryCounts = () => useRemote(fetchCategoryCounts);
export const useWarrantyExpiring = () => useRemote(fetchWarrantyExpiring);
export const useOverdueMaintenance = () => useRemote(fetchOverdueMaintenance);
export const useRecentActivity = () => useRemote((signal) => fetchRecentActivity(signal));
