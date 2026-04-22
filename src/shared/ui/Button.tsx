import { cn } from "@/shared/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "black";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: string;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 rounded-[8px] text-sm",
  md: "h-12 rounded-[10px] text-base",
  lg: "h-14 rounded-[10px] text-xl",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white",
  secondary: "bg-primary-50 text-primary-500",
  outline: "border border-gray-300 text-gray-700",
  danger: "bg-secondary-500 text-white",
  ghost: "bg-transparent text-primary-500",
  black: "bg-gray-900 text-white",
};

export function Button({
  variant = "primary",
  size = "lg",
  width = "full",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "flex items-center justify-center font-medium overflow-hidden",
        width ? `w-[${width}]`: "w-full",
        sizeStyles[size],
        disabled ? "bg-gray-200 text-gray-400" : variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
