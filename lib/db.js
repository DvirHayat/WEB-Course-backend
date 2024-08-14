import connectToDatabase from './mongodb';

let db;
let client;
let usersCollection;
let hobbiesCollection;
let workplaceCollection;

//initiate connection
(async () => {
  const connection = await connectToDatabase();
  db = connection.connection.db;
  client = connection;
  usersCollection = db.collection('users');
  hobbiesCollection = db.collection('hobbies');
  workplaceCollection = db.collection('workplaces');
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

/**
  @param {string} id_num  - current user id number 
  @param {string} workplace - current user id workplace 
  @param {string} country - current user id country 
  @param {string} hobby - current user id hobby
  @returns {Array} array of users with some field in common 
*/
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
    projection: { password: 0,role:0 }  // Exclude the password and role fields
  }).toArray();
}

/** enters new user to db*/ 
export async function newUser(newFirstName, newLastName, newEmail, newIdNum, newCountry, newWorkplace, newHobby, newGender, newPassword,newBirthdate) {
  if (!usersCollection) {
    throw new Error('Database not initialized');
  }

  return await usersCollection.insertOne({
    "firstName": newFirstName,
    "lastName": newLastName,
    "birthday": newBirthdate,
    "workplace": newWorkplace,
    "email": newEmail,
    "country": newCountry,
    "gender": newGender,
    "id_num": newIdNum,
    "hobby": newHobby,
    "password": newPassword,
    "role":"user"
  });
}

/**fetch all users (non admin)*/
export async function getAllUsers(){
  if (!usersCollection) {
    throw new Error('Database not initialized');
  }

  return await usersCollection.find({},  // No filter, fetch all users ---- 
    { projection: { _id: 0 ,password: 0, role: 0 } }  // Exclude the password and role fields
  ).toArray();
}
/** delete user by mail */
export async function deleteUserByEmail(email) {
  if (!usersCollection) {
    throw new Error('Database not initialized');
  }

  // Delete the user with the specified email
  const result = await usersCollection.deleteOne({ email });

  if (result.deletedCount === 0) {
    return { message: 'User not found' };
  }

  return { message: 'User deleted successfully' };
}

// ------------- hobbies 

/**fetch all hobbies */
export async function getHobbies(){
  if (!hobbiesCollection) {
    throw new Error('Database not initialized');
  }

  return await hobbiesCollection.find({},{projection: { _id: 0 }}).toArray();
}

/** Ensure one hobby entry by name */
async function getHobby(hobbyname) {
  if (!hobbiesCollection) {
    throw new Error('Database not initialized');
  }

  // Find the hobby by name
  const hobby = await hobbiesCollection.findOne({ activity: hobbyname });
  // Return the hobby
  return hobby;
}

/** Add hobby to the collection if it doesn't already exist */
export async function newHobby(name) {
  if (!hobbiesCollection) {
    throw new Error('Database not initialized');
  }

  // Check if the hobby already exists
  const existingHobby = await getHobby(name);
  if (existingHobby) {
    return { message: 'Hobby already exists' };
  }

  // Add a new hobby to the collection
  return await hobbiesCollection.insertOne({
    activity: name
  });
}

/** Delete a hobby from the collection by its name */
export async function deleteHobbyByName(name) {
  if (!hobbiesCollection) {
    throw new Error('Database not initialized');
  }

  // Delete the hobby by name
  const result = await hobbiesCollection.deleteOne({ activity: name });

  return result;
}

// ----------- workplace

/**fetch all workplaces to collection*/
export async function getWorkplaces(){
  if (!workplaceCollection) {
    throw new Error('Database not initialized');
  }

  return await workplaceCollection.find({},{projection: { _id: 0 }}).toArray();
}

/** Ensure one workplace entry by name */
async function getWorkplace(workplacename) {
  if (!workplaceCollection) {
    throw new Error('Database not initialized');
  }
  
  // Find the workplace by name
  return await workplaceCollection.findOne({ workplace: workplacename });
}

/** Add workplace to the collection if it doesn't already exist */
export async function newWorkplace(name) {
  if (!workplaceCollection) {
    throw new Error('Database not initialized');
  }

  // Check if the workplace already exists
  const existingWorkplace = await getWorkplace(name);
  if (existingWorkplace) {
    return { message: 'Workplace already exists' };
  }

  // Add a new workplace to the collection
  return await workplaceCollection.insertOne({
    workplace: name
  });
}

/** Delete a workplace from the collection by its name */
export async function deleteWorkplaceByName(name) {
  if (!workplaceCollection) {
    throw new Error('Database not initialized');
  }

  // Delete the workplace by name
  const result = await workplaceCollection.deleteOne({ workplace: name });

  return result;
}

//debug
export async function deleteAllUsers(){
  return await usersCollection.deleteMany({})
}

