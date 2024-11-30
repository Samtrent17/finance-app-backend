const express = require('express');
const router = express.Router();
const db = require('../models/myDB/DBconnection');
const authenticateUser = require('../middleware/authMiddleware');

// Get all expenses for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    try {
        const connection = await db();
        const [expenses] = await connection.execute(
            'SELECT * FROM Expenses WHERE user_id = ? ORDER BY date DESC',
            [req.user.userId]
        );
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Add new expense
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { amount, description, category, date } = req.body;

        // Check for required fields
        if (!amount || !description || !category || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const connection = await db();
        const [result] = await connection.execute(
            `INSERT INTO Expenses (user_id, amount, description, category, date) 
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.userId, amount, description, category, date]
        );

        res.status(201).json({
            id: result.insertId,
            user_id: req.user.userId,
            amount,
            description,
            category,
            date
        });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

// Get expense summaries
router.get('/summary', authenticateUser, async (req, res) => {
    try {
        const connection = await db();
        const [expenses] = await connection.execute(
            'SELECT * FROM Expenses WHERE user_id = ?',
            [req.user.userId]
        );

        const today = new Date();
        const monthlyExpenses = expenses.filter(expense => new Date(expense.date).getMonth() === today.getMonth());
        const weeklyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= new Date(today.setDate(today.getDate() - 7));
        });
        const dailyExpenses = expenses.filter(expense => new Date(expense.date).toDateString() === today.toDateString());

        const totalMonthly = monthlyExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        const totalWeekly = weeklyExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        const totalDaily = dailyExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

        res.json({
            totalMonthly,
            totalWeekly,
            totalDaily
        });
    } catch (error) {
        console.error('Error fetching expense summary:', error);
        res.status(500).json({ error: 'Failed to fetch expense summary' });
    }
});

module.exports = router;
