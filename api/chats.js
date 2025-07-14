// api/chats.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

let cachedClient = null;
let cachedDb = null;

async function connectToDB() {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db();
  return cachedDb;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET allowed' });
  }

  try {
    const db = await connectToDB();
    const chats = await db.collection('chats').find().sort({ timestamp: -1 }).toArray();
    res.status(200).json(chats);
  } catch (err) {
    console.error('Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
}
