"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catDropdown, setCatDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCatDropdown(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  const firstHalf = categories.slice(0, Math.ceil(categories.length / 2));
  const secondHalf = categories.slice(Math.ceil(categories.length / 2));

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                <Sparkles className="w-4 h-4 text-gray-950" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Amazon<span className="text-amber-400">Finds</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <div
                className="relative"
                onMouseEnter={() => setCatDropdown(true)}
                onMouseLeave={() => setCatDropdown(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
                  Categories
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      catDropdown && "rotate-180"
                    )}
                  />
                </button>
                {catDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[640px] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 p-4 grid grid-cols-2 gap-1">
                    <div className="space-y-1">
                      {firstHalf.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/categories/${cat.slug}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {secondHalf.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/categories/${cat.slug}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search finds..."
                    className="w-48 sm:w-64 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-gray-900 border-l border-gray-800 pt-16 overflow-y-auto">
            <div className="p-4">
              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search finds..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-gray-950 px-3 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </p>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/about"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mt-4 border-t border-gray-800 pt-4"
                >
                  About
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
