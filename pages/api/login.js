import { getConnections, getUserById } from '../../lib/db'; // Replace with your actual DB logic
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed header
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id_num, password } = req.query; // Use req.query for GET parameters
  if (!id_num || !password) {
    return res.status(400).json({ message: 'ID and password are required' });
  }

  try {
    await connectToDatabase(); // Ensure the database is connected
    const user = await getUserById(id_num);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare provided password with the stored password
    const isPasswordValid = (password === user.password);
    if (isPasswordValid) {
      const connections = await getConnections(user.id_num, user.workplace, user.country, user.hobby);
      return res.status(200).json({ user: user, connections: connections });
    } else {
      return res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
}
