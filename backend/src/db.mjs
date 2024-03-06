// Import dependencies
import mariadb from 'mariadb';
import config from '../db-config.json' assert { type: 'json' };

// Connect to the MariaDB database
const pool = mariadb.createPool(config.database);

export default pool;