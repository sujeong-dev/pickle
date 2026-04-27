import Image from "next/image";
import { UserAvatarIcon } from "./icons/UserAvatarIcon";

type UserAvatarProps = {
  src?: string | null;
  size?: number;
  className?: string;
};

export function UserAvatar({ src, size = 46, className }: UserAvatarProps) {
  const iconSize = Math.round(size * 0.5);
  return (
    <div
      className={`bg-primary-50 flex items-center justify-center rounded-full shrink-0 relative overflow-hidden ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt="프로필" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <UserAvatarIcon size={iconSize} />
      )}
    </div>
  );
}
