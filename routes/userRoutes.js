const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust the path as necessary

// Route to register a new user
router.post('/register', userController.createUser);

// Route to login a user
router.post('/login', userController.loginUser);

// Route to get all users (for admin purposes, if needed)
router.get('/', userController.getUsers);

// Route to get a user by ID
router.get('/:id', userController.getUserById);

// Route to update a user by ID
router.put('/:id', userController.updateUser);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;