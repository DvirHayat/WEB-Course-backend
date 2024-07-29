
import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb+srv://socialNetwork:socialNetwork@cluster0.fnlkhjz.mongodb.net/socialNetwork");

export async function getUserById(id_num) {
  try {
    await client.connect();
    const database = client.db('socialNetwork');
    const users = database.collection('users');
    console.log(typeof(id));
    return await users.findOne({ id_num: id_num });
  } finally {
    await client.close();
  }
}
