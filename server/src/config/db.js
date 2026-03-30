const mysql = require('mysql2/promise');
const env = require('./env');

const connectionOptions = env.db.socketPath
  ? {
      socketPath: env.db.socketPath
    }
  : {
      host: env.db.host,
      port: env.db.port
    };

const pool = mysql.createPool({
  ...connectionOptions,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

module.exports = pool;
