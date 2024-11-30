// testConnection.js

const createConnection = require('./models/myDB/DBconnection'); // Adjust the path as necessary

const testDatabaseConnection = async () => {
    try {
        const connection = await createConnection();
        // Optionally, you can run a simple query to verify the connection
        const [rows] = await connection.query('SELECT 1 + 1 AS solution');
        console.log('Database connection test successful:', rows[0].solution); 
        await connection.end(); // Close the connection
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

testDatabaseConnection();