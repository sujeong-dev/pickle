interface StarIconProps {
  size?: number;
  filled?: boolean;
  color?: string;
  className?: string;
}

export function StarIcon({ size = 16, filled = true, color = "#F59E0B", className }: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={filled ? color : "#E0E0E0"}
      strokeWidth="1.5"
      aria-hidden="true"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
