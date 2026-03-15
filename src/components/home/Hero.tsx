import Link from "next/link";
import { Search, Sparkles, TrendingUp, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-sm text-amber-400 font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Curated Amazon Finds
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
          The best Amazon{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            finds
          </span>
          , curated.
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop scrolling through thousands of listings. We&apos;ve found the top
          10 products in 60+ categories — all linking directly to Amazon.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/search"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            Search All Finds
          </Link>
          <Link
            href="#categories"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm border border-gray-700"
          >
            <TrendingUp className="w-4 h-4" />
            Browse Categories
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm">
          {[
            { icon: Star, label: "600+ top-rated products" },
            { icon: TrendingUp, label: "60+ categories" },
            { icon: Sparkles, label: "Updated daily" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-gray-500">
              <Icon className="w-4 h-4 text-amber-500" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
