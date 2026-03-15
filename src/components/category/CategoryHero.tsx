import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/types";

interface CategoryHeroProps {
  category: Category;
  productCount: number;
}

const accentGradients: Record<string, string> = {
  orange:  "from-orange-500/20 to-transparent",
  cyan:    "from-cyan-500/20 to-transparent",
  indigo:  "from-indigo-500/20 to-transparent",
  purple:  "from-purple-500/20 to-transparent",
  blue:    "from-blue-500/20 to-transparent",
  sky:     "from-sky-500/20 to-transparent",
  stone:   "from-stone-500/20 to-transparent",
  yellow:  "from-yellow-500/20 to-transparent",
  violet:  "from-violet-500/20 to-transparent",
  rose:    "from-rose-500/20 to-transparent",
  green:   "from-green-500/20 to-transparent",
  red:     "from-red-500/20 to-transparent",
  emerald: "from-emerald-500/20 to-transparent",
  lime:    "from-lime-500/20 to-transparent",
  teal:    "from-teal-500/20 to-transparent",
  amber:   "from-amber-500/20 to-transparent",
  fuchsia: "from-fuchsia-500/20 to-transparent",
  zinc:    "from-zinc-500/20 to-transparent",
  pink:    "from-pink-500/20 to-transparent",
};

const accentText: Record<string, string> = {
  orange: "text-orange-400", cyan: "text-cyan-400", indigo: "text-indigo-400",
  purple: "text-purple-400", blue: "text-blue-400", sky: "text-sky-400",
  stone: "text-stone-400", yellow: "text-yellow-400", violet: "text-violet-400",
  rose: "text-rose-400", green: "text-green-400", red: "text-red-400",
  emerald: "text-emerald-400", lime: "text-lime-400", teal: "text-teal-400",
  amber: "text-amber-400", fuchsia: "text-fuchsia-400", zinc: "text-zinc-400",
  pink: "text-pink-400",
};

export default function CategoryHero({ category, productCount }: CategoryHeroProps) {
  const gradient = accentGradients[category.accentColor] || accentGradients.amber;
  const textColor = accentText[category.accentColor] || "text-amber-400";

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 mb-8`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} pointer-events-none`} />
      <div className="relative px-6 py-8 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          All Categories
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {category.name}
            </h1>
            <p className="text-gray-400 max-w-xl">{category.description}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className={`text-4xl font-bold ${textColor}`}>
              {productCount}
            </span>
            <p className="text-sm text-gray-500">top finds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
