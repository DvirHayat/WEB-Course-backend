import {getUserById,newUser,getUserByEmail } from '../../lib/db'; 
import connectToDatabase from '../../lib/mongodb';

  
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'POST'); // Allowed methods , POST, PUT, DELETE
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
  
    console.log('Connecting to the database...');
    await connectToDatabase();
    console.log('Connected to the database');
  
    if (req.method !== 'POST') {
      console.log('Method not allowed');
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    console.log(req.body) 
    const { newFirstName,newLastName, newEmail,newIdNum,newCountry,newCity,newWorkplace,newHobby,newGender, newPassword } = req.body; 
    try {
      console.log('Fetching user from the database...');
      const user = await getUserById(newIdNum);
      const email =await getUserByEmail(newEmail);
      console.log('User fetched:', user);
        
      if (user) {
        console.log('User is Already in the database');
        return res.status(401).json({ message: 'User is Already in the database' });
    }
      if (email){
        console.log('Email is Already in the database');
        return res.status(401).json({ message: 'Email is Already in the database' });
    }
        
        //Valid "primary keys"
        await newUser(newFirstName,newLastName, newEmail,newIdNum,newCountry,newCity,newWorkplace,newHobby,newGender, newPassword);
        return res.status(200).json({ message: 'User succesfully registered'});
    } catch (error) {
      console.error('Internal server error:', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }
  