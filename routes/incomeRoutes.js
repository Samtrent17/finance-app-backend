const express = require('express');
const router = express.Router();
const db = require('../models/myDB/DBconnection');
const authenticateUser = require('../middleware/authMiddleware');

// Get all income entries for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    try {
        const connection = await db();
        const [incomes] = await connection.execute(
            `SELECT * FROM income WHERE user_id = ? ORDER BY date DESC`,
            [req.user.userId]
        );
        res.json(incomes);
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ error: 'Failed to fetch income entries' });
    }
});

// Create new income entry
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { amount, source, description, date } = req.body;
        
        if (!amount || !source || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const connection = await db();
        console.log('User ID:', req.user.userId);
        const [result] = await connection.execute(
            'INSERT INTO income (user_id, amount, source, description, date) VALUES (?, ?, ?, ?, ?)',
            [req.user.userId, amount, source, description, date]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Income entry created successfully'
        });
    } catch (error) {
        console.error('Error creating income entry:', error);
        res.status(500).json({ error: 'Failed to create income entry' });
    }
});

// Other routes (update, delete, etc.) can be added similarly

module.exports = router;
