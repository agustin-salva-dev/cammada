import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
}

export function UserAvatar({ src, name }: UserAvatarProps) {
  const avatarSrc = src || "/defaults/default-pfp.webp";
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Avatar>
      <AvatarImage src={avatarSrc} alt={name || "User avatar"} className="object-cover" />
      <AvatarFallback>{initials}</AvatarFallback>
      <AvatarBadge className="bg-green-600 dark:bg-green-800" />
    </Avatar>
  );
}

