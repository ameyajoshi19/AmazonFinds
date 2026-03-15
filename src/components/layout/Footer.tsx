import Link from "next/link";
import { Sparkles, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 mt-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-gray-950" />
              </div>
              <span className="font-bold text-white">
                Amazon<span className="text-amber-400">Finds</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Curating the best Amazon products so you don&apos;t have to scroll
              through thousands of listings.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/search", label: "Search" },
                { href: "/about", label: "About & Disclosure" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Top Categories
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/categories/kitchen", label: "Kitchen" },
                { href: "/categories/tech-gadgets", label: "Tech & Gadgets" },
                { href: "/categories/gifts-under-50", label: "Gifts Under $50" },
                { href: "/categories/fitness", label: "Fitness" },
                { href: "/categories/smart-home", label: "Smart Home" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate disclosure */}
        <div className="border-t border-gray-800 pt-6">
          <div className="bg-gray-900/50 rounded-xl p-4 mb-4 flex items-start gap-3">
            <ExternalLink className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-400">Affiliate Disclosure:</strong>{" "}
              AmazonFinds is a participant in the Amazon Services LLC Associates
              Program, an affiliate advertising program designed to provide a
              means for sites to earn advertising fees by advertising and linking
              to Amazon.com. When you click our links and make a purchase, we may
              earn a small commission at no extra cost to you.{" "}
              <Link href="/about" className="text-amber-500 hover:text-amber-400">
                Learn more
              </Link>
            </p>
          </div>
          <p className="text-xs text-gray-600 text-center">
            © {currentYear} AmazonFinds. Amazon and the Amazon logo are
            trademarks of Amazon.com, Inc. or its affiliates.
          </p>
        </div>
      </div>
    </footer>
  );
}
