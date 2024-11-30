const mysql = require('mysql2/promise');
require('dotenv').config();

const createConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'finance_tracking',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('Database connected successfully');
        return connection;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

// Export the function directly
module.exports = createConnection;
