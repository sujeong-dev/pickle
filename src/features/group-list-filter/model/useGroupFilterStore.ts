import { create } from 'zustand';
import type { GroupCategory, GroupStatus } from '@/entities/group';

export type CategoryFilter = GroupCategory | 'all';

interface GroupFilterStore {
  category: CategoryFilter;
  status: GroupStatus | undefined;
  setCategory: (category: CategoryFilter) => void;
  setStatus: (status: GroupStatus | undefined) => void;
  reset: () => void;
}

export const useGroupFilterStore = create<GroupFilterStore>((set) => ({
  category: 'all',
  status: 'open',
  setCategory: (category) => set({ category }),
  setStatus: (status) => set({ status }),
  reset: () => set({ category: 'all', status: 'open' }),
}));
