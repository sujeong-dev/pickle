"use client";

import { BottomSheet } from "@/shared/ui";

type Props = {
  open: boolean;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
  onClose_: () => void;
  onDelete: () => void;
};

export function GroupActionSheet({ open, canEdit, onClose, onEdit, onClose_, onDelete }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-col py-2 pb-6">
        <button
          type="button"
          onClick={onEdit}
          disabled={!canEdit}
          className="h-14 px-5 flex items-center text-body1 text-gray-900 disabled:text-gray-400"
        >
          모집글 수정
        </button>
        <button
          type="button"
          onClick={onClose_}
          disabled={!canEdit}
          className="h-14 px-5 flex items-center text-body1 text-gray-900 disabled:text-gray-400"
        >
          모집 마감
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="h-14 px-5 flex items-center text-body1 text-secondary-500"
        >
          모집 삭제
        </button>
      </div>
    </BottomSheet>
  );
}
