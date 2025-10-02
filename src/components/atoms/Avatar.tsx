import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback: string;
}

export function Avatar({ src, alt, fallback }: AvatarProps) {
  return (
    <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      ) : (
        <span className="text-xs font-medium text-white/60">{fallback}</span>
      )}
    </div>
  );
}
