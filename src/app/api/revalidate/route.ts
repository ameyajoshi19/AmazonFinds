import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { paths } = body as { paths?: string[] };

  if (paths && paths.length > 0) {
    for (const path of paths) {
      revalidatePath(path);
    }
  } else {
    // Revalidate everything
    revalidatePath("/");
    revalidatePath("/categories/[slug]", "page");
    revalidatePath("/products/[id]", "page");
  }

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
