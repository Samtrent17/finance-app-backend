const incomeModel = require('../models/income'); // Import the income model
const AppError = require('../utils/AppError'); // Import the custom error class

// Function to create a new income entry
exports.createIncome = async (source, amount, date) => {
    if (!source || !amount) {
        throw new AppError('Source and amount are required', 400);
    }
    const incomeId = await incomeModel.createIncome(source, amount, date);
    return incomeId; // Return the ID of the newly created income entry
};

// Function to get all income entries
exports.getAllIncomes = async () => {
    const incomes = await incomeModel.getAllIncomes();
    return incomes; // Return the list of income entries
};

// Function to update an income entry by ID
exports.updateIncome = async (id, source, amount, date) => {
    const affectedRows = await incomeModel.updateIncome(id, source, amount, date);
    if (affectedRows === 0) {
        throw new AppError('Income entry not found', 404);
    }
    return affectedRows; // Return the number of affected rows
};

// Function to delete an income entry by ID
exports.deleteIncome = async (id) => {
    const affectedRows = await incomeModel.deleteIncome(id);
    if (affectedRows === 0) {
        throw new AppError('Income entry not found', 404);
    }
    return affectedRows; // Return the number of affected rows
};