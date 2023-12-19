import { client } from "@/app/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log('HIT api/newEvent')
  const body = await req.json()
  const { title, theme, datetime } = body;
  console.log(title, theme, datetime);

  try {
    await client.connect();
    const db = await client.db("PotluckrDB");
    const collection = await db.collection("Events");
    console.log(db, collection)
    const document = { title: title, theme: theme, datetime: datetime };
    const result = await collection.insertOne(document);
    console.log(result)
    return NextResponse.json({ id: result.insertedId }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await client.close();
  }
}
