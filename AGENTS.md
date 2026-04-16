# 피클 (Pickle) 프로젝트 컨벤션

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Tech Stack

- **Next.js 16** (App Router, RSC enabled)
- **React 19** with TypeScript
- **Tailwind CSS v4** — uses `@theme inline` blocks in `app/globals.css`, no `tailwind.config.js`
- **lucide-react** (`@lucide-react`) — iconLibrary
- **TanStack Query v5**
- **Zustand**
- **ky** (fetch 기반 HTTP 클라이언트)
- **MSW v2** (API 목킹)

---

## 아키텍처: FSD (Feature-Sliced Design)

레이어 의존 방향: `app → pages → widgets → features → entities → shared`
상위 레이어만 하위 레이어를 참조할 수 있습니다. 역방향 참조 금지.

> **Next.js App Router + FSD 폴더 구조 안내**
> - `app/`은 Next.js App Router 전용으로 루트에 위치합니다. (Next.js 요구사항)
> - FSD 레이어(shared, entities, features, widgets)는 `src/` 하위에 위치합니다.
> - FSD **pages 레이어**는 `src/pages/` 에 위치합니다. Next.js Pages Router가 아닙니다.
> - FSD 레이어는 `index.ts` 파일에서 export된 파일들만 import할 수 있습니다.
> - import시 `index.ts` 파일명은 생략합니다.
> - `tsconfig.json`의 `@/*`는 `./src/*`로 설정되어 있습니다. (`@/shared/ui/...` → `src/shared/ui/...`)

```
pickle/
├── app/              # Next.js App Router (루트 고정, 라우팅 진입점만)
│   ├── page.tsx           # → src/pages/landing/ui/LandingPage.tsx import
│   ├── [route]/page.tsx   # → src/pages/[route]/ui/[Route]Page.tsx import
│   ├── layout.tsx
│   └── globals.css
│
├── src/              # FSD 레이어 루트 (@/* alias 기준)
│   ├── pages/        # FSD pages 레이어 (실제 페이지 마크업 위치)
│   │   └── [page-name]/
│   │       └── ui/
│   │           └── [PageName]Page.tsx
│   │
│   ├── shared/
│   │   ├── api/      # HTTP 호출 함수 + 타입 (공통)
│   │   │   ├── kyInstance.ts   # 🔒 읽기 전용 - 수정 금지
│   │   │   ├── index.ts
│   │   │   └── [도메인].ts
│   │   ├── mocks/    # MSW 목킹
│   │   │   ├── browser.ts
│   │   │   ├── index.ts        # 🔒 Orchestrator만 수정
│   │   │   └── handlers/
│   │   │       └── [도메인].ts
│   │   ├── model/
│   │   │   └── toastStore.ts
│   │   ├── ui/       # 🔒 읽기 전용 - 수정 금지
│   │   ├── lib/
│   │   └── config/
│   │       ├── routes.ts       # 라우트 상수
│   │       └── tokens.ts       # 디자인 토큰
│   │
│   ├── entities/     # 도메인 객체 (공통 타입)
│   │   └── [entity-name]/
│   │       ├── ui/
│   │       └── model/
│   │
│   ├── features/     # 단일 사용자 액션 단위
│   │   └── [feature-name]/
│   │       ├── ui/
│   │       ├── model/          # Zustand store
│   │       └── api/            # TanStack Query hooks
│   │
│   └── widgets/      # 여러 feature/entity를 조합한 독립 UI 블록
│       └── [widget-name]/
│           └── ui/
│
└── public/
```

---

## 페이지 마크업 규칙 ⚠️

**실제 페이지 마크업은 반드시 `src/pages/`에 위치해야 합니다.**

`app/` 디렉토리의 `page.tsx`는 라우팅 진입점 역할만 하며, `src/pages/`의 페이지 컴포넌트를 import하여 렌더링합니다.

```tsx
// ✅ app/page.tsx (진입점만)
import { LandingPage } from '@/pages/landing/ui/LandingPage';
export default function Page() {
  return <LandingPage />;
}

// ✅ src/pages/landing/ui/LandingPage.tsx (실제 마크업)
export function LandingPage() {
  return <main>...</main>;
}

// ❌ app/page.tsx에 직접 마크업 금지
```

**파일 경로 규칙:**
- 페이지 컴포넌트: `src/pages/[페이지명]/ui/[페이지명]Page.tsx`
- Next.js 진입점: `app/[라우트]/page.tsx` → import만 함

---

## 레이어별 핵심 규칙

각 레이어는 **세그먼트**(`ui/`, `model/`, `api/`, `lib/`)로 구성되며, `index.ts`를 통해 공개 API를 노출합니다.

