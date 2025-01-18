const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
};
const schemaName = process.env.SCHEMA_NAME;

async function resetDatabase() {
  try {
    console.log('Attempting connection to database...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    await connection.changeUser({ database: schemaName });

    console.log('Dropping tables if they exist...');
    const tables = [
      'leetcode_solutions',
      'leetcode_languages',
      'leetcode_submissions',
      'leetcode_profiles',
      'github_commits',
      'github_repos',
      'github_profiles',
      'sessions',
      'posts',
      'users',
      'user_activities',
      'other_activities',
      'intervals',
      'intervalActivity',
    ];


    for (const table of tables) {
      try {
        console.log(`Dropping table: ${table}`);
        await connection.query(`DROP TABLE IF EXISTS \`${table}\`;`);
        console.log(`Table '${table}' dropped successfully.`);
      } catch (err) {
        console.error(`Error dropping table '${table}':`, err.message);
      }
    }

    console.log('tables deleted, reset successful');

    await connection.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error resetting database:', error.message);
  }
}

resetDatabase();
