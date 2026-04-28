import { api } from './kyInstance';
import type {
  GroupCategory,
  GroupStatus,
  GroupStore,
  GroupListItem,
  GroupDetail,
} from '@/entities/group';

export interface GroupListParams {
  status?: GroupStatus;
  category?: GroupCategory;
  store?: GroupStore;
  branch?: string;
  sido?: string;
  cursor?: string;
  limit?: number;
}

export interface GroupListResponse {
  items: GroupListItem[];
  limit: number;
  hasNext: boolean;
  nextCursor: string | null;
}

export interface CreateGroupBody {
  category: GroupCategory;
  productName: string;
  targetCount: number;
  location: string;
  meetAt: string;
  store?: GroupStore;
  branch?: string;
  pricePerPerson?: number;
  description?: string;
}

export type UpdateGroupBody = Partial<CreateGroupBody>;

export interface UpdateParticipationBody {
  participate: boolean;
}

export interface UpdateParticipationResponse {
  id: string;
  status: GroupStatus;
  targetCount: number;
  currentCount: number;
  isParticipating: boolean;
}

export interface UpdateGroupStatusBody {
  status: GroupStatus;
}

export interface UpdateGroupStatusResponse {
  id: string;
  status: GroupStatus;
}

export interface DeleteGroupResponse {
  id: string;
  deletedAt: string;
}

export const groupKeys = {
  all: ['group'] as const,
  list: (params?: GroupListParams) =>
    [...groupKeys.all, 'list', params ?? {}] as const,
  detail: (id: string) => [...groupKeys.all, 'detail', id] as const,
};

function toSearchParams(params?: GroupListParams): Record<string, string | number> | undefined {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as Record<string, string | number>;
}

export function getGroups(params?: GroupListParams): Promise<GroupListResponse> {
  return api
    .get('groups', { searchParams: toSearchParams(params) })
    .json<GroupListResponse>();
}

export function getGroupDetail(id: string): Promise<GroupDetail> {
  return api.get(`groups/${id}`).json<GroupDetail>();
}

export function createGroup(body: CreateGroupBody): Promise<GroupDetail> {
  return api.post('groups', { json: body }).json<GroupDetail>();
}

export function updateGroup(id: string, body: UpdateGroupBody): Promise<GroupDetail> {
  return api.patch(`groups/${id}`, { json: body }).json<GroupDetail>();
}

export function deleteGroup(id: string): Promise<DeleteGroupResponse> {
  return api.delete(`groups/${id}`).json<DeleteGroupResponse>();
}

export function updateGroupParticipation(
  id: string,
  body: UpdateParticipationBody,
): Promise<UpdateParticipationResponse> {
  return api
    .patch(`groups/${id}/participation`, { json: body })
    .json<UpdateParticipationResponse>();
}

export function updateGroupStatus(
  id: string,
  body: UpdateGroupStatusBody,
): Promise<UpdateGroupStatusResponse> {
  return api
    .patch(`groups/${id}/status`, { json: body })
    .json<UpdateGroupStatusResponse>();
}
