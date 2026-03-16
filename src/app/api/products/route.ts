import { NextResponse } from "next/server";
import { getAllSearchableProducts } from "@/data/loader";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getAllSearchableProducts();
  return NextResponse.json(products);
}
