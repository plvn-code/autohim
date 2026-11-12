import { NextResponse } from "next/server";
import { getById } from "@/lib/catalog";

/** Old ps.me product links (/product/<pos_id>) → the new product page. */
export async function GET(req: Request, { params }: { params: Promise<{ pid: string }> }) {
  const p = getById(Number((await params).pid));
  return NextResponse.redirect(new URL(p ? `/tovar/${p.slug}` : "/katalog", req.url), 308);
}
