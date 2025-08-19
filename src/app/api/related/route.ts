import { NextResponse } from "next/server";
import { fetchRelatedData } from "@/lib/fetchRelatedData";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { table, type, data, id } = body;
    const result = await fetchRelatedData(table, type, data, id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API related-data error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
