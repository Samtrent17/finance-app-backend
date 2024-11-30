// models/user.js

const dbConnection = require('./myDB/DBconnection'); // Adjust the path as necessary

// Function to create a new user
const createUser = async (username, password, email) => {
    const query = 'INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, NOW())';
    const [result] = await dbConnection.execute(query, [username, password, email]);
    return result.insertId; // Return the ID of the newly created user
};

// Function to get all users
const getAllUsers = async () => {
    const query = 'SELECT * FROM users';
    const [users] = await dbConnection.execute(query);
    return users; // Return the list of users
};

// Function to get a user by ID
const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [user] = await dbConnection.execute(query, [id]);
    return user[0]; // Return the user object
};

// Function to update a user by ID
const updateUser = async (id, username, password, email) => {
    const query = 'UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?';
    const [result] = await dbConnection.execute(query, [username, password, email, id]);
    return result.affectedRows; // Return the number of affected rows
};

// Function to delete a user by ID
const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await dbConnection.execute(query, [id]);
    return result.affectedRows; // Return the number of affected rows
};

// Export the functions for use in controllers
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};