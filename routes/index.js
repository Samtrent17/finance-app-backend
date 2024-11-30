const express = require('express');
const router = express.Router();
const budgetRoutes = require('./budgetRoutes'); // Import budget routes
const reportRoutes = require('./reportRoutes'); // Import report routes
const userRoutes = require('./userRoutes'); // Import user routes (if you have one)
const authRoutes = require('./authRoutes'); // Import authentication routes (if you have one)

// Define the main routes
router.use('/budgets', budgetRoutes); // Use budget routes
router.use('/reports', reportRoutes); // Use report routes
router.use('/users', userRoutes); // Use user routes
router.use('/auth', authRoutes); // Use authentication routes

// Define a route for the home page
router.get('/', (res) => {
    res.render('index'); // Render the index.ejs view
});

// Render the index page
router.get('/', (res) => {
    res.render('index'); // Renders index.ejs
});

// Render the dashboard page
router.get('/dashboard', (res) => {
    const totalIncome = 6000; // Example data
    const totalExpenses = 6000; // Example data
    const netIncome = totalIncome - totalExpenses; // Example calculation
    const transactions = [
        { source: 'Salary', amount: 6000, date: new Date() },
        { source: 'Freelance', amount: 2000, date: new Date() }
    ]; // Example data

    res.render('dashboard', { totalIncome, totalExpenses, netIncome, transactions });
});

// Render the report page
router.get('/reports', (res) => {
    const totalIncome = 6000; // Example data
    const totalExpenses = 6000; // Example data
    const netIncome = totalIncome - totalExpenses; // Example calculation

    res.render('report', { totalIncome, totalExpenses, netIncome });
});

// Export the router
module.exports = router;