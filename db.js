const { Pool } = require('pg')

const pool = new Pool({
    host: 'database',  // if app runs locally then write "localhost" and if in docker use "database"
    port: 5432,        // 5432 for internal communication
    user: 'postgres',
    password: 'postgres',
    database: 'newdb'
})


pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});


const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        await pool.query('CREATE TABLE notes(id SERIAL PRIMARY KEY, title VARCHAR(200), content VARCHAR(1000), createdAt VARCHAR(30), updatedAt VARCHAR(30))')
        console.log('notes table created successfully');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
};

testConnection();

module.exports = pool;