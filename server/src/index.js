const app = require('./app');
const env = require('./config/env');
const pool = require('./config/db');

async function bootstrap() {
  await pool.query('SELECT 1');

  app.listen(env.port, () => {
    console.log(`Server listening on http://127.0.0.1:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server.');
  console.error(error);
  process.exit(1);
});
