const dbConnection = require('./myDB/DBconnection'); // Adjust the path as necessary

// Function to create a new budget
const createBudget = async (name, amount, category) => {
    const query = 'INSERT INTO budgets (name, amount, category, created_at) VALUES (?, ?, ?, NOW())';
    const [result] = await dbConnection.execute(query, [name, amount, category]);
    return result.insertId; // Return the ID of the newly created budget
};

// Function to get all budgets
const getAllBudgets = async () => {
    const query = 'SELECT * FROM budgets';
    const [budgets] = await dbConnection.execute(query);
    return budgets; // Return the list of budgets
};

// Function to update a budget by ID
const updateBudget = async (id, name, amount, category) => {
    const query = 'UPDATE budgets SET name = ?, amount = ?, category = ? WHERE id = ?';
    const [result] = await dbConnection.execute(query, [name, amount, category, id]);
    return result.affectedRows; // Return the number of affected rows
};

// Function to delete a budget by ID
const deleteBudget = async (id) => {
    const query = 'DELETE FROM budgets WHERE id = ?';
    const [result] = await dbConnection.execute(query, [id]);
    return result.affectedRows; // Return the number of affected rows
};

// Export the functions for use in controllers
module.exports = {
    createBudget,
    getAllBudgets,
    updateBudget,
    deleteBudget,
};