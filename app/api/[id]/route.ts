import { client } from "@/app/mongoClient";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const id = new ObjectId(requestUrl.pathname.slice(5))

  try {
    await client.connect();
    const db = client.db("PotluckrDB");
    const collection = db.collection("Events");
    const document = await collection.findOne({ _id: id });
    return NextResponse.json({ data: document }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Sorry, we can't find that event!" }, { status: 500 })
  } finally {
    await client.close();
  }
}

export async function POST(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const id = new ObjectId(requestUrl.pathname.slice(5))

  const { type, dish, name } = await req.json()

  try {
    await client.connect();
    const db = client.db("PotluckrDB");
    const collection = db.collection("Events");
    const document = await collection.updateOne({ _id: id }, { $push: { [type]: { dish: dish, name: name } } });
    return NextResponse.json({ data: document }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Could not add your dish!" }, { status: 500 })
  } finally {
    await client.close();
  }
}

export async function DELETE(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const id = new ObjectId(requestUrl.pathname.slice(5))

  const { type, dish, name } = await req.json()

  try {
    await client.connect();
    const db = client.db("PotluckrDB");
    const collection = db.collection("Events");
    const document = await collection.updateOne({ _id: id }, { $pull: { [type]: { dish: dish, name: name } } });
    return NextResponse.json({ data: document }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Could not remove your dish!" }, { status: 500 })
  } finally {
    await client.close();
  }
}