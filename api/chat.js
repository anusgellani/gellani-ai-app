// api/chat.js
import { MongoClient } from 'mongodb';
import axios from 'axios';

const uri = process.env.MONGO_URI;
const apiKey = process.env.TOGETHER_API_KEY;

let cachedClient = null;
let cachedDb = null;

async function connectToDB() {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(); // default from connection string
  return cachedDb;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { question } = req.body;

  try {
    const tgRes = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [{ role: 'user', content: question }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = tgRes.data.choices[0].message.content;

    const db = await connectToDB();
    const collection = db.collection('chats');
    await collection.insertOne({ question, answer, timestamp: new Date() });

    res.status(200).json({ answer });
  } catch (err) {
    console.error('Chat Error:', err.message);
    res.status(500).json({ error: 'Failed to process chat' });
  }
}
