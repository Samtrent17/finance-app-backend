const dbConnection = require('../models/myDB/DBconnection'); // Adjust the path as necessary
const AppError = require('../utils/AppError')
const incomeModel = require('../models/Income'); // Adjust the path as necessary

// Example function to create an income entry
exports.createIncome = async (req, res) => {
    const { source, amount, date } = req.body;

    try {
        const incomeId = await incomeModel.createIncome(source, amount, date);
        res.status(201).json({ message: 'Income entry created successfully', incomeId });
    } catch (error) {
        console.error('Error creating income entry:', error);
        res.status(500).json({ message: 'Error creating income entry' });
    }
};

// Create a new income entry
exports.createIncome = async (req, res, next) => {
    const { source, amount, date } = req.body;

    try {
        if (!source || !amount) {
            // Throw a custom error if required fields are missing
            return next(new AppError('Source and amount are required', 400));
        }

        const query = 'INSERT INTO incomes (source, amount, date, created_at) VALUES (?, ?, ?, NOW())';
        const [result] = await dbConnection.execute(query, [source, amount, date]);
        res.status(201).json({ message: 'Income entry created successfully', incomeId: result.insertId });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Create a new income entry
exports.createIncome = async (req, res) => {
    const { source, amount, date } = req.body; // Assuming you're sending this data in the request body

    try {
        const query = 'INSERT INTO incomes (source, amount, date, created_at) VALUES (?, ?, ?, NOW())';
        const [result] = await dbConnection.execute(query, [source, amount, date]);
        res.status(201).json({ message: 'Income entry created successfully', incomeId: result.insertId });
    } catch (error) {
        console.error('Error creating income entry:', error);
        res.status(500).json({ message: 'Error creating income entry' });
    }
};

// Get all income entries
exports.getIncomes = async (req, res) => {
    try {
        const query = 'SELECT * FROM incomes';
        const [incomes] = await dbConnection.execute(query);
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Error fetching income entries:', error);
        res.status(500).json({ message: 'Error fetching income entries' });
    }
};

// Update an income entry
exports.updateIncome = async (req, res) => {
    const { id, source, amount, date } = req.body;

    try {
        const query = 'UPDATE incomes SET source = ?, amount = ?, date = ? WHERE id = ?';
        const [result] = await dbConnection.execute(query, [source, amount, date, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Income entry not found' });
        }

        res.status(200).json({ message: 'Income entry updated successfully' });
    } catch (error) {
        console.error('Error updating income entry:', error);
        res.status(500).json({ message: 'Error updating income entry' });
    }
};

// Delete an income entry
exports.deleteIncome = async (req, res) => {
    const { id } = req.params; // Assuming the income ID is passed as a URL parameter

    try {
        const query = 'DELETE FROM incomes WHERE id = ?';
        const [result] = await dbConnection.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Income entry not found' });
        }

        res.status(200).json({ message: 'Income entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting income entry:', error);
        res.status(500).json({ message: 'Error deleting income entry' });
    }
};