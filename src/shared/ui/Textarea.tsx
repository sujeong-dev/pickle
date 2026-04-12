"use client";

import { cn } from "@/shared/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

export function Textarea({ maxLength, className, value, onChange, ...props }: TextareaProps) {
  const length = typeof value === "string" ? value.length : 0;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={cn(
          "w-full bg-white border border-gray-300 rounded-[10px] px-3 pt-3 pb-7 text-body2 text-gray-900 placeholder:text-gray-400 outline-none resize-none",
          className,
        )}
        {...props}
      />
      {maxLength !== undefined && (
        <span className="absolute bottom-3 right-3 text-caption text-gray-400 pointer-events-none">
          {length}/{maxLength}
        </span>
      )}
    </div>
  );
}
