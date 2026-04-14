import type { ReviewItem } from "../model/types";

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ReviewItemRow({ name, price, rating, comment }: ReviewItem) {
  return (
    <div className="flex gap-3 items-center border-b border-gray-100 px-5 py-3">
      <div className="bg-[#e8e8e8] rounded-[6px] shrink-0 size-[60px]" />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[16px] text-gray-900 truncate">{name}</span>
          <span className="font-bold text-[16px] text-black shrink-0 ml-2">{price}</span>
        </div>
        <div className="flex gap-0.5 items-center">
          {Array.from({ length: rating }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
        <span className="text-gray-700 text-[12px] leading-none">{comment}</span>
      </div>
    </div>
  );
}
