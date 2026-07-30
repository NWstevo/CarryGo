const { Pool } = require('pg');

// Render (and most managed Postgres providers) expose a single DATABASE_URL and require
// SSL for external connections. Local dev keeps using the discrete DB_* vars unchanged.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

module.exports = pool;
