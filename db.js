const { Pool } = require('pg')

const pool = new Pool({
    host: 'database',  // This is correct for container-to-container communication
    port: 5432,        // Keep as 5432 for internal communication
    user: 'postgres',
    password: 'postgres',
    database: 'newdb'
})

// Add error handling and connection retry
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Add connection testing
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
};

testConnection();

module.exports = pool;