import { MongoClient, ServerApiVersion } from 'mongodb';

const user = process.env.MONGO_DB_USER
const password = process.env.MONGO_DB_PASSWORD

const uri = `mongodb+srv://${user}:${password}@potluckrdb.phptj4s.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});