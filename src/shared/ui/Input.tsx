"use client";

import { cn } from "@/shared/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "success" | "error" | "secondary";
  onClear?: () => void;
}

const variantStyles: Record<NonNullable<InputProps["variant"]>, string> = {
  default: "bg-white border border-gray-300",
  success: "bg-white border border-primary-500",
  error: "bg-white border border-secondary-500",
  secondary: "bg-gray-200",
};

export function Input({
  variant = "default",
  onClear,
  className,
  value,
  ...props
}: InputProps) {
  const hasValue = value !== undefined && value !== "";

  return (
    <div
      className={cn(
        "flex items-center h-11 rounded-[10px] px-3 gap-2 overflow-hidden",
        variantStyles[variant],
        className,
      )}
    >
      <input
        value={value}
        className="flex-1 min-w-0 bg-transparent text-body2 text-gray-900 placeholder:text-gray-400 outline-none"
        {...props}
      />
      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="flex-shrink-0 flex items-center justify-center size-6 rounded-full bg-gray-200"
          aria-label="입력 지우기"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="#757575"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
