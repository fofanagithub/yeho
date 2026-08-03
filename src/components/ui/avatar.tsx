import { BadgeCheck } from "lucide-react";
import { cn, initials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = 40,
  verified,
  className,
}: {
  name?: string | null;
  src?: string | null;
  size?: number;
  verified?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={name || ""}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className="rounded-full bg-brand/10 text-brand font-semibold flex items-center justify-center"
          style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
        >
          {initials(name)}
        </span>
      )}
      {verified ? (
        <BadgeCheck
          className="absolute -bottom-0.5 -right-0.5 text-brand fill-white"
          style={{ width: size * 0.4, height: size * 0.4 }}
        />
      ) : null}
    </span>
  );
}
