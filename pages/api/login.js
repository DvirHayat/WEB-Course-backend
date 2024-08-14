import { getAllUsers, getConnections, getHobbies, getUserById, getWorkplaces } from '../../lib/db'; // Replace with your actual DB logic
import connectToDatabase from '../../lib/mongodb';


export default async function handler(req, res) {
  // Set CORS headers to allow cross-origin requests
  setCorsHeaders(res);

  // Ensure the request method is GET
  if (!isGetMethod(req)) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Extract and validate query parameters
  const { id_num, password } = req.query;
  if (!id_num || !password) {
    return res.status(400).json({ message: 'ID and password are required' });
  }

  try {
    // Connect to the database and retrieve the user
    await connectToDatabase();
    const user = await getUserById(id_num);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle user authentication and role verification
    return await handleUserAuthentication(user, password, res);
  } catch (error) {
    return handleError(error, res);
  }
}

// Function to set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Function to check if the request method is GET
function isGetMethod(req) {
  return req.method === 'GET';
}

// Function to handle user authentication and role verification
async function handleUserAuthentication(user, password, res) {
  const isAdmin = user.role === 'admin';
  const isPasswordValid = password === user.password;

  if (isAdmin && isPasswordValid) {
    // Admin with a valid password - gets all data can edit 
    const connections = await getAllUsers();
    return res.status(200).json({user,connections});
  
  } else if (!isAdmin && isPasswordValid) {
    
    // Non-admin user with a valid password
    const connections = await getConnections(user.id_num, user.workplace, user.country, user.hobby);
    return res.status(200).json({ user, connections });
  } else {
    // Invalid password
    return res.status(401).json({ message: 'Incorrect password' });
  }
}

// Function to handle errors
function handleError(error, res) {
  console.error('Internal server error:', error);
  return res.status(500).json({ message: 'Internal server error', error });
}
