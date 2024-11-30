// models/expenses.js

const dbConnection = require('./myDB/DBconnection'); // Adjust the path as necessary

// Function to create a new expense
const createExpense = async (source, amount, date) => {
    const query = 'INSERT INTO expenses (source, amount, date, created_at) VALUES (?, ?, ?, NOW())';
    const [result] = await dbConnection.execute(query, [source, amount, date]);
    return result.insertId; // Return the ID of the newly created expense
};

// Function to get all expenses
const getAllExpenses = async () => {
    const query = 'SELECT * FROM expenses';
    const [expenses] = await dbConnection.execute(query);
    return expenses; // Return the list of expenses
};

// Function to update an expense by ID
const updateExpense = async (id, source, amount, date) => {
    const query = 'UPDATE expenses SET source = ?, amount = ?, date = ? WHERE id = ?';
    const [result] = await dbConnection.execute(query, [source, amount, date, id]);
    return result.affectedRows; // Return the number of affected rows
};

// Function to delete an expense by ID
const deleteExpense = async (id) => {
    const query = 'DELETE FROM expenses WHERE id = ?';
    const [result] = await dbConnection.execute(query, [id]);
    return result.affectedRows; // Return the number of affected rows
};

// Export the functions for use in controllers
module.exports = {
    createExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense,
};