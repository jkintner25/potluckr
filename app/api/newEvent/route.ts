import { client } from "@/app/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  let title = requestUrl.searchParams.get('title');
  let theme = requestUrl.searchParams.get('theme');
  let datetime = requestUrl.searchParams.get('date');

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