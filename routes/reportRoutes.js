const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController'); // Adjust the path as necessary

// Route to generate an income report
router.get('/income', reportController.generateIncomeReport);

// Route to generate an expense report
router.get('/expenses', reportController.generateExpenseReport);

// Route to generate a summary report
router.get('/summary', reportController.generateSummaryReport);

module.exports = router;