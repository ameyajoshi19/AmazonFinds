import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/schema";
import type { EntityType } from "@/lib/schema";

export const dynamic = "force-dynamic";

const VALID_ENTITY_TYPES: EntityType[] = ["product", "category"];

export async function POST(request: NextRequest) {
  try {
    const { entityType, entityId } = await request.json() as {
      entityType?: string;
      entityId?: string;
    };

    if (!entityId || !VALID_ENTITY_TYPES.includes(entityType as EntityType)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await db.insert(pageViews).values({
      entityType: entityType as EntityType,
      entityId,
      userAgent: request.headers.get("user-agent") ?? undefined,
      referrer: request.headers.get("referer") ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Never let analytics errors surface to users
    return NextResponse.json({ ok: true });
  }
}
