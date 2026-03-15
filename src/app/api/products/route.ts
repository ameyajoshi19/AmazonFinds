import { NextResponse } from "next/server";
import { getAllSearchableProducts } from "@/data/loader";

export const dynamic = "force-dynamic";

export function GET() {
  const products = getAllSearchableProducts();
  return NextResponse.json(products);
}
