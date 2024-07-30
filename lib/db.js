
import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb+srv://socialNetwork:socialNetwork@cluster0.fnlkhjz.mongodb.net/socialNetwork");

export async function getUserById(id_num) {
  try {
    await client.connect();
    const database = client.db('socialNetwork');
    const users = database.collection('users');
    return await users.findOne({ id_num: id_num });
  } finally {
    await client.close();
  }
}

export async function getConnections(id_num,workplace, country, hobby) {
    try {
      await client.connect();
      const database = client.db('socialNetwork');
      const users = database.collection('users');
      console.log( workplace,  country,  hobby);
      return await users.find({ 
        $and: [
          { id_num: { $ne: id_num } },
          {
            $or: [
              { workplace: workplace },
              { country: country },
              { hobby: hobby }
            ]
          }
        ]
      }, {
        projection: { password: 0 }  // Exclude the password field
      }).toArray();
    } finally {
      await client.close();
    }
}
  
