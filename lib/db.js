import connectToDatabase from './mongodb';

let db;
let client;
let usersCollection;

(async () => {
  const connection = await connectToDatabase();
  db = connection.connection.db;
  client = connection;
  usersCollection = db.collection('users');
})();

export async function getUserById(id_num) {
  if (!usersCollection) {
    throw new Error('Database not initialized');
  }
  
  return await usersCollection.findOne({ id_num: id_num });
}

export async function getUserByEmail(emailVar) {
  if (!usersCollection) {
    throw new Error('Database not initialized');
  }
  
  return await usersCollection.findOne({ email: emailVar });
}

export async function getConnections(id_num, workplace, country, hobby) {
  if (!usersCollection) {
    throw new Error('Database not initialized');
  }

  return await usersCollection.find({ 
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
}

export async function newUser(newFirstName, newLastName, newEmail, newIdNum, newCountry, newCity, newWorkplace, newHobby, newGender, newPassword,newBirthdate) {
  if (!usersCollection) {
    throw new Error('Database not initialized');
  }

  console.log(`Reached new User with ${newEmail}`);
  
  return await usersCollection.insertOne({
    "firstName": newFirstName,
    "lastName": newLastName,
    "birthday": newBirthdate,
    "workplace": newWorkplace,
    "email": newEmail,
    "country": newCountry,
    "city": newCity,
    "gender": newGender,
    "id_num": newIdNum,
    "hobby": newHobby,
    "password": newPassword
  });
}
