const connection = require('../models/myDB/DBconnection');

const expensesModel = require('../models/Expenses'); // Import the expenses model

// Create a new expense
exports.createExpense = async (req, res) => {
    const { source, amount, date } = req.body; // Expecting these fields in the request body

    try {
        const expenseId = await expensesModel.createExpense(source, amount, date);
        res.status(201).json({ message: 'Expense created successfully', expenseId });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Error creating expense' });
    }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await expensesModel.getAllExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
};

// Update an expense
exports.updateExpense = async (req, res) => {
    const { id, source, amount, date } = req.body; // Expecting these fields in the request body

    try {
        const affectedRows = await expensesModel.updateExpense(id, source, amount, date);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Error updating expense' });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    const { id } = req.params; // Expecting the expense ID in the URL parameters

    try {
        const affectedRows = await expensesModel.deleteExpense(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense' });
    }
};

const addExpense = async (req, res) => {
  const { userID, amount, category, description } = req.body;

  try {
    await connection.query(
      'INSERT INTO expenses (userID, amount, category, description, date) VALUES (?, ?, ?, ?, NOW())',
      [userID, amount, category, description]
    );
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  const { userID } = req.params;

  try {
    const [expenses] = await connection.query('SELECT * FROM expenses WHERE userID = ?', [userID]);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addExpense, getExpenses };
