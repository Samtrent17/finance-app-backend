const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/myDB/DBconnection');
const authenticateUser = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the directory to save uploaded files

// Login route
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt - Request body:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing credentials:', { email: !!email, password: !!password });
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const connection = await db();
        
        // Log the SQL query (remove in production)
        const query = `SELECT id, username, email, password, first_name, middle_name, last_name 
                      FROM User WHERE email = ?`;
        console.log('Executing query:', query, 'with email:', email);

        const [users] = await connection.execute(query, [email]);
        console.log('Database response:', users.length ? 'User found' : 'No user found');

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const user = users[0];
        console.log('Found user:', { 
            id: user.id, 
            email: user.email, 
            hasPassword: !!user.password 
        });

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Update last login
        await connection.execute(
            'UPDATE User SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful, sending response');
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                middleName: user.middle_name,
                lastName: user.last_name
            }
        });

    } catch (error) {
        console.error('Login error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: 'An error occurred during login. Please try again.'
        });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', {
            ...req.body,
            password: '***' // Hide password in logs
        });

        const { 
            username, 
            email, 
            password,
            firstName,
            middleName,
            lastName 
        } = req.body;

        // Validate required fields
        if (!username || !email || !password || !firstName || !lastName) {
            console.log('Missing required fields:', {
                hasUsername: !!username,
                hasEmail: !!email,
                hasPassword: !!password,
                hasFirstName: !!firstName,
                hasLastName: !!lastName
            });
            return res.status(400).json({
                error: 'Please provide all required fields'
            });
        }

        const connection = await db();

        // Check if email already exists
        const [existingUsers] = await connection.execute(
            'SELECT id FROM User WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const [result] = await connection.execute(
            `INSERT INTO User (
                username, email, password, 
                first_name, middle_name, last_name,
                last_login
            ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [
                username, 
                email, 
                hashedPassword, 
                firstName,
                middleName || null,
                lastName
            ]
        );

        console.log('User created successfully:', {
            id: result.insertId,
            username,
            email
        });

        // Create token
        const token = jwt.sign(
            { 
                userId: result.insertId, 
                username,
                firstName,
                lastName
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                username,
                email,
                firstName,
                middleName,
                lastName
            }
        });

    } catch (error) {
        console.error('Registration error details:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        res.status(500).json({
            error: 'Error registering user: ' + error.message
        });
    }
});

// Add this test route
router.get('/test-db', async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute('SELECT 1');
        res.json({ message: 'Database connection successful', data: rows });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Update user route
router.put('/update', authenticateUser, upload.single('profilePhoto'), async (req, res) => {
    try {
        const { firstName, lastName, email, phone, darkMode } = req.body; // Ensure darkMode is included
        const profilePhoto = req.file ? req.file.path : null; // Get the uploaded file path
        const connection = await db();

        // Update user information
        await connection.execute(
            `UPDATE User SET first_name = ?, last_name = ?, email = ?, phone = ?, profilePhoto = ?, darkMode = ? 
             WHERE id = ?`,
            [firstName, lastName, email, phone, profilePhoto, darkMode, req.user.userId] // Include darkMode in the update
        );

        // Fetch updated user data
        const [updatedUser] = await connection.execute(
            `SELECT * FROM User WHERE id = ?`,
            [req.user.userId]
        );

        res.json({
            message: 'User updated successfully',
            user: updatedUser[0]
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

module.exports = router;
