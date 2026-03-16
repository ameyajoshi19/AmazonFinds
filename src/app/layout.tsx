import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllCategories } from "@/data/loader";
import JsonLd, { organizationSchema } from "@/components/seo/JsonLd";

const SITE_NAME = "AmazonFinds";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: {
    default: `${SITE_NAME} — The Best Amazon Products, Curated`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Discover the best Amazon products in 60+ categories. Expert-curated finds for kitchen, tech, fitness, gifts, and more — updated regularly.",
  keywords: ["amazon finds", "best amazon products", "amazon recommendations", "top amazon picks"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — The Best Amazon Products, Curated`,
    description: "Top 10 Amazon picks in 60+ categories. Kitchen, tech, gifts, fitness & more.",
  },
  robots: { index: true, follow: true },
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
        <JsonLd data={organizationSchema(SITE_NAME)} />
        <Header categories={categories} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
