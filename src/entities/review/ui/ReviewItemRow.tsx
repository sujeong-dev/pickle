import { StarIcon } from "@/shared/ui";

type ReviewItemProps = {
  name: string;
  price: string;
  rating: number;
  comment: string;
};

export function ReviewItemRow({ name, price, rating, comment }: ReviewItemProps) {
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
            <StarIcon key={i} size={12} />
          ))}
        </div>
        <span className="text-gray-700 text-[12px] leading-none">{comment}</span>
      </div>
    </div>
  );
}
