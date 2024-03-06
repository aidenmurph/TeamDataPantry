// Import dependencies
import mariadb from 'mariadb';
import 'dotenv/config';

// Connect to the MariaDB database
const pool = mariadb.createPool(config.database);

export default pool;