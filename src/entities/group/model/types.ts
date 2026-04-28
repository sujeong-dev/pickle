export type GroupStatus = 'open' | 'done';
export type GroupStore = 'costco' | 'traders';

export const GROUP_STATUS_LABEL: Record<GroupStatus, string> = {
  open: '모집중',
  done: '마감',
};

export const GROUP_STORE_LABEL: Record<GroupStore, string> = {
  costco: '코스트코',
  traders: '트레이더스',
};

export type GroupParticipant = {
  userId: string;
  nickname: string;
  joinedAt: string;
};

export type GroupListItem = {
  id: string;
  store: GroupStore | null;
  branch: string | null;
  productName: string;
  targetCount: number;
  currentCount: number;
  pricePerPerson: number | null;
  location: string;
  meetAt: string;
  status: GroupStatus;
  sido: string;
  sigungu: string;
  createdAt: string;
  hostNickname: string;
  isMine: boolean;
  isParticipating: boolean;
};

export type GroupDetail = GroupListItem & {
  description: string | null;
  participants?: GroupParticipant[] | null;
};
