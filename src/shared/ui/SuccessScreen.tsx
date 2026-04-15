import { Button } from "./Button";

function CheckmarkIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2d8a5a"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

interface SuccessScreenProps {
  title: string;
  description: React.ReactNode;
  buttonLabel: string;
  onButtonClick: () => void;
}

export function SuccessScreen({ title, description, buttonLabel, onButtonClick }: SuccessScreenProps) {
  return (
    <div className="bg-white flex flex-col h-dvh items-center justify-center px-[31px]">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="bg-primary-50 rounded-full size-[60px] flex items-center justify-center">
          <CheckmarkIcon />
        </div>
        <div className="flex flex-col items-center gap-2 text-center w-full">
          <p className="font-bold text-[24px] text-gray-900">{title}</p>
          <p className="text-[14px] text-gray-600 leading-[1.3]">{description}</p>
        </div>
        <Button onClick={onButtonClick}>{buttonLabel}</Button>
      </div>
    </div>
  );
}
