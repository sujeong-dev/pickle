type RemoveButtonProps = {
  onClick: () => void;
  "aria-label"?: string;
  size?: "sm" | "md";
};

function XIcon({ size = "md" }: { size?: "sm" | "md" }) {
  const px = size === "sm" ? 13 : 19;
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function RemoveButton({ onClick, "aria-label": label = "삭제", size = "md" }: RemoveButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={size === "sm"
        ? "size-6 rounded-full bg-black/40 flex items-center justify-center shrink-0"
        : "size-[35px] rounded-full bg-black/50 flex items-center justify-center"
      }
    >
      <XIcon size={size} />
    </button>
  );
}
