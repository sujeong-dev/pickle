import { create } from 'zustand';
import type { GroupStatus } from '@/entities/group';

interface GroupFilterStore {
  status: GroupStatus | undefined;
  setStatus: (status: GroupStatus | undefined) => void;
  reset: () => void;
}

export const useGroupFilterStore = create<GroupFilterStore>((set) => ({
  status: 'open',
  setStatus: (status) => set({ status }),
  reset: () => set({ status: 'open' }),
}));
