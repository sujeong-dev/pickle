import { HTTPError } from 'ky';
import { api } from './kyInstance';
import type { AuthErrorBody } from './auth';
import type {
  GroupStatus,
  GroupStore,
  GroupListItem,
  GroupDetail,
} from '@/entities/group';

export interface GroupListParams {
  status?: GroupStatus;
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

export type GroupComment = {
  id: string;
  content: string;
  createdAt: string;
  authorNickname: string;
  authorProfileImage: string | null;
  isMine: boolean;
};

export type GroupCommentListResponse = {
  items: GroupComment[];
  limit: number;
  hasNext: boolean;
  nextCursor: string | null;
};

export function getGroupComments(
  groupId: string,
  params?: { limit?: number; cursor?: string },
): Promise<GroupCommentListResponse> {
  const searchParams: Record<string, string | number> = {};
  if (params?.limit !== undefined) searchParams.limit = params.limit;
  if (params?.cursor !== undefined) searchParams.cursor = params.cursor;
  return api
    .get(
      `groups/${groupId}/comments`,
      Object.keys(searchParams).length ? { searchParams } : undefined,
    )
    .json<GroupCommentListResponse>();
}

export function createGroupComment(
  groupId: string,
  content: string,
): Promise<GroupComment> {
  return api
    .post(`groups/${groupId}/comments`, { json: { content } })
    .json<GroupComment>();
}

export function deleteGroupComment(
  groupId: string,
  commentId: string,
): Promise<{ id: string }> {
  return api
    .delete(`groups/${groupId}/comments/${commentId}`)
    .json<{ id: string }>();
}

export async function getGroupErrorMessage(error: unknown): Promise<string> {
  if (!(error instanceof HTTPError)) return '요청에 실패했어요.';
  let body: Partial<AuthErrorBody> = {};
  try {
    body = await error.response.clone().json();
  } catch {}

  const status = error.response.status;
  if (status === 403) return '본인 모집글에서만 가능한 작업이에요.';
  if (status === 404) return '존재하지 않는 모집글이에요.';
  if (status === 409) {
    const path = body.path ?? '';
    if (path.includes('/participation')) return '참여할 수 없는 상태예요. (정원 초과 / 마감 / 시간 경과)';
    if (path.includes('/status')) return '이미 마감된 모집이에요.';
    return '모집 중일 때만 수정할 수 있어요.';
  }
  if (status === 400) return body.error === 'VALIDATION_ERROR' ? '입력값을 다시 확인해주세요.' : '잘못된 요청이에요.';
  return '요청에 실패했어요.';
}
