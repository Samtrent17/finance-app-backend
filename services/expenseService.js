const connection = require('../models/myDB/DBconnection');

// Add a new expense
const addExpense = async (userID, amount, category, description) => {
  const [result] = await connection.query(
    'INSERT INTO expenses (userID, amount, category, description, date) VALUES (?, ?, ?, ?, NOW())',
    [userID, amount, category, description]
  );
  return result.insertId;
};

// Fetch all expenses for a user
const getExpenses = async (userID) => {
  const [expenses] = await connection.query(
    'SELECT * FROM expenses WHERE userID = ? ORDER BY date DESC',
    [userID]
  );
  return expenses;
};

module.exports = { addExpense, getExpenses };
