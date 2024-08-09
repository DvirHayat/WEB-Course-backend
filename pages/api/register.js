import { getUserById, newUser, getUserByEmail } from '../../lib/db'; 
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // Ensure database connection
  await connectToDatabase();

  // Handle registration for both POST and OPTIONS requests
  if (req.method === 'POST' || req.method === 'OPTIONS') {
    console.log(req.body);
    const { newFirstName, newLastName, newEmail, newIdNum, newCountry, newCity, newWorkplace, newHobby, newGender, newPassword, newBirthdate } = req.body;

    try {
      // Check if user or email already exists
      const user = await getUserById(newIdNum);
      const email = await getUserByEmail(newEmail);
      
      if (user) {
        return res.status(401).json({ message: 'User is already in the database' });
      }
      
      if (email) {
        return res.status(401).json({ message: 'Email is already in the database' });
      }

      // Register the new user
      await newUser(newFirstName, newLastName, newEmail, newIdNum, newCountry, newCity, newWorkplace, newHobby, newGender, newPassword, newBirthdate);
      return res.status(200).json({ message: 'User successfully registered' });

    } catch (error) {
      console.error('Internal server error:', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  // Handle other methods
  console.log('Method not allowed');
  return res.status(405).json({ message: 'Method not allowed' });
}