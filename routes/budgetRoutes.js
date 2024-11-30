const express = require('express');
const router = express.Router();
const db = require('../models/myDB/DBconnection');
const authenticateUser = require('../middleware/authMiddleware');

// Get all budgets for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    try {
        const connection = await db();
        const [budgets] = await connection.execute(
            'SELECT * FROM Budgets WHERE user_id = ?',
            [req.user.userId]
        );
        res.json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ error: 'Failed to fetch budgets' });
    }
});

// Create a new budget
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { category, limit, period } = req.body;

        if (!category || !limit || !period) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const connection = await db();
        const [result] = await connection.execute(
            'INSERT INTO Budgets (user_id, category, limit, period) VALUES (?, ?, ?, ?)',
            [req.user.userId, category, limit, period]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Budget created successfully'
        });
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({ error: 'Failed to create budget' });
    }
});

module.exports = router;