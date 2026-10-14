import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient | undefined

export function getEventsCollection() {
  if (!client) {
    const user = process.env.MONGO_DB_USER
    const password = process.env.MONGO_DB_PASSWORD
    const uri = process.env.MONGODB_URI || (
      user && password
        ? `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@potluckrdb.phptj4s.mongodb.net/?retryWrites=true&w=majority`
        : null
    )

    if (!uri) throw new Error('MongoDB connection is not configured')

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  }

  return client.db('PotluckrDB').collection('Events')
}
