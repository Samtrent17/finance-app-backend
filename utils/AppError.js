// utils/AppError.js

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Indicate that this is an operational error
    }
}

module.exports = AppError;