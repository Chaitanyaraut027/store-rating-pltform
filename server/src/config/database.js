import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: { rejectUnauthorized: false },

  // Limit the number of database connections.
  max: 5,

  // Wait up to 10 seconds for a new connection.
  connectionTimeoutMillis: 10000,

  // Remove unused connections from the pool after 10 seconds.
  idleTimeoutMillis: 10000,

  // Enable TCP keepalive support.
  keepAlive: true,
});

// Log unexpected errors from idle connections.
pool.on("error", (error) => {
  console.error("Unexpected database pool error:", error.message);
});

export default pool;
