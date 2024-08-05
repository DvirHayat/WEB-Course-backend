
import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb+srv://socialNetwork:socialNetwork@cluster0.fnlkhjz.mongodb.net/socialNetwork");
const database = client.db('socialNetwork');
const users = database.collection('users');

export async function getUserById(id_num) {
  try {
    await client.connect();
    return await users.findOne({ id_num: id_num });
  } finally {
    await client.close();
  }
}

export async function getUserByEmail(emailVar) {
  try {
    await client.connect();
    return await users.findOne({ email: emailVar });
  } finally {
    await client.close();
  }
}


export async function getConnections(id_num,workplace, country, hobby) {
    try {
      await client.connect();
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
  
export async function newUser(newFirstName,newLastName,newEmail,newIdNum,newCountry,newCity,newWorkplace,newHobby,newGender, newPassword) {
  try {
    await client.connect();
    console.log("reached new User with ${newEmail}")
    return await users.insertOne({
      "firstName":newFirstName,"lastName":newLastName,"birthday":newIdNum,"workplace":newWorkplace,
      "email":newEmail,"country":newCountry,"city":newCity
      ,"gender":newGender,id_num:newIdNum,"hobby":newHobby,"password":newPassword
      });
  } finally {
    await client.close();
  }
}