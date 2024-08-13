
import {newWorkplace, deleteWorkplaceByName, getWorkplaces } from '../../lib/db';
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      // Get all workplaces or a specific one
      case 'GET':
        await handleGetRequest(req, res);
        break;

      // Add a new workplace
      case 'PUT':
        await handlePutRequest(req, res);
        break;

      // Delete a workplace
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
 * Handles the GET request to fetch all workplaces.
 * @param {Object} req 
 * @param {Object} res 
 */
async function handleGetRequest(req, res) {
  try {
      const workplaces = await getWorkplaces();
      return res.status(200).json(workplaces);
    }
  catch (error) {
    console.error('Error fetching workplaces:', error);
    res.status(500).json({ message: 'Failed to fetch workplaces', error });
  }
}

/**
 * Handles the PUT request to add a new workplace.
 * @param {Object} req 
 * @param {Object} res 
 */
async function handlePutRequest(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workplace name is required' });
    }

    const result = await newWorkplace(name);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding workplace:', error);
    res.status(500).json({ message: 'Failed to add workplace', error });
  }
}

/**
 * Handles the DELETE request to remove a workplace by name.
 * @param {Object} req 
 * @param {Object} res 
 */
async function handleDeleteRequest(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workplace name is required' });
    }

    const result = await deleteWorkplaceByName(name);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Workplace not found' });
    }

    res.status(200).json({ message: 'Workplace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workplace:', error);
    res.status(500).json({ message: 'Failed to delete workplace', error });
  }
}

// Function to set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
