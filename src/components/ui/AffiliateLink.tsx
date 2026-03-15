import { buildAffiliateUrl } from "@/lib/affiliate";
import { cn } from "@/lib/utils";

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "button" | "text" | "subtle";
}

export default function AffiliateLink({
  href,
  children,
  className,
  variant = "button",
}: AffiliateLinkProps) {
  const url = buildAffiliateUrl(href);

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 transition-all duration-200 font-medium",
        variant === "button" &&
          "bg-amber-500 hover:bg-amber-400 text-gray-950 px-4 py-2.5 rounded-xl text-sm",
        variant === "text" &&
          "text-amber-400 hover:text-amber-300 text-sm underline underline-offset-2",
        variant === "subtle" &&
          "text-gray-400 hover:text-white text-sm",
        className
      )}
    >
      {children}
    </a>
  );
}
