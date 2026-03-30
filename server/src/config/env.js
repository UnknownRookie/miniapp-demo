const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '..', '..', '.env')
});

function requireEnv(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  appId: requireEnv('APP_ID'),
  appSecret: requireEnv('APP_SECRET'),
  jwtSecret: requireEnv('JWT_SECRET'),
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '7d',
  db: {
    host: requireEnv('DB_HOST', '127.0.0.1'),
    port: Number(process.env.DB_PORT || 3306),
    socketPath: process.env.DB_SOCKET || '',
    user: requireEnv('DB_USER', 'root'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_NAME')
  }
};
