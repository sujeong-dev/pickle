interface ScanIconProps {
  size?: number;
  className?: string;
}

export function ScanIcon({ size = 16, className }: ScanIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 16 16'
      fill='none'
      className={className}
    >
      <path
        d='M2 4.66667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H4.66667'
        stroke='#757575'
        stroke-width='1.4425'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M11.3333 2H12.6666C13.0202 2 13.3593 2.14048 13.6094 2.39052C13.8594 2.64057 13.9999 2.97971 13.9999 3.33333V4.66667'
        stroke='#757575'
        stroke-width='1.4425'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M13.9999 11.333V12.6663C13.9999 13.02 13.8594 13.3591 13.6094 13.6092C13.3593 13.8592 13.0202 13.9997 12.6666 13.9997H11.3333'
        stroke='#757575'
        stroke-width='1.4425'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M4.66667 13.9997H3.33333C2.97971 13.9997 2.64057 13.8592 2.39052 13.6092C2.14048 13.3591 2 13.02 2 12.6663V11.333'
        stroke='#757575'
        stroke-width='1.4425'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M4.66675 8H11.3334'
        stroke='#757575'
        stroke-width='1.4425'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
}
