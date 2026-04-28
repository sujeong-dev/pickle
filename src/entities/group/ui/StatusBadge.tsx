import { cn } from "@/shared/lib/utils";
import { GROUP_STATUS_LABEL, type GroupStatus } from "../model/types";

const STYLE: Record<GroupStatus, string> = {
  open: "bg-(--color-badge-recruiting-bg) text-(--color-badge-recruiting-text)",
  done: "bg-(--color-badge-done-bg) text-(--color-badge-done-text)",
};

type Props = {
  status: GroupStatus;
  className?: string;
};

export function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded font-semibold text-caption",
        STYLE[status],
        className,
      )}
    >
      {GROUP_STATUS_LABEL[status]}
    </span>
  );
}
