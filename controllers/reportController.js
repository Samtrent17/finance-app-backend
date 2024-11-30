const dbConnection = require('../models/myDB/DBconnection'); // Adjust the path as necessary

// Generate a report of total income
exports.generateIncomeReport = async (req, res) => {
    try {
        const query = 'SELECT SUM(amount) AS totalIncome FROM incomes';
        const [result] = await dbConnection.execute(query);
        res.status(200).json({ totalIncome: result[0].totalIncome });
    } catch (error) {
        console.error('Error generating income report:', error);
        res.status(500).json({ message: 'Error generating income report' });
    }
};

// Generate a report of total expenses (assuming you have an expenses table)
exports.generateExpenseReport = async (req, res) => {
    try {
        const query = 'SELECT SUM(amount) AS totalExpenses FROM expenses';
        const [result] = await dbConnection.execute(query);
        res.status(200).json({ totalExpenses: result[0].totalExpenses });
    } catch (error) {
        console.error('Error generating expense report:', error);
        res.status(500).json({ message: 'Error generating expense report' });
    }
};

// Generate a summary report (total income and expenses)
exports.generateSummaryReport = async (req, res) => {
    try {
        const incomeQuery = 'SELECT SUM(amount) AS totalIncome FROM incomes';
        const expenseQuery = 'SELECT SUM(amount) AS totalExpenses FROM expenses';

        const [incomeResult] = await dbConnection.execute(incomeQuery);
        const [expenseResult] = await dbConnection.execute(expenseQuery);

        res.status(200).json({
            totalIncome: incomeResult[0].totalIncome,
            totalExpenses: expenseResult[0].totalExpenses,
            netIncome: incomeResult[0].totalIncome - expenseResult[0].totalExpenses
        });
    } catch (error) {
        console.error('Error generating summary report:', error);
        res.status(500).json({ message: 'Error generating summary report' });
    }
};