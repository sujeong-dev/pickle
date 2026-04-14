import { Button } from "@/shared/ui";

function ReviewDocIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export function ReviewEmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="bg-primary-50 flex items-center justify-center rounded-full size-[60px]">
          <ReviewDocIcon />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="font-bold text-[21.2px] text-gray-800 leading-[31.7px]">아직 후기가 없어요</p>
          <p className="text-[15.4px] text-gray-400 leading-[23px]">첫 번째로 구매 후기를 공유해보세요!</p>
        </div>
        <Button size="md" className="w-[120px]">등록하기</Button>
      </div>
    </div>
  );
}
