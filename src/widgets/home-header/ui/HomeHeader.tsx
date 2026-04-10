import Image from "next/image";

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function HomeHeader() {
  return (
    <header className="bg-white border-b border-gray-200 h-[50px] flex items-center justify-between px-5 shrink-0">
      <Image
        src="/images/pickle-ci.png"
        alt="pickle"
        width={77}
        height={35}
        priority
      />
      <button type="button" aria-label="알림">
        <BellIcon />
      </button>
    </header>
  );
}
