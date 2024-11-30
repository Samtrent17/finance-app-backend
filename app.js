const express = require('express');
const errorHandler = require('./middleware/errorHandler')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const authenticateUser = require('./middleware/authMiddleware');
const createConnection = require('./models/myDB/DBconnection');

const app = express();

// Middleware - Order is important!
app.use(cors());  // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
    return res.json('From backend side');
});

const startServer = async () => {
    try {
        await createConnection(); // Test the database connection
        console.log('Database connected successfully');

        // Mount routes
        app.use('/api/auth', authRoutes);
        app.use('/api/expenses', authenticateUser, expenseRoutes);
        app.use('/api/budgets', budgetRoutes);
        app.use('/api/reports', reportRoutes);
        app.use('/api/index', indexRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/income', authenticateUser, incomeRoutes);

        // Test endpoint
        app.get('/api/test', (req, res) => {
            res.json({ message: 'Backend is connected!' });
        });

        // Error handling middleware
        app.use(errorHandler);

        const PORT = process.env.PORT || 3307;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
