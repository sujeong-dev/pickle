import { http, HttpResponse } from 'msw';
import type {
  GroupCategory,
  GroupListItem,
  GroupDetail,
} from '@/entities/group';

const now = Date.now();

const mockGroups: GroupDetail[] = [
  {
    id: 'g-1',
    store: 'costco',
    branch: '양재점',
    category: 'share',
    productName: '커클랜드 닭가슴살 2.27kg',
    targetCount: 4,
    currentCount: 2,
    pricePerPerson: 7000,
    location: '양재역 1번 출구',
    meetAt: new Date(now + 6 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    sido: '서울특별시',
    sigungu: '서초구',
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    hostNickname: '소분요정',
    isMine: false,
    isParticipating: false,
    description: '냉동실에 자리 있으신 분들 환영합니다. 절반씩 나눠가져요!',
    participants: null,
  },
  {
    id: 'g-2',
    store: 'traders',
    branch: '하남점',
    category: 'group_buy',
    productName: '바스 슬라이드 트레이 6입',
    targetCount: 3,
    currentCount: 1,
    pricePerPerson: 12000,
    location: '하남시청 앞',
    meetAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    sido: '경기도',
    sigungu: '하남시',
    createdAt: new Date(now - 30 * 60 * 1000).toISOString(),
    hostNickname: '코스트코단골',
    isMine: true,
    isParticipating: false,
    description: '직접 픽업해서 나눠드립니다.',
    participants: [
      { userId: 'u-2', nickname: '주말쇼퍼', joinedAt: new Date(now - 10 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'g-3',
    store: 'costco',
    branch: '일산점',
    category: 'split',
    productName: '코스트코 픽업 차량 분담',
    targetCount: 2,
    currentCount: 2,
    pricePerPerson: 5000,
    location: '대화역 3번 출구',
    meetAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
    status: 'done',
    sido: '경기도',
    sigungu: '고양시',
    createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    hostNickname: '실속러',
    isMine: false,
    isParticipating: true,
    description: '주차비/유류비 반반씩!',
    participants: null,
  },
];

function toListItem(g: GroupDetail): GroupListItem {
  // GroupListItem은 description / participants를 가지지 않음 (목록 응답)
  const { description: _description, participants: _participants, ...rest } = g;
  void _description; void _participants;
  return rest;
}

export const groupHandlers = [
  // GET /api/groups
  http.get('*/groups', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as 'open' | 'done' | null;
    const category = url.searchParams.get('category') as GroupCategory | null;
    const store = url.searchParams.get('store');

    let items = mockGroups.slice();
    if (status) items = items.filter((g) => g.status === status);
    if (category) items = items.filter((g) => g.category === category);
    if (store) items = items.filter((g) => g.store === store);

    return HttpResponse.json({
      items: items.map(toListItem),
      limit: 20,
      hasNext: false,
      nextCursor: null,
    });
  }),

  // GET /api/groups/:id
  http.get('*/groups/:id', ({ params }) => {
    const { id } = params as { id: string };
    const found = mockGroups.find((g) => g.id === id);
    if (!found) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', timestamp: new Date().toISOString(), path: `/api/groups/${id}` },
        { status: 404 },
      );
    }
    // host(isMine)가 아니면 participants는 null로 내려야 함
    const payload: GroupDetail = found.isMine
      ? found
      : { ...found, participants: null };
    return HttpResponse.json(payload);
  }),

  // POST /api/groups
  http.post('*/groups', async ({ request }) => {
    const body = (await request.json()) as Partial<GroupDetail>;
    const created: GroupDetail = {
      id: `g-${Date.now()}`,
      store: body.store ?? null,
      branch: body.branch ?? null,
      category: (body.category ?? 'share') as GroupCategory,
      productName: body.productName ?? '',
      targetCount: body.targetCount ?? 2,
      currentCount: 1,
      pricePerPerson: body.pricePerPerson ?? null,
      location: body.location ?? '',
      meetAt: body.meetAt ?? new Date().toISOString(),
      status: 'open',
      sido: '서울특별시',
      sigungu: '서초구',
      createdAt: new Date().toISOString(),
      hostNickname: '나',
      isMine: true,
      isParticipating: false,
      description: body.description ?? null,
      participants: [],
    };
    mockGroups.unshift(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  // PATCH /api/groups/:id
  http.patch('*/groups/:id', async ({ params, request }) => {
    const { id } = params as { id: string };
    const idx = mockGroups.findIndex((g) => g.id === id);
    if (idx === -1) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', timestamp: new Date().toISOString(), path: `/api/groups/${id}` },
        { status: 404 },
      );
    }
    if (mockGroups[idx].status !== 'open') {
      return HttpResponse.json(
        { statusCode: 409, error: 'CONFLICT', message: '모집 중일 때만 수정할 수 있어요.', timestamp: new Date().toISOString(), path: `/api/groups/${id}` },
        { status: 409 },
      );
    }
    const patch = (await request.json()) as Partial<GroupDetail>;
    mockGroups[idx] = { ...mockGroups[idx], ...patch };
    return HttpResponse.json(mockGroups[idx]);
  }),

  // DELETE /api/groups/:id
  http.delete('*/groups/:id', ({ params }) => {
    const { id } = params as { id: string };
    const idx = mockGroups.findIndex((g) => g.id === id);
    if (idx === -1) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', timestamp: new Date().toISOString(), path: `/api/groups/${id}` },
        { status: 404 },
      );
    }
    mockGroups.splice(idx, 1);
    return HttpResponse.json({ id, deletedAt: new Date().toISOString() });
  }),

  // PATCH /api/groups/:id/participation
  http.patch('*/groups/:id/participation', async ({ params, request }) => {
    const { id } = params as { id: string };
    const idx = mockGroups.findIndex((g) => g.id === id);
    if (idx === -1) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', timestamp: new Date().toISOString(), path: `/api/groups/${id}/participation` },
        { status: 404 },
      );
    }
    const target = mockGroups[idx];
    const { participate } = (await request.json()) as { participate: boolean };

    if (target.status === 'done') {
      return HttpResponse.json(
        { statusCode: 409, error: 'CONFLICT', message: '마감된 모집이에요.', timestamp: new Date().toISOString(), path: `/api/groups/${id}/participation` },
        { status: 409 },
      );
    }
    if (target.isMine) {
      return HttpResponse.json(
        { statusCode: 409, error: 'CONFLICT', message: '본인 모집글에는 참여할 수 없어요.', timestamp: new Date().toISOString(), path: `/api/groups/${id}/participation` },
        { status: 409 },
      );
    }
    if (participate && target.currentCount >= target.targetCount) {
      return HttpResponse.json(
        { statusCode: 409, error: 'CONFLICT', message: '모집 인원이 가득 찼어요.', timestamp: new Date().toISOString(), path: `/api/groups/${id}/participation` },
        { status: 409 },
      );
    }
    if (new Date(target.meetAt).getTime() < Date.now()) {
      return HttpResponse.json(
        { statusCode: 409, error: 'CONFLICT', message: '약속 시간이 이미 지났어요.', timestamp: new Date().toISOString(), path: `/api/groups/${id}/participation` },
        { status: 409 },
      );
    }

    target.isParticipating = participate;
    target.currentCount = Math.max(
      1,
      target.currentCount + (participate ? 1 : -1),
    );
    return HttpResponse.json({
      id,
      status: target.status,
      targetCount: target.targetCount,
      currentCount: target.currentCount,
      isParticipating: target.isParticipating,
    });
  }),

  // PATCH /api/groups/:id/status
  http.patch('*/groups/:id/status', async ({ params, request }) => {
    const { id } = params as { id: string };
    const idx = mockGroups.findIndex((g) => g.id === id);
    if (idx === -1) {
      return HttpResponse.json(
        { statusCode: 404, error: 'NOT_FOUND', timestamp: new Date().toISOString(), path: `/api/groups/${id}/status` },
        { status: 404 },
      );
    }
    const { status } = (await request.json()) as { status: 'open' | 'done' };
    if (!mockGroups[idx].isMine) {
      return HttpResponse.json(
        { statusCode: 403, error: 'FORBIDDEN', timestamp: new Date().toISOString(), path: `/api/groups/${id}/status` },
        { status: 403 },
      );
    }
    mockGroups[idx].status = status;
    return HttpResponse.json({ id, status });
  }),
];
