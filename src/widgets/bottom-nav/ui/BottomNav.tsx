"use client";

import Link from "next/link";
import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/lib/utils";

type ActiveTab = "home" | "split" | "add" | "review" | "my";

type BottomNavProps = {
  activeTab?: ActiveTab;
};

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? "#2D8A5A" : "#BDBDBD"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ReviewIcon({ active }: { active: boolean }) {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? "#2D8A5A" : "#BDBDBD"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-[2px] h-full"
    >
      {icon}
      <span
        className={cn(
          "text-[11.5px] leading-[17px]",
          active ? "font-semibold text-primary-500" : "font-normal text-gray-400",
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function BottomNav({ activeTab = "home" }: BottomNavProps) {
  return (
    <nav className="bg-white grid grid-cols-5 h-[85px] pb-[34px] shrink-0 border-t border-gray-100">
      <NavItem
        href={ROUTES.home}
        label="홈"
        icon={<HomeIcon active={activeTab === "home"} />}
        active={activeTab === "home"}
      />
      <NavItem
        href="#"
        label="소분"
        icon={<GroupIcon />}
        active={activeTab === "split"}
      />
      <div className="flex items-center justify-center pt-[3px]">
        <Link
          href={ROUTES.report}
          aria-label="제보하기"
          className="size-[42px] rounded-full bg-primary-500 flex items-center justify-center shadow-[var(--shadow-fab)]"
        >
          <PlusIcon />
        </Link>
      </div>
      <NavItem
        href={ROUTES.review}
        label="후기"
        icon={<ReviewIcon active={activeTab === "review"} />}
        active={activeTab === "review"}
      />
      <NavItem
        href="#"
        label="마이"
        icon={<ProfileIcon />}
        active={activeTab === "my"}
      />
    </nav>
  );
}
