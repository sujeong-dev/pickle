import { cn } from "@/shared/lib/utils";
import { GROUP_CATEGORY_LABEL, type GroupCategory } from "../model/types";

const STYLE: Record<GroupCategory, string> = {
  share: "bg-primary-50 text-primary-700",
  split: "bg-amber-50 text-amber-700",
  group_buy: "bg-secondary-50 text-secondary-700",
};

type Props = {
  category: GroupCategory;
  className?: string;
};

export function CategoryBadge({ category, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded font-semibold text-caption",
        STYLE[category],
        className,
      )}
    >
      {GROUP_CATEGORY_LABEL[category]}
    </span>
  );
}
