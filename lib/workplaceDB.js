import connectToDatabase from './mongodb';

let db;
let client;
let workplaceCollection;

//initiate connection
(async () => {
  const connection = await connectToDatabase();
  db = connection.connection.db;
  client = connection;
  workplaceCollection = db.collection('workplaces');
})();

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
  