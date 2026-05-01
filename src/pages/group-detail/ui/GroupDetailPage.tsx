"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BackHeader, Button, TrashIcon, UserAvatar } from "@/shared/ui";
import { useToastStore } from "@/shared/model";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/formatRelativeTime";
import { formatMeetTime } from "@/shared/lib/formatMeetTime";
import {
  StatusBadge,
  GROUP_STORE_LABEL,
} from "@/entities/group";
import { useToggleParticipation } from "@/features/group-participate";
import { useCloseGroup } from "@/features/group-close";
import { useDeleteGroup } from "@/features/group-delete";
import {
  getGroupDetail,
  groupKeys,
  getGroupErrorMessage,
  getGroupComments,
  createGroupComment,
  deleteGroupComment,
} from "@/shared/api";
import type { GroupComment } from "@/shared/api/group";
import { ROUTES } from "@/shared/config/routes";
import { GroupActionSheet } from "./GroupActionSheet";
import { GroupConfirmModal } from "./GroupConfirmModal";

const groupCommentKeys = {
  list: (id: string) => ["group", "comments", id] as const,
};

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="12" cy="19" r="1.2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M5 9v11h14V9" />
      <path d="M9 9v3h6V9" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

type Props = { groupId: string };

export function GroupDetailPage({ groupId }: Props) {
  const router = useRouter();
  const [actionOpen, setActionOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: group, isLoading, isError } = useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => getGroupDetail(groupId),
  });

  const { mutate: toggleParticipation, isPending: isToggling } = useToggleParticipation();
  const { mutate: closeGroup, isPending: isClosing } = useCloseGroup(groupId);
  const { mutate: deleteGroupAction, isPending: isDeleting } = useDeleteGroup(groupId);

  const [commentInput, setCommentInput] = useState("");
  const queryClient = useQueryClient();

  const { data: commentData } = useQuery({
    queryKey: groupCommentKeys.list(groupId),
    queryFn: () => getGroupComments(groupId),
    enabled: !!groupId,
  });

  const { mutate: submitComment, isPending: isSubmittingComment } = useMutation({
    mutationFn: (content: string) => createGroupComment(groupId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupCommentKeys.list(groupId) });
      setCommentInput("");
    },
  });

  const { mutate: removeComment, isPending: isDeletingComment } = useMutation({
    mutationFn: (commentId: string) => deleteGroupComment(groupId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupCommentKeys.list(groupId) });
    },
  });

  const comments = commentData?.items ?? [];

  const handleSubmitComment = () => {
    const trimmed = commentInput.trim();
    if (!trimmed || isSubmittingComment) return;
    submitComment(trimmed);
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col h-dvh">
        <BackHeader />
        <div className="flex flex-col gap-4 p-5 animate-pulse">
          <div className="h-6 w-1/2 bg-gray-100 rounded" />
          <div className="h-8 w-3/4 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !group) {
    return (
      <div className="bg-white flex flex-col h-dvh">
        <BackHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-body2 text-gray-500">모집글을 불러올 수 없어요.</p>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((group.currentCount / group.targetCount) * 100));
  const storeLabel = [group.store ? GROUP_STORE_LABEL[group.store] : null, group.branch].filter(Boolean).join(" ");
  const isMine = group.isMine;
  const isOpen = group.status === "open";
  const isFull = group.currentCount >= group.targetCount;

  function handleToggle() {
    if (!group) return;
    toggleParticipation(
      { groupId, participate: !group.isParticipating },
      {
        onError: async (err) => {
          const msg = await getGroupErrorMessage(err);
          useToastStore.getState().show(msg);
        },
        onSuccess: () => {
          useToastStore.getState().show(
            !group.isParticipating ? "참여했어요." : "참여를 취소했어요.",
          );
        },
      },
    );
  }

  function handleClose() {
    closeGroup(undefined, {
      onSuccess: () => {
        useToastStore.getState().show("모집을 마감했어요.");
        setCloseConfirmOpen(false);
      },
      onError: async (err) => {
        const msg = await getGroupErrorMessage(err);
        useToastStore.getState().show(msg);
        setCloseConfirmOpen(false);
      },
    });
  }

  function handleDelete() {
    deleteGroupAction(undefined, {
      onSuccess: () => {
        useToastStore.getState().show("모집글이 삭제됐어요.");
        router.replace(ROUTES.group);
      },
      onError: async (err) => {
        const msg = await getGroupErrorMessage(err);
        useToastStore.getState().show(msg);
        setDeleteConfirmOpen(false);
      },
    });
  }

  return (
    <div className="bg-white flex flex-col h-dvh">
      <header className="flex items-center justify-between h-[50px] px-5 shrink-0">
        <button type="button" aria-label="뒤로가기" onClick={() => router.back()}>
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {isMine && (
          <button type="button" aria-label="더보기" onClick={() => setActionOpen(true)}>
            <MoreIcon />
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto min-h-0">
        {/* 뱃지 + 제목 */}
        <div className="px-5 pt-2 pb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <StatusBadge status={group.status} />
            {!isMine && group.isParticipating && (
              <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold text-caption bg-primary-100 text-primary-700">
                참여중
              </span>
            )}
          </div>
          <h1 className="font-bold text-h1 text-gray-900 leading-tight">{group.productName}</h1>
        </div>

        {/* 호스트 */}
        <div className="px-5 pb-4 flex items-center gap-2.5">
          <UserAvatar size={40} />
          <div className="flex flex-col">
            <span className="font-semibold text-body2 text-gray-900">{group.hostNickname}</span>
            <span className="text-caption text-gray-500">{formatRelativeTime(group.createdAt)}</span>
          </div>
        </div>

        {/* 메타 카드 */}
        <div className="mx-5 p-4 rounded-[12px] bg-gray-50 flex flex-col gap-3 mb-4">
          {storeLabel && (
            <Meta icon={<StoreIcon />} label="매장" value={storeLabel} />
          )}
          <Meta icon={<PinIcon />} label="장소" value={group.location} />
          <Meta icon={<ClockIcon />} label="시간" value={formatMeetTime(group.meetAt)} />
          {group.pricePerPerson != null && (
            <Meta icon={<PriceIcon />} label="1인당" value={`${group.pricePerPerson.toLocaleString()}원`} />
          )}

          {/* 진행도 */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-body2 text-gray-600">참여 인원</span>
              <span className="font-bold text-body2 text-gray-900">
                {group.currentCount} / {group.targetCount}명
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isOpen ? "bg-primary-500" : "bg-gray-400",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 설명 */}
        {group.description && (
          <div className="px-5 pb-4">
            <p className="text-body1 text-gray-800 leading-relaxed whitespace-pre-line">
              {group.description}
            </p>
          </div>
        )}

        {/* 참여자 명단 (호스트 only) */}
        {isMine && group.participants && group.participants.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100">
            <h3 className="font-bold text-subtitle text-gray-900 mb-3">
              참여자 {group.participants.length}명
            </h3>
            <div className="flex flex-col gap-3">
              {group.participants.map((p) => (
                <div key={p.userId} className="flex items-center gap-2.5">
                  <UserAvatar size={36} />
                  <div className="flex-1 flex flex-col">
                    <span className="font-semibold text-body2 text-gray-900">{p.nickname}</span>
                    <span className="text-caption text-gray-500">
                      {formatRelativeTime(p.joinedAt)} 참여
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 댓글 영역 */}
        <div className="px-5 pt-4 pb-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[15px] text-gray-900">댓글</span>
            <span className="text-[14px] text-gray-400">{comments.length}</span>
          </div>
        </div>

        <div className="px-5 pb-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <span className="text-[14px] text-gray-400">첫 번째 댓글을 남겨보세요</span>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={removeComment}
                isDeleting={isDeletingComment}
              />
            ))
          )}
        </div>

        {/* 댓글 입력 바 (인라인) */}
        <div className="px-4 pt-2 pb-4 flex gap-2 items-center">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 h-10">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              placeholder="댓글을 입력하세요"
              className="flex-1 bg-transparent text-[14px] text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmitComment}
            disabled={!commentInput.trim() || isSubmittingComment}
            className="size-10 rounded-full bg-primary-500 flex items-center justify-center text-white disabled:bg-gray-200 disabled:text-gray-400 shrink-0"
          >
            <SendIcon />
          </button>
        </div>
      </main>

      {/* 하단 액션 바 */}
      <div className="shrink-0 px-5 py-3 border-t border-gray-100 bg-white">
        {isMine ? (
          <Button variant="outline" disabled>
            내 모집글이에요
          </Button>
        ) : !isOpen ? (
          <Button variant="outline" disabled>
            마감된 모집이에요
          </Button>
        ) : group.isParticipating ? (
          <Button variant="outline" onClick={handleToggle} disabled={isToggling}>
            {isToggling ? "처리 중…" : "참여 취소"}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleToggle} disabled={isToggling || isFull}>
            {isFull ? "모집 마감 (정원 충족)" : isToggling ? "처리 중…" : "참여하기"}
          </Button>
        )}
      </div>

      <GroupActionSheet
        open={actionOpen}
        canEdit={isOpen}
        onClose={() => setActionOpen(false)}
        onEdit={() => {
          setActionOpen(false);
          router.push(ROUTES.groupEdit(groupId));
        }}
        onClose_={() => {
          setActionOpen(false);
          setCloseConfirmOpen(true);
        }}
        onDelete={() => {
          setActionOpen(false);
          setDeleteConfirmOpen(true);
        }}
      />

      <GroupConfirmModal
        open={closeConfirmOpen}
        title="모집을 마감할까요?"
        description={"마감 후에는 더 이상 참여 신청을 받을 수 없어요."}
        confirmLabel={isClosing ? "처리 중…" : "마감하기"}
        onClose={() => setCloseConfirmOpen(false)}
        onConfirm={handleClose}
      />

      <GroupConfirmModal
        open={deleteConfirmOpen}
        title="모집글을 삭제할까요?"
        description={"삭제하면 되돌릴 수 없어요."}
        confirmLabel={isDeleting ? "삭제 중…" : "삭제하기"}
        variant="danger"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <span className="text-gray-400">{icon}</span>
      <span className="text-body2 text-gray-500 w-12">{label}</span>
      <span className="flex-1 text-body2 text-gray-900">{value}</span>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

type CommentItemProps = {
  comment: GroupComment;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

function CommentItem({ comment, onDelete, isDeleting }: CommentItemProps) {
  return (
    <div className="flex gap-2.5 py-3 border-b border-gray-100">
      <UserAvatar src={comment.authorProfileImage} size={32} />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-[13px] text-gray-900 truncate">{comment.authorNickname}</span>
            <span className="text-[11px] text-gray-400 shrink-0">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          {comment.isMine && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              className="text-gray-400 shrink-0 disabled:opacity-40"
              aria-label="댓글 삭제"
            >
              <TrashIcon />
            </button>
          )}
        </div>
        <p className="text-[14px] text-gray-700 leading-[21px]">{comment.content}</p>
      </div>
    </div>
  );
}
