import { getConnections, getUserById } from '../../lib/db'; 
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
    
    await connectToDatabase();
    console.log('Connected to the database');
  
    if (req.method !== 'GET') {
      console.log('Method not allowed');
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const { id_num } = req.query; // Use req.query for GET parameters
  
    try {
      
      console.log('Fetching user from the database...');
      const user = await getUserById(id_num);
      // console.log('User fetched:', user);
  
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User found, fetching connections');
      const connections = await getConnections(user.id_num,user.workplace,user.country, user.hobby);
      console.log("connections are: ",connections)
      return res.status(200).json({ data: connections });
    
    }
    catch (error) {
      console.error('Internal server error:', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
}
