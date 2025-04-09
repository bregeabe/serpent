const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  };
const schemaName = process.env.SCHEMA_NAME;

export async function create_connection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.changeUser({ database: schemaName });
        return connection
    } catch (err) {
        console.error('couldnt connect to database:', err.message)
        throw err;
    }
}

export async function get_pool_connection() {
    if (!pool) {
      pool = mysql.createPool({
        ...dbConfig,
        database: schemaName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    try {
      return await pool.getConnection();
    } catch (err) {
      console.error("couldn't get pooled connection:", err.message);
      throw err;
    }
  }