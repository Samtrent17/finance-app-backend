// models/income.js

const dbConnection = require('./myDB/DBconnection'); // Adjust the path as necessary

// Function to create a new income entry
const createIncome = async (source, amount, date) => {
    const query = 'INSERT INTO incomes (source, amount, date, created_at) VALUES (?, ?, ?, NOW())';
    const [result] = await dbConnection.execute(query, [source, amount, date]);
    return result.insertId; // Return the ID of the newly created income entry
};

// Function to get all income entries
const getAllIncomes = async () => {
    const query = 'SELECT * FROM incomes';
    const [incomes] = await dbConnection.execute(query);
    return incomes; // Return the list of income entries
};

// Function to update an income entry by ID
const updateIncome = async (id, source, amount, date) => {
    const query = 'UPDATE incomes SET source = ?, amount = ?, date = ? WHERE id = ?';
    const [result] = await dbConnection.execute(query, [source, amount, date, id]);
    return result.affectedRows; // Return the number of affected rows
};

// Function to delete an income entry by ID
const deleteIncome = async (id) => {
    const query = 'DELETE FROM incomes WHERE id = ?';
    const [result] = await dbConnection.execute(query, [id]);
    return result.affectedRows; // Return the number of affected rows
};

// Export the functions for use in controllers
module.exports = {
    createIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome,
};