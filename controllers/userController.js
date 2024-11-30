// controllers/userController.js

const userModel = require('../models/User'); // Import the user model
const AppError = require('../utils/AppError'); // Import the custom error class

// Create a new user
exports.createUser = async (req, res, next) => {
    const { username, password, email } = req.body;

    try {
        // Validate input
        if (!username || !password || !email) {
            return next(new AppError('Username, password, and email are required', 400));
        }

        const userId = await userModel.createUser(username, password, email);
        res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
        console.error('Error creating user:', error);
        next(new AppError('Error creating user', 500)); // Pass the error to the error handler
    }
};

exports.loginUser = async (req, res, next) => {
    const { username, password } = req.body; // Extract username and password from the request body

    try {
        // Check if the user exists
        const user = await userModel.getAllUsers().find(user => user.username === username);
        if (!user) {
            return next(new AppError('Invalid username or password', 401)); // User not found
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Invalid username or password', 401)); // Password does not match
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token and user ID
        res.status(200).json({ token, userId: user.id });
    } catch (error) {
        console.error('Error logging in user:', error);
        next(new AppError('Error logging in user', 500)); // Pass the error to the error handler
    }
};

// Get all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        next(new AppError('Error fetching users', 500)); // Pass the error to the error handler
    }
};

// Get a user by ID
exports.getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await userModel.getUserById(id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        next(new AppError('Error fetching user', 500)); // Pass the error to the error handler
    }
};

// Update a user by ID
exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, password, email } = req.body;

    try {
        const affectedRows = await userModel.updateUser(id, username, password, email);
        if (affectedRows === 0) {
            return next(new AppError('User not found', 404));
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        next(new AppError('Error updating user', 500)); // Pass the error to the error handler
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const affectedRows = await userModel.deleteUser(id);
        if (affectedRows === 0) {
            return next(new AppError('User not found', 404));
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        next(new AppError('Error deleting user', 500)); // Pass the error to the error handler
    }
};