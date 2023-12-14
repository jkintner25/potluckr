import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const user = process.env.MONGO_DB_USER
const password = process.env.MONGO_DB_PASSWORD

const uri = `mongodb+srv://${user}:${password}@potluckrdb.phptj4s.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  let title = requestUrl.searchParams.get('title');
  let theme = requestUrl.searchParams.get('theme');
  console.log("TITLE: ", title, "THEME: ", theme)

  try {
    await client.connect();
    const db = client.db("PotluckerDB");
    const collection = db.collection("Events");
    const document = { title: title, theme: theme };
    const result = await collection.insertOne(document);
    return NextResponse.json({ id: result.insertedId }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await client.close();
  }
}