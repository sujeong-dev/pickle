"use client";

import { BottomSheet, Button } from "@/shared/ui";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "primary" | "danger";
  onClose: () => void;
  onConfirm: () => void;
};

export function GroupConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  variant = "primary",
  onClose,
  onConfirm,
}: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-col px-5 pt-4 pb-8 gap-5">
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-bold text-h2 text-gray-900">{title}</h2>
          <p className="text-body2 text-gray-500 text-center leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
