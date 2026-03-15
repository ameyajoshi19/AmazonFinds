import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllCategories } from "@/data/loader";

export const metadata: Metadata = {
  title: {
    default: "AmazonFinds — The Best Amazon Products, Curated",
    template: "%s | AmazonFinds",
  },
  description:
    "Discover the top 10 Amazon products in 60+ categories. Expert-curated finds for kitchen, tech, fitness, gifts, and more — all linking directly to Amazon.",
  keywords: ["amazon finds", "best amazon products", "amazon deals", "amazon recommendations"],
  openGraph: {
    type: "website",
    siteName: "AmazonFinds",
    title: "AmazonFinds — The Best Amazon Products, Curated",
    description:
      "Top 10 Amazon picks in 60+ categories. Kitchen, tech, gifts, fitness & more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();

  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-50 min-h-screen antialiased">
        <Header categories={categories} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
