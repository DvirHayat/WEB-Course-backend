import {getAllUsers,getUserByEmail,deleteUserByEmail, deleteAllUsers} from '../../lib/usersDB'; 
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {

  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    
    switch (req.method) {
      //delete users
      case 'DELETE':
        await handleDeleteRequest(req, res);
        break;
      case 'PATCH':
        await handlePatchRequest(req, res);
        break;  
      //get all users - also has in admin login
      case 'GET':
          await handleGetRequest(req, res);
          break;      
      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}

/**
 * Handles the DELETE request to remove a user by email.
 *
 * This function expects a JSON object in the request body containing an `email` field.
 * It checks if the email exists in the database, and if so, deletes the corresponding user.
 * If the email is missing or the user is not found, it returns an appropriate error message.
 *
 * @param {Object} req - The HTTP request object, containing information about the DELETE request.
 * @param {Object} res - The HTTP response object, used to send a response back to the client.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 *
 * @throws {Error} - Returns a 400 status code if the email is not provided in the request body.
 *                   Returns a 404 status code if no user is found with the provided email.
 *                   Returns a 500 status code if there is an error during the deletion process.
 */
async function handleDeleteRequest(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await deleteUserByEmail(email);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error });
  }
}


/** Handles the GET request to fetch all users */
async function handleGetRequest(req, res) {
  try {
    // Fetch all users from the database
    const connections = await getAllUsers();
    
    // Send the users data as a JSON response
    res.status(200).json({connections});
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
}

/**
 * For debugging and db user update
 * @param {*} req 
 * @param {*} res 
 */
async function handlePatchRequest(req, res) {
  try {
    // Fetch all users from the database
    const users = await deleteAllUsers();
    
    // Send the users data as a JSON response
    res.status(200).json({message: 'Deleted all users'});
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
}

  // Function to set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,PATCH,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }


