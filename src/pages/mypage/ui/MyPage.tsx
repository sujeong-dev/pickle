"use client";

import { BottomNav } from "@/widgets/bottom-nav";

// ── Icons ──────────────────────────────────────────

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#424242" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#424242" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#424242" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#424242" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ChevronRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Bottom nav icons ─────────────────────────────────

// ── Sub-components ───────────────────────────────────

function ActivityRow({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 px-5 py-[13px]">
      <div className="shrink-0 size-6 flex items-center justify-center">{icon}</div>
      <span className="flex-1 text-[16px] text-gray-900">{label}</span>
      <span className="font-bold text-[16px] text-gray-500 shrink-0">{count}</span>
      <ChevronRightIcon />
    </div>
  );
}

function MenuRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-[13px]">
      <span className="text-[16px] text-gray-900">{label}</span>
      <ChevronRightIcon />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────

export function MyPage() {
  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-[1.9px]">
        {/* Profile header */}
        <header className="bg-white flex items-center justify-between px-5 py-3 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => {}}
          >
            <div className="bg-primary-50 rounded-full size-[42px] flex items-center justify-center shrink-0">
              <PersonIcon />
            </div>
            <span className="font-bold text-[20px] text-gray-900">할인사냥꾼</span>
            <ChevronRightIcon size={20} />
          </button>
          <button type="button" aria-label="설정">
            <SettingsIcon />
          </button>
        </header>

        {/* Activity section */}
        <section className="bg-white shrink-0">
          <ActivityRow icon={<TagIcon />} label="내 제보" count={12} />
          <ActivityRow icon={<ReceiptIcon />} label="내 영수증 후기" count={8} />
          <ActivityRow icon={<HeartIcon />} label="찜한 제보" count={24} />
        </section>

        {/* Settings section */}
        <section className="bg-white shrink-0">
          <MenuRow label="이용약관" />
          <MenuRow label="개인정보처리방침" />
        </section>
      </div>

      <BottomNav activeTab="my" />
    </div>
  );
}
