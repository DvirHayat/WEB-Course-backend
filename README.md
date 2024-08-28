# Web-Course-backend

This project is a backend service for managing users in [Social Network](https://social-network-bfr9.vercel.app/) - check it out on [Github](https://github.com/RafaelAbb/SocialNetwork).This project built with **Next.js** and **MongoDB**. It provides various endpoints for user authentication, registration, and administration. The project also uses **Mongoose** for database interactions.

### Clone the repository:
```code
      git clone https://github.com/DvirHayat/WEB-Course-backend
      cd next-backend
 ```
### Install dependencies
 ```code
      npm install
 ```
### Set up environment variables: 
Create a .env.local file in the root directory and add your MongoDB connection string:
```code
      MONGODB_URI=your-mongodb-uri
 ```
or change `db_URI` in `lib/mongodb.js`

### Run the development server:
```code
      npm install
 ```

## Project Structure

### Main Files

- **`login.js`**  
  Handles user login by verifying the user ID and password. The file connects to the MongoDB database, authenticates users, and returns user details if the credentials are valid.

- **`register.js`**  
  Manages user registration. It handles:
  - **POST requests**: Registers new users, ensuring no duplicate emails or IDs are added to the database.
  - **GET requests**: Provides a list of available hobbies and workplaces for the registration process.

- **`userUtil.js`**  
  Provides utility functions to fetch user connections and details. It allows users to find connections based on shared fields such as workplace, country, and hobby.

- **`adminUtil.js`**  
  Contains administrative functions, allowing admins to:
  - Fetch all users (`GET` requests).
  - Delete users by email (`DELETE` requests).

- **`hobbyUtil.js`**  
  Manages hobbies within the application. It handles:
  - **GET requests**: Retrieves all hobbies.
  - **PUT requests**: Adds a new hobby.
  - **DELETE requests**: Removes a hobby by name (only through admin).

- **`workplaceUtil.js`**  
  Manages workplaces within the application. It handles:
  - **GET requests**: Retrieves all workplaces.
  - **PUT requests**: Adds a new workplace.
  - **DELETE requests**: Removes a workplace by name (only through admin).

### Supporting Files

- **`lib/usersDB.js`**  
  Contains all database operations related to users, such as fetching, inserting, and deleting users.

- **`lib/mongodb.js`**  
  Manages the connection to the MongoDB database. It uses Mongoose to establish and cache the connection, ensuring efficient database interactions.

- **`lib/hobbiesDB.js` and `lib/workplaceDB.js`**  
  Contain database operations for managing hobbies and workplaces, respectively. They include functions for retrieving, adding, and deleting records in these collections.

- **`models/User.js`**  
  Defines the Mongoose schema for a `User` object. The schema enforces validation rules for fields such as `firstName`, `lastName`, `email`, `workplace`, and `hobby`.

- **`models/Workplace.js` and `models/Hobby.js`**  
  Contain Mongoose schemas for the workplace and hobby collections, respectively. They are used to manage the different workplaces and hobbies available for user profiles.

### API Endpoints

- **`/api/login`**
  - **Method**: `POST`
  - **Description**: Authenticates a user with their `id_num` and `password`.
  - **Request Body**:
    ```json
    {
      "id_num": "user's ID number",
      "password": "user's password"
    }
    ```
  - **Response**:
    - `200 OK`: Returns user details if authentication is successful.
    - `401 Unauthorized`: If the credentials are invalid.

- **`/api/register`**
  - **Method**: `POST`
  - **Description**: Registers a new user.
  - **Request Body**:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "johndoe@example.com",
      "id_num": "123456",
      "country": "CountryName",
      "workplace": "WorkplaceName",
      "hobby": "HobbyName",
      "gender": "Gender",
      "password": "password",
      "birthday": "YYYY-MM-DD"
    }
    ```
  - **Response**:
    - `201 Created`: User registered successfully.
    - `400 Bad Request`: If any required fields are missing or the email/ID already exists.

- **`/api/userUtil`**
  - **Method**: `GET`
  - **Description**: Retrieves user connections based on shared attributes.
  - **Request Parameters**:
    - `id_num` (required): The current user's ID number.
    - `workplace` (optional): The workplace to match.
    - `country` (optional): The country to match.
    - `hobby` (optional): The hobby to match.
  - **Response**:
    - `200 OK`: Returns an array of users with shared attributes.

- **`/api/adminUtil`**
  - **Method**: `GET`
  - **Description**: Fetches all non-admin users in the database.
  - **Response**:
    - `200 OK`: Returns an array of users.

  - **Method**: `DELETE`
  - **Description**: Deletes a user by email.
  - **Request Body**:
    ```json
    {
      "email": "user@example.com"
    }
    ```
  - **Response**:
    - `200 OK`: User deleted successfully.
    - `404 Not Found`: If the user is not found.

  - **Method**: `PATCH`
  - **Description**: Deletes all users from the database (for debugging purposes).
  - **Response**:
    - `200 OK`: All users deleted successfully.

### Hobby Endpoints

- **`/api/hobbyUtil`**
  - **Method**: `GET`
  - **Description**: Fetches all hobbies.
  - **Response**:
    - `200 OK`: Returns an array of hobbies.

  - **Method**: `PUT`
  - **Description**: Adds a new hobby.
  - **Request Body**:
    ```json
    {
      "activity": "HobbyName"
    }
    ```
  - **Response**:
    - `201 Created`: Hobby added successfully.
    - `400 Bad Request`: If the hobby name is missing.

  - **Method**: `DELETE`
  - **Description**: Deletes a hobby by name.
  - **Request Body**:
    ```json
    {
      "activity": "HobbyName"
    }
    ```
  - **Response**:
    - `200 OK`: Hobby deleted successfully.
    - `404 Not Found`: If the hobby is not found.

### Workplace Endpoints

- **`/api/workplaceUtil`**
  - **Method**: `GET`
  - **Description**: Fetches all workplaces.
  - **Response**:
    - `200 OK`: Returns an array of workplaces.

  - **Method**: `PUT`
  - **Description**: Adds a new workplace.
  - **Request Body**:
    ```json
    {
      "workplace": "WorkplaceName"
    }
    ```
  - **Response**:
    - `201 Created`: Workplace added successfully.
    - `400 Bad Request`: If the workplace name is missing.

  - **Method**: `DELETE`
  - **Description**: Deletes a workplace by name.
  - **Request Body**:
    ```json
    {
      "workplace": "WorkplaceName"
    }
    ```
  - **Response**:
    - `200 OK`: Workplace deleted successfully.
    - `404 Not Found`: If the workplace is not found.


- **`next.config.js`**  
  Configures Next.js to rewrite API routes to the backend URL. This is essential for routing requests during development or in production.

