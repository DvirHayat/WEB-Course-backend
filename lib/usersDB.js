import connectToDatabase from './mongodb';

let db;
let client;
let usersCollection;

//initiate connection
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
    
    return await usersCollection.findOne({ id_num: id_num },{projection:{_id:0}});
  }
  
  export async function getUserByEmail(emailVar) {
    if (!usersCollection) {
      throw new Error('Database not initialized');
    }
    
    return await usersCollection.findOne({ email: emailVar},{projection:{_id:0}});
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
      projection: { _id:0,password: 0,role:0 }  // Exclude the password and role fields
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
  
  /**fetch all users (non-admin)*/
  export async function getAllUsers(){
    if (!usersCollection) {
      throw new Error('Database not initialized');
    }
  
    return await usersCollection
    .find({role:"user"}, { projection: { _id: 0, password: 0, role: 0 } }) 
    .toArray();
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

  
/** for debug*/
export async function deleteAllUsers(){
    return await usersCollection.deleteMany({})
  }