import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ExternalLink, Shield, Heart, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Affiliate Disclosure",
  description:
    "Learn about AmazonFinds, our curation process, and our affiliate relationship with Amazon.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gray-950" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">About AmazonFinds</h1>
          <p className="text-gray-500 text-sm">Our mission & full disclosure</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mission */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-semibold text-white">Our Mission</h2>
          </div>
          <p className="text-gray-400 leading-relaxed mb-3">
            Amazon sells over 350 million products. Finding the genuinely good
            ones requires hours of research — reading reviews, comparing specs,
            watching comparison videos. We do that work so you don&apos;t have to.
          </p>
          <p className="text-gray-400 leading-relaxed">
            AmazonFinds curates the top 10 products in 60+ categories, updated
            regularly as new products launch and trends shift. Each product is
            selected based on ratings, review volume, value for money, and
            practical real-world usefulness.
          </p>
        </section>

        {/* How we pick */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">How We Pick Products</h2>
          </div>
          <ul className="space-y-3 text-gray-400 text-sm">
            {[
              "Minimum 4.3-star average rating with at least 500 reviews",
              "Considered Amazon&apos;s Choice or bestseller status as a signal",
              "Value vs. price — a $15 item can beat a $80 item on this list",
              "Practical utility — does it solve a real problem people actually have?",
              "Durability signals — we read the 1-star reviews too",
              "Brand reputation and customer service track record",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </section>

        {/* Affiliate disclosure */}
        <section className="bg-amber-900/20 border border-amber-800/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ExternalLink className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              Affiliate Disclosure
            </h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            <strong className="text-white">
              AmazonFinds participates in the Amazon Services LLC Associates
              Program
            </strong>
            , an affiliate advertising program designed to provide a means for
            sites to earn advertising fees by advertising and linking to
            Amazon.com.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            This means when you click one of our links and make a purchase on
            Amazon, we may receive a small commission — typically 1–10% of the
            sale price, at{" "}
            <strong className="text-white">no additional cost to you</strong>.
            You pay the same price you&apos;d pay if you navigated to Amazon
            directly.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Our editorial decisions are independent of affiliate relationships.
            We never promote products because they earn a higher commission
            percentage. Products are selected purely based on quality and value.
          </p>
        </section>

        {/* Privacy */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Privacy</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            AmazonFinds does not collect personal data beyond standard web
            analytics. We don&apos;t set tracking cookies beyond what Amazon&apos;s
            affiliate links require. When you click through to Amazon, you are
            subject to Amazon&apos;s{" "}
            <a
              href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline"
            >
              privacy policy
            </a>
            .
          </p>
        </section>

        {/* Contact */}
        <p className="text-gray-600 text-sm text-center">
          Questions?{" "}
          <Link href="/" className="text-amber-400 hover:text-amber-300">
            Return to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
