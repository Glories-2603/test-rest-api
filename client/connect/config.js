const mysql = require('mysql');


// Conf connections
const config = {
    host: 'localhost',
    user: 'root',
    password: 'test123',
    database: 'ragesql',
};
// MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;