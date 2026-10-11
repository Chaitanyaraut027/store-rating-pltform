import pool from "../config/database.js";

// Fetch platform statistics for the dashboard
export async function getDashboardStats() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users)::int AS total_users,
      (SELECT COUNT(*) FROM stores)::int AS total_stores,
      (SELECT COUNT(*) FROM ratings)::int AS total_ratings
  `);
  return result.rows[0];
}

// Fetch all store owners and their store ratings
export async function getStoreOwners() {
  const result = await pool.query(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.address,
      u.role,
      u.created_at,
      s.id AS store_id,
      s.name AS store_name,
      COALESCE(ROUND(AVG(r.rating), 2)::float, 0) AS average_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE u.role = 'STORE_OWNER'
    GROUP BY u.id, s.id
    ORDER BY u.created_at DESC
  `);
  return result.rows;
}
