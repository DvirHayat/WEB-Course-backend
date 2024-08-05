import {getConnections, getUserById } from '../../lib/db'; // Replace with your actual DB logic
import connectToDatabase from '../../lib/mongodb';

  
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allowed methods - , POST, PUT, DELETE
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  console.log('Connecting to the database...');
  await connectToDatabase();
  console.log('Connected to the database');

  if (req.method !== 'GET') {
    console.log('Method not allowed');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Handling GET request...');
  const { id_num, password } = req.query; // Use req.query for GET parameters
  console.log('Received parameters:',  id_num, password );

  if (!id_num || !password) {
    console.log('ID and password are required');
    return res.status(400).json({ message: 'ID and password are required' });
  }

  try {
    console.log('Fetching user from the database...');
    const user = await getUserById(id_num);
    console.log('User fetched:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare provided password with the stored password
    const isPasswordValid = (password === user.password);
    console.log('Password validation result:', isPasswordValid);

    if (isPasswordValid) {
      console.log('Password is valid');
      const connections = await getConnections(user.id_num,user.workplace,user.country, user.hobby);
      return res.status(200).json({ user:user,connections: connections });
    } else {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
}
