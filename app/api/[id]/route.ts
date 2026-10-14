import { getEventsCollection } from "@/app/mongoClient"
import { dishTags } from "@/components/dishTags"
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server"

const dishTypes = new Set(["mains", "sides", "desserts", "drinks", "misc"])
const allowedTags = new Set<string>(dishTags.map(tag => tag.key))

function eventIdFromRequest(req: NextRequest) {
  const value = new URL(req.url).pathname.split("/").pop()
  return value && /^[a-f\d]{24}$/i.test(value) ? new ObjectId(value) : null
}

async function readBody(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await req.json()
    return body && typeof body === "object" && !Array.isArray(body)
      ? body as Record<string, unknown>
      : null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const id = eventIdFromRequest(req)
  if (!id) return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })

  try {
    const document = await getEventsCollection().findOne({ _id: id })
    if (!document) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    return NextResponse.json({ data: document })
  } catch {
    return NextResponse.json({ error: "Could not load event" }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const id = eventIdFromRequest(req)
  if (!id) return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })

  const body = await readBody(req)
  const type = body?.type
  const dish = body?.dish
  const name = body?.name
  const tags: unknown = body?.tags ?? []
  if (
    typeof type !== "string" || !dishTypes.has(type) ||
    typeof dish !== "string" || !dish.trim() || dish.trim().length > 40 ||
    typeof name !== "string" || !name.trim() || name.trim().length > 40 ||
    !Array.isArray(tags) || tags.length > dishTags.length ||
    tags.some(tag => typeof tag !== "string" || !allowedTags.has(tag))
  ) {
    return NextResponse.json({ error: "Invalid dish details" }, { status: 400 })
  }

  const entry = {
    id: new ObjectId().toHexString(),
    dish: dish.trim(),
    name: name.trim(),
    tags: Array.from(new Set<string>(tags)),
  }

  try {
    const result = await getEventsCollection().updateOne({ _id: id }, { $push: { [type]: entry } })
    if (!result.matchedCount) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    return NextResponse.json({ dish: entry }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Could not add your dish" }, { status: 503 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = eventIdFromRequest(req)
  if (!id) return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })

  const body = await readBody(req)
  const type = body?.type
  const dishId = body?.id
  const dish = body?.dish
  const name = body?.name
  if (
    typeof type !== "string" || !dishTypes.has(type) ||
    (typeof dishId === "string" && !/^[a-f\d]{24}$/i.test(dishId)) ||
    (
      typeof dishId !== "string" &&
      (
        typeof dish !== "string" || !dish.trim() || dish.length > 40 ||
        typeof name !== "string" || !name.trim() || name.length > 40
      )
    )
  ) {
    return NextResponse.json({ error: "Invalid dish details" }, { status: 400 })
  }

  const match = typeof dishId === "string"
    ? { id: dishId }
    : { dish, name, id: { $exists: false } }

  try {
    const result = await getEventsCollection().updateOne({ _id: id }, { $pull: { [type]: match } })
    if (!result.matchedCount) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    if (!result.modifiedCount) return NextResponse.json({ error: "Dish not found" }, { status: 404 })
    return NextResponse.json({ deleted: true })
  } catch {
    return NextResponse.json({ error: "Could not remove your dish" }, { status: 503 })
  }
}
