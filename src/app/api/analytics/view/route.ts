import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityType, entityId } = body as {
      entityType?: string;
      entityId?: string;
    };

    if (!entityType || !entityId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (entityType !== "product" && entityType !== "category") {
      return NextResponse.json({ error: "Invalid entityType" }, { status: 400 });
    }

    await db.insert(pageViews).values({
      entityType,
      entityId,
      userAgent: request.headers.get("user-agent") ?? undefined,
      referrer: request.headers.get("referer") ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Never let analytics errors surface to the user
    return NextResponse.json({ ok: true });
  }
}
