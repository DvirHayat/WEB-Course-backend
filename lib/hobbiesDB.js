import connectToDatabase from './mongodb';

let db;
let client;
let hobbiesCollection;

//initiate connection
(async () => {
  const connection = await connectToDatabase();
  db = connection.connection.db;
  client = connection;
  hobbiesCollection = db.collection('hobbies');
})();

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