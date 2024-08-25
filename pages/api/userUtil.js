import { getConnections, getUserById } from '../../lib/usersDB'; 
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
    // Set CORS headers to allow cross-origin requests
    setCorsHeaders(res);
  
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ensure the request method is GET
    if (!isGetMethod(req)) {
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  
    // Extract query parameters
    const { id_num } = req.query; 

    try {
        // Connect to the database and retrieve the user
        await connectToDatabase();
        const user = await getUserById(id_num);  // Use id_num here
        const connections = await getConnections(user.id_num,user.workplace,user.country,user.hobby);
        return res.status(200).json({ connections });
    } catch (error) {
        console.error('Error occurred:', error); // Log error details
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
  
// Function to set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
  
// Function to check if the request method is GET
function isGetMethod(req) {
    return req.method === 'GET';
}
