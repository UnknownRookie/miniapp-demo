const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mysql = require('mysql2/promise');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'src', 'db', 'schema.sql'), 'utf8');
  const baseConnectionOptions = process.env.DB_SOCKET
    ? {
        socketPath: process.env.DB_SOCKET
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT)
      };

  const adminConnection = await mysql.createConnection({
    ...baseConnectionOptions,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  try {
    await adminConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await adminConnection.end();
  }

  const connection = await mysql.createConnection({
    ...baseConnectionOptions,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    await connection.query(sql);
    console.log('Database initialized successfully.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Failed to initialize database.');
  console.error(error);
  process.exit(1);
});
