import { cn } from "@/shared/lib/utils";

type ToastProps = {
  message: string;
  icon?: React.ReactNode;
  visible: boolean;
  className?: string;
};

export function Toast({ message, icon, visible, className }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-24 left-4 right-4 z-[9999] flex gap-3 items-center px-5 py-3 rounded-[8px] transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        className,
      )}
    >
      {icon}
      <span className="font-medium text-subtitle">{message}</span>
    </div>
  );
}
