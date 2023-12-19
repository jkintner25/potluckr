import { client } from "@/app/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, theme, datetime } = body;

  try {
    await client.connect();
    const db = client.db("PotluckrDB");
    const collection = db.collection("Events");
    const document = { title: title, theme: theme, datetime: datetime };
    const result = await collection.insertOne(document);
    return NextResponse.json({ id: result.insertedId }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await client.close();
  }
}
