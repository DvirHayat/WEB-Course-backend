import { getUserById,newUser,getUserByEmail,getHobbies,getWorkplaces} from '../../lib/db'; 
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {

  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    
    switch (req.method) {
      case 'POST':
        await handlePostRequest(req, res);
        break;
        
      case 'GET':
        await handleGetRequest(res);
        break;
        
      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}

async function handlePostRequest(req, res) {
  const { 
    newFirstName, newLastName, newEmail, newIdNum, 
    newCountry, newCity, newWorkplace, newHobby, 
    newGender, newPassword, newBirthdate 
  } = req.body;

  const user = await getUserById(newIdNum);
  const email = await getUserByEmail(newEmail);

  if (user) {
    return res.status(401).json({ message: 'User is already in the database' });
  }
  
  if (email) {
    return res.status(401).json({ message: 'Email is already in the database' });
  }

  await newUser(
    newFirstName, newLastName, newEmail, newIdNum, 
    newCountry, newCity, newWorkplace, newHobby, 
    newGender, newPassword, newBirthdate
  );
  
  res.status(200).json({ message: 'User successfully registered' });
}

/**
 * Handles a GET request and returns a JSON object containing hobbies and workplaces.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON object with two properties:
 *                   - hobbies: An array of hobbies.
 *                   - workplaces: An array of workplaces.
 */
async function handleGetRequest(res) {
  const hobbies = await getHobbies();
  const workplaces = await getWorkplaces();
  res.status(200).json({ hobbies, workplaces });
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
