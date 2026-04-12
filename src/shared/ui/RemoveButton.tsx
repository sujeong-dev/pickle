type RemoveButtonProps = {
  onClick: () => void;
  "aria-label"?: string;
};

function XIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function RemoveButton({ onClick, "aria-label": label = "삭제" }: RemoveButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="size-[35px] rounded-full bg-black/50 flex items-center justify-center"
    >
      <XIcon />
    </button>
  );
}
