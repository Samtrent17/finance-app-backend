const Joi = require('joi');

// Validation schemas
const expenseSchema = Joi.object({
  userID: Joi.number().required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().max(255).required(),
  description: Joi.string().optional(),
});

const incomeSchema = Joi.object({
  userID: Joi.number().required(),
  amount: Joi.number().positive().required(),
  source: Joi.string().max(255).required(),
  description: Joi.string().optional(),
});

const validateExpense = (req, res, next) => {
  const { error } = expenseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateIncome = (req, res, next) => {
  const { error } = incomeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateExpense, validateIncome };
