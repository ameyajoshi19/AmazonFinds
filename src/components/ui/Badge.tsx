import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "prime" | "sale" | "featured" | "new" | "trending";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variant === "default" && "bg-gray-800 text-gray-300",
        variant === "prime" && "bg-blue-900/60 text-blue-300 border border-blue-800/50",
        variant === "sale" && "bg-red-900/60 text-red-300 border border-red-800/50",
        variant === "featured" && "bg-amber-900/60 text-amber-300 border border-amber-800/50",
        variant === "new" && "bg-emerald-900/60 text-emerald-300 border border-emerald-800/50",
        variant === "trending" && "bg-orange-900/60 text-orange-300 border border-orange-800/50",
        className
      )}
    >
      {children}
    </span>
  );
}
