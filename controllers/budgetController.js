const dbConnection = require('../models/myDB/DBconnection'); // Adjust the path as necessary
const budgetModel = require('../models/Budget'); // Adjust the path as necessary

// Example function to create a budget
exports.createBudget = async (req, res) => {
    const { name, amount, category } = req.body;

    try {
        const budgetId = await budgetModel.createBudget(name, amount, category);
        res.status(201).json({ message: 'Budget created successfully', budgetId });
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({ message: 'Error creating budget' });
    }
};
// Create a new budget
exports.createBudget = async (req, res) => {
    const { name, amount, category } = req.body; // Assuming you're sending this data in the request body

    try {
        const query = 'INSERT INTO budgets (name, amount, category, created_at) VALUES (?, ?, ?, NOW())';
        const [result] = await dbConnection.execute(query, [name, amount, category]);
        res.status(201).json({ message: 'Budget created successfully', budgetId: result.insertId });
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({ message: 'Error creating budget' });
    }
};

// Get all budgets
exports.getBudgets = async (req, res) => {
    try {
        const query = 'SELECT * FROM budgets';
        const [budgets] = await dbConnection.execute(query);
        res.status(200).json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Error fetching budgets' });
    }
};

// Update a budget
exports.updateBudget = async (req, res) => {
    const { id, name, amount, category } = req.body;

    try {
        const query = 'UPDATE budgets SET name = ?, amount = ?, category = ? WHERE id = ?';
        const [result] = await dbConnection.execute(query, [name, amount, category, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json({ message: 'Budget updated successfully' });
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: 'Error updating budget' });
    }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
    const { id } = req.params; // Assuming the budget ID is passed as a URL parameter

    try {
        const query = 'DELETE FROM budgets WHERE id = ?';
        const [result] = await dbConnection.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: 'Error deleting budget' });
    }
};