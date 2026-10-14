import { getEventsCollection } from "@/app/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    const parsed: unknown = await req.json()
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body")
    body = parsed as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const title = typeof body.title === "string" ? body.title.trim() : ""
  const datetime = typeof body.datetime === "string" ? body.datetime : ""
  const theme = typeof body.theme === "string" ? body.theme.trim() : ""
  const address = typeof body.address === "string" ? body.address.trim() : ""
  const instructions = typeof body.instructions === "string" ? body.instructions.trim() : ""

  if (
    !title || title.length > 60 ||
    !datetime || !Number.isFinite(Date.parse(datetime)) || Date.parse(datetime) <= Date.now() ||
    theme.length > 60 || address.length > 120 || instructions.length > 500 ||
    (body.theme !== undefined && typeof body.theme !== "string") ||
    (body.address !== undefined && typeof body.address !== "string") ||
    (body.instructions !== undefined && typeof body.instructions !== "string")
  ) {
    return NextResponse.json({ error: "Invalid event details" }, { status: 400 })
  }

  try {
    const collection = getEventsCollection()
    const result = await collection.insertOne({ title, theme, datetime, address, instructions })
    return NextResponse.json({ id: result.insertedId.toHexString() }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Could not create event' }, { status: 503 })
  }
}
