import { newHobby, deleteHobbyByName, getHobbies } from '../../lib/db';
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      // Get all hobbies or a specific one
      case 'GET':
        await handleGetRequest(req, res);
        break;

      // Add a new hobby
      case 'PUT':
        await handlePutRequest(req, res);
        break;

      // Delete a hobby
      case 'DELETE':
        await handleDeleteRequest(req, res);
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
 * Handles the GET request to fetch all hobbies.
 * @param {Object} req 
 * @param {Object} res 
 */
async function handleGetRequest(req, res) {
  try {
      const hobbies = await getHobbies();
      return res.status(200).json(hobbies);
    }
  catch (error) {
    console.error('Error fetching hobbies:', error);
    res.status(500).json({ message: 'Failed to fetch hobbies', error });
  }
}

/**
 * Handles the PUT request to add a new hobby.
 * @param {Object} req 
 * @param {Object} res 
 */
async function handlePutRequest(req, res) {
  try {
    const { activity } = req.body;

    if (!activity) {
      return res.status(400).json({ message: 'Hobby name is required' });
    }

    const result = await newHobby(activity);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding hobby:', error);
    res.status(500).json({ message: 'Failed to add hobby', error });
  }
}

/**
 * Handles the DELETE request to remove a hobby by name.
 * @param {Object} req 
 * @param {Object} res 
 */
async function handleDeleteRequest(req, res) {
  try {
    const { activity } = req.body;

    if (!activity) {
      return res.status(400).json({ message: 'Hobby name is required' });
    }

    const result = await deleteHobbyByName(activity);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Hobby not found' });
    }

    return res.status(200).json({ message: 'Hobby deleted successfully' });
  } catch (error) {
    console.error('Error deleting hobby:', error);
    res.status(500).json({ message: 'Failed to delete hobby', error });
  }
}

// Function to set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
