const userModel = require('../models/user'); // Import the user model
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWTs
const AppError = require('../utils/AppError'); // Import the custom error class

// Function to register a new user
exports.registerUser = async (username, password, email) => {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(username, hashedPassword, email);
    return userId; // Return the ID of the newly created user
};

// Function to login a user
exports.loginUser = async (username, password) => {
    const user = await userModel.getAllUsers().find(user => user.username === username);
    if (!user) {
        throw new AppError('Invalid username or password', 401);
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid username or password', 401);
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user.id }; // Return the token and user ID
};