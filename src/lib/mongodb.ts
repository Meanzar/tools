/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("Missing NEXT_PUBLIC_MONGODB_URI environment variable")
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default clientPromise