**`shared/`**
- ✅ 이벤트 핸들러 props 수신 가능
- ✅ 스타일 props 수신 가능
- ✅ 도메인 지식 없는 순수 UI / 유틸리티만
- ❌ 비즈니스 로직 금지

**`entities/`**
- ✅ 도메인 객체의 순수 표현 컴포넌트 (읽기 전용)
- ✅ 데이터 모델, 타입, 검증 스키마
- ❌ 사이드이펙트, 상태관리 금지
- ❌ 인터랙션 로직 금지 (그건 features의 역할)

**`features/`**
- ✅ 단일 사용자 액션 단위 (필터링, 생성, 수정, 삭제 등)
- ✅ 액션별 상태는 `model/` 훅으로 분리
- ✅ 도메인 특화 UI는 `ui/`에 위치 (Dialog, Form, Filter 등)
- ❌ 상위 레이어로부터 이벤트 핸들러 props 수신 금지
- ❌ 같은 레이어의 다른 feature slice 참조 금지

**`widgets/`**
- ✅ 여러 feature/entity를 조합한 독립적인 UI 블록
- ✅ 이벤트 핸들러 props 수신 가능 (pages로부터)
- ✅ 한 페이지에 한 번만 등장해도 위젯으로 구성 가능
- ❌ 같은 레이어의 다른 widget slice 참조 금지

**`pages/`**
- ✅ 라우트 단위 오케스트레이션 — 훅 호출 + 위젯/피처 조합
- ✅ 페이지 전용 데이터 패칭 직접 호출
- ✅ `model/` 서브디렉토리로 페이지 전용 로직 분리 가능
- ❌ 도메인 특화 텍스트/UI를 페이지에 직접 하드코딩 금지 → feature UI로 추출
- ❌ `useState` 등 상태를 직접 선언하지 않음 → 하위 레이어 훅에 위임

**공통 규칙**
- 각 slice의 내부 파일은 반드시 `index.ts`를 통해서만 외부에 노출
- 와일드카드 재내보내기(`export *`) 금지
- 같은 레이어의 다른 slice 참조 금지 (단, `shared`는 예외)

---

## 라우트 상수

모든 페이지 경로는 `src/shared/config/routes.ts`의 `ROUTES` 객체에서 관리합니다.

```ts
import { ROUTES } from '@/shared/config/routes';

// ✅ 상수 사용
<Link href={ROUTES.home} />
router.push(ROUTES.createGroup);

// ❌ 경로 하드코딩 금지
<Link href="/home" />
```

새 페이지 추가 시 `routes.ts`에 항목을 먼저 추가한 뒤 사용합니다.

---

## 컴포넌트 분리 지침 ⚠️

마크업 작업 중 **반복되는 구조**가 발견되면 FSD 레이어 기준에 맞게 컴포넌트로 즉시 분리합니다.

### 분리 기준 판단 흐름

```
반복 구조 발견
    │
    ├─ 도메인 지식 없는 순수 UI?
    │       └─ YES → shared/ui/
    │
    ├─ 특정 도메인 데이터를 표시 (읽기 전용)?
    │       └─ YES → entities/[domain]/ui/
    │
    ├─ 사용자 액션이 포함된 단일 기능?
    │       └─ YES → features/[feature]/ui/
    │
    └─ 여러 feature/entity 조합?
            └─ YES → widgets/[widget]/ui/
```

### shared/ui/ 컴포넌트 위치 규칙

| 종류 | 위치 | 예시 |
|------|------|------|
| 아이콘 SVG | `shared/ui/icons/[Name]Icon.tsx` | `ChevronRightIcon`, `PlusIcon` |
| 기본 UI 컴포넌트 | `shared/ui/[Name].tsx` | `Button`, `CardButton`, `Tab` |

**아이콘 규칙:**
- 파일명: `[Name]Icon.tsx` (PascalCase + Icon 접미사)
- Props: `size?: number`, `className?: string`
- 색상: `fill="currentColor"` 또는 `stroke="currentColor"` — className으로 색 제어
- 비정방형 아이콘: viewBox 비율에 맞게 `width`/`height` 계산
- `icons/index.ts`에 반드시 export 추가

**컴포넌트 규칙:**
- 인라인 SVG가 2곳 이상 사용되면 `shared/ui/icons/`로 분리
- 동일 JSX 구조가 2곳 이상이면 컴포넌트로 추출
- `shared/ui/index.ts`에 반드시 named export 추가

---

## API 구조

### HTTP 클라이언트: ky
- 인스턴스: `src/shared/api/kyInstance.ts`
- REST 호출 함수 + 타입: `src/shared/api/[도메인].ts`
- TanStack Query hooks: `src/features/[기능]/api/use[기능].ts`

### ky 사용 규칙
```typescript
// GET
api.get('endpoint').json<ResponseType>()

// POST (JSON)
api.post('endpoint', { json: body }).json<ResponseType>()

// POST (FormData) - Content-Type 헤더 자동 제거
api.post('endpoint', { body: formData }).json<ResponseType>()

// 에러 처리: ky는 4xx/5xx 자동 throw → HTTPError로 catch
```

### kyInstance.ts (🔒 읽기 전용 - 수정 금지)
```typescript
import ky, { HTTPError } from 'ky'
import { useToastStore } from '@/shared/model/toastStore'

const getAccessToken = () => localStorage.getItem('accessToken')
const getRefreshToken = () => localStorage.getItem('refreshToken')
const setAccessToken = (token: string) => localStorage.setItem('accessToken', token)
const clearTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  hooks: {
    // Request: 토큰 자동 주입
    beforeRequest: [
      (request) => {
        const token = getAccessToken()
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],

    // Response: 401 토큰 갱신 후 재시도
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) return response
        try {
          const refreshed = await ky.post('auth/refresh', {
            prefixUrl: process.env.NEXT_PUBLIC_API_URL,
            json: { refreshToken: getRefreshToken() },
          }).json<{ accessToken: string }>()
          setAccessToken(refreshed.accessToken)
          request.headers.set('Authorization', `Bearer ${refreshed.accessToken}`)
          return ky(request)
        } catch {
          clearTokens()
          window.location.href = '/login'
          return response
        }
      },
    ],

    // Error: 400 / 500 중앙 처리
    beforeError: [
      async (error: HTTPError) => {
        const { response } = error
        const status = response.status
        let body: { message?: string } = {}
        try { body = await response.clone().json() } catch {}

        if (status >= 400 && status < 500) {
          useToastStore.getState().show(body.message ?? '요청에 실패했어요.')
          if (status === 403) window.location.href = '/'
        }
        if (status >= 500) {
          useToastStore.getState().show('서버 오류가 발생했어요.')
          window.location.href = '/error'
        }
        return error
      },
    ],
  },
})
```

### shared/api 규칙
- Swagger: `https://pickle-backend-8hhp.onrender.com/api/docs#/`
- `shared/api/` 파일은 Swagger tag 기준으로 분리
- 각 Agent는 Swagger 전체를 읽고 본인 기능에 필요한 API를 찾아 사용
- 필요한 `shared/api` 파일이 없으면 직접 생성 가능
- 이미 존재하는 파일은 **함수 추가만 가능, 기존 함수 수정 금지**
- 여러 Agent가 같은 파일에 동시 추가 필요 시 → `NEEDS_API.md`에 추가 요청 기록
- `kyInstance.ts` 절대 수정 금지

---

## 코드 컨벤션

### TanStack Query
- 서버 상태는 TanStack Query로 관리
- queryKey 팩토리 패턴 사용
- `useQuery` / `useMutation` / `useInfiniteQuery` 용도에 맞게 구분

```typescript
export const reportKeys = {
  all: ['report'] as const,
  list: () => [...reportKeys.all, 'list'] as const,
  detail: (id: string) => [...reportKeys.all, 'detail', id] as const,
}
```

### Zustand
- 클라이언트 상태만 관리 (서버 상태와 중복 금지)
- step 플로우처럼 페이지 이동 간 유지해야 하는 상태에 사용
- slice 패턴으로 작성

```typescript
interface ReportStore {
  step: number
  formData: Partial<ReportFormData>
  setStep: (step: number) => void
  setFormData: (data: Partial<ReportFormData>) => void
  reset: () => void
}
```

### 마크업
- **Tailwind CSS v4** — `tailwind.config.js` 없음
- 색상 토큰: `app/globals.css`의 `@theme inline` 블록 참조
- 커스텀 토큰 사용: `bg-(--color-primary)`, `text-(--color-gray-500)`
- Figma Auto Layout → `flex` / `flex-col`
- Figma Grid → `grid`
- 모바일 우선 (기준 375px)
- 같은 라우트의 여러 상태(빈 상태, 품절 등) → 조건부 렌더링
- step 플로우 → step별 컴포넌트 분리 후 Zustand로 현재 step 관리

### RSC 규칙
RSC가 활성화되어 있으므로 `useState`, `useEffect`, 이벤트 핸들러, 브라우저 API를 사용하는 컴포넌트는 파일 상단에 `"use client"` 선언 필수.

---

## MSW 목킹 규칙

### 설정 파일
```
src/shared/mocks/
├── browser.ts        # 브라우저 MSW 설정
├── index.ts          # 🔒 Orchestrator만 수정 (핸들러 등록)
└── handlers/
    └── [도메인].ts   # Agent가 직접 생성
```

### browser.ts
```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './index'

export const worker = setupWorker(...handlers)
```

### index.ts (🔒 Orchestrator만 수정)
```typescript
import { authHandlers } from './handlers/auth'
import { productHandlers } from './handlers/product'
import { reportHandlers } from './handlers/report'
import { reviewHandlers } from './handlers/review'
import { userHandlers } from './handlers/user'
import { fileHandlers } from './handlers/file'

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...reportHandlers,
  ...reviewHandlers,
  ...userHandlers,
  ...fileHandlers,
]
```

### Next.js App Router 진입점 (app/layout.tsx)
```typescript
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  const { worker } = await import('@/shared/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

### 각 Agent의 작업 순서
1. Swagger에서 필요한 API 확인
2. `shared/api/[도메인].ts` API 함수 작성
3. `shared/mocks/handlers/[도메인].ts` MSW 핸들러 작성
4. `shared/mocks/index.ts` 직접 수정 금지 → `NEEDS_MSW.md`에 등록 요청 기록
5. `features/[기능]/api/use[기능].ts` TanStack Query hooks 작성
6. UI 연결

### 핸들러 작성 규칙
- Swagger response schema 기반으로 mock 데이터 작성
- 성공 응답 + 에러 케이스 모두 작성
- 실제 API 연동 시 핸들러만 제거하면 되도록 구조 유지

```typescript
// shared/mocks/handlers/report.ts
import { http, HttpResponse } from 'msw'

export const reportHandlers = [
  http.get('/api/reports', () => {
    return HttpResponse.json({
      data: [{ id: '1', productName: '코카콜라', discountRate: 30 }]
    })
  }),

  http.post('/api/reports/ocr', () => {
    return HttpResponse.json({
      productName: '코카콜라 500ml',
      price: 1500,
      discountRate: 30,
    })
  }),

  // 에러 케이스
  http.post('/api/reports', () => {
    return HttpResponse.json(
      { message: '이미 제보된 상품이에요.' },
      { status: 400 }
    )
  }),
]
```

---
## 기능별 Agent 담당 범위
각 경로의 page.tsx 파일의 하위파일들

- 인증 Agent           → app/login
- 홈/상세 Agent        → app/post/page.tsx, app/post/[postId]/, app/product/[productId]/related/
- 제보하기 Agent       → app/post/register/
- 후기리스트/상세 Agent → app/review/page.tsx, app/review/[reviewId]/
- 후기등록 Agent       → app/review/register/
- 마이페이지 Agent     → app/mypage/

## Agent 규칙

### 각 Agent의 담당 범위
```
하나의 Agent = 하나의 기능 전체 (API + MSW + Query + Store + UI)

✅ 자유롭게 수정 가능
  src/features/[본인 기능]/
  src/pages/[본인 기능]/
  src/shared/api/[도메인].ts        ← 없으면 생성, 있으면 함수 추가만
  src/shared/mocks/handlers/[도메인].ts

📖 읽기 전용
  src/shared/api/kyInstance.ts
  src/shared/ui/
  src/entities/

🔒 Orchestrator만 수정
  src/shared/mocks/index.ts          ← 필요 시 NEEDS_MSW.md에 기록

🚫 절대 금지
  다른 Agent 담당 features/ 수정
```

### 실행 순서
```
1단계 (Orchestrator): entities/ 공통 타입 먼저 생성
2단계 (병렬):         각 기능 Agent 동시 실행
3단계 (Orchestrator): NEEDS_MSW.md 기반으로 mocks/index.ts 일괄 업데이트
4단계 (완료 후):      타입 / import 경로 검증
```

### 커밋 규칙
작업을 의미 있는 단위로 나눠서 완료될 때마다 커밋합니다.

**커밋 단위 예시**
- 타입 정의 완료
- API 함수 작성 완료
- MSW 핸들러 작성 완료
- TanStack Query hooks 작성 완료
- Zustand store 작성 완료
- UI 구현 완료

**커밋 메시지 컨벤션**
```
feat: [기능명] [작업내용]

예: feat: 제보하기 MSW 핸들러 작성
예: feat: 제보하기 UI 구현
```

**커밋 전 필수**
- `npx tsc --noEmit` 통과
- 본인 담당 파일만 스테이징
- 새로운 shared 컴포넌트 필요 시 `NEEDS_SHARED.md`에 명세 기록 후 커밋