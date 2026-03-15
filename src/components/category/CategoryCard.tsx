"use client";

import Link from "next/link";
import {
  UtensilsCrossed, Bath, Bed, Sofa, LayoutGrid, Sparkles, Archive, Lightbulb,
  Wifi, Flame, Trees, Tent, Armchair, Leaf, Coffee, Wine, Package, ShoppingBag,
  Zap, Gift, Crown, TrendingUp, Dumbbell, Heart, Pill, Moon, Star, Cpu,
  Smartphone, Laptop, Headphones, Tv, Battery, Cable, Briefcase, PenTool,
  BookOpen, GraduationCap, Camera, Palette, Music, Gamepad2, Book, Hammer,
  PawPrint, Baby, Users, UserCheck, User2, User, Activity, Droplets, Plane,
  Recycle, PartyPopper, SquareStack, Sun, type LucideIcon
} from "lucide-react";
import type { Category } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed, Bath, Bed, Sofa, LayoutGrid, Sparkles, Archive, Lightbulb,
  Wifi, Flame, Trees, Tent, Armchair, Leaf, Coffee, Wine, Package, ShoppingBag,
  Zap, Gift, Crown, TrendingUp, Dumbbell, Heart, Pill, Moon, Star, Cpu,
  Smartphone, Laptop, Headphones, Tv, Battery, Cable, Briefcase, PenTool,
  BookOpen, GraduationCap, Camera, Palette, Music, Gamepad2, Book, Hammer,
  PawPrint, Baby, Users, UserCheck, User2, User, Activity, Droplets, Plane,
  Recycle, PartyPopper, SquareStack, Sun,
};

const accentColorMap: Record<string, { icon: string; bg: string; border: string; count: string }> = {
  orange:  { icon: "text-orange-400",  bg: "group-hover:bg-orange-500/10",  border: "group-hover:border-orange-500/30",  count: "text-orange-400" },
  cyan:    { icon: "text-cyan-400",    bg: "group-hover:bg-cyan-500/10",    border: "group-hover:border-cyan-500/30",    count: "text-cyan-400" },
  indigo:  { icon: "text-indigo-400",  bg: "group-hover:bg-indigo-500/10",  border: "group-hover:border-indigo-500/30",  count: "text-indigo-400" },
  purple:  { icon: "text-purple-400",  bg: "group-hover:bg-purple-500/10",  border: "group-hover:border-purple-500/30",  count: "text-purple-400" },
  blue:    { icon: "text-blue-400",    bg: "group-hover:bg-blue-500/10",    border: "group-hover:border-blue-500/30",    count: "text-blue-400" },
  sky:     { icon: "text-sky-400",     bg: "group-hover:bg-sky-500/10",     border: "group-hover:border-sky-500/30",     count: "text-sky-400" },
  stone:   { icon: "text-stone-400",   bg: "group-hover:bg-stone-500/10",   border: "group-hover:border-stone-500/30",   count: "text-stone-400" },
  yellow:  { icon: "text-yellow-400",  bg: "group-hover:bg-yellow-500/10",  border: "group-hover:border-yellow-500/30",  count: "text-yellow-400" },
  violet:  { icon: "text-violet-400",  bg: "group-hover:bg-violet-500/10",  border: "group-hover:border-violet-500/30",  count: "text-violet-400" },
  rose:    { icon: "text-rose-400",    bg: "group-hover:bg-rose-500/10",    border: "group-hover:border-rose-500/30",    count: "text-rose-400" },
  green:   { icon: "text-green-400",   bg: "group-hover:bg-green-500/10",   border: "group-hover:border-green-500/30",   count: "text-green-400" },
  red:     { icon: "text-red-400",     bg: "group-hover:bg-red-500/10",     border: "group-hover:border-red-500/30",     count: "text-red-400" },
  emerald: { icon: "text-emerald-400", bg: "group-hover:bg-emerald-500/10", border: "group-hover:border-emerald-500/30", count: "text-emerald-400" },
  lime:    { icon: "text-lime-400",    bg: "group-hover:bg-lime-500/10",    border: "group-hover:border-lime-500/30",    count: "text-lime-400" },
  teal:    { icon: "text-teal-400",    bg: "group-hover:bg-teal-500/10",    border: "group-hover:border-teal-500/30",    count: "text-teal-400" },
  amber:   { icon: "text-amber-400",   bg: "group-hover:bg-amber-500/10",   border: "group-hover:border-amber-500/30",   count: "text-amber-400" },
  fuchsia: { icon: "text-fuchsia-400", bg: "group-hover:bg-fuchsia-500/10", border: "group-hover:border-fuchsia-500/30", count: "text-fuchsia-400" },
  zinc:    { icon: "text-zinc-400",    bg: "group-hover:bg-zinc-500/10",    border: "group-hover:border-zinc-500/30",    count: "text-zinc-400" },
  pink:    { icon: "text-pink-400",    bg: "group-hover:bg-pink-500/10",    border: "group-hover:border-pink-500/30",    count: "text-pink-400" },
};

interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

export default function CategoryCard({ category, productCount }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Star;
  const colors = accentColorMap[category.accentColor] || accentColorMap.amber;

  return (
    <Link href={`/categories/${category.slug}`}>
      <div
        className={`group relative h-full bg-gray-900 border border-gray-800 rounded-2xl p-5 cursor-pointer
          transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/40
          ${colors.bg} ${colors.border}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-gray-800 group-hover:bg-gray-800/80 rounded-xl transition-colors">
            <IconComponent className={`w-5 h-5 ${colors.icon}`} />
          </div>
          {productCount !== undefined && (
            <span className={`text-xs font-semibold ${colors.count} opacity-70 group-hover:opacity-100 transition-opacity`}>
              {productCount} finds
            </span>
          )}
        </div>
        <h3 className="font-semibold text-white text-sm mb-1.5 leading-tight">
          {category.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
