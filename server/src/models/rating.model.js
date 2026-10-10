
import pool from "../config/database.js";

// Create a rating or update the existing one.
export async function upsertRating({ userId, storeId, rating }) {
  const result = await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET
       rating = EXCLUDED.rating,
       updated_at = NOW()
     RETURNING id, user_id, store_id, rating, created_at, updated_at`,
    [userId, storeId, rating]
  );

  return result.rows[0];
}

// Get all ratings submitted by a user.
export async function findRatingsByUserId(userId) {
  const result = await pool.query(
    `SELECT
       r.id,
       r.rating,
       r.created_at,
       r.updated_at,
       s.id AS store_id,
       s.name AS store_name,
       s.email AS store_email
     FROM ratings r
     JOIN stores s ON s.id = r.store_id
     WHERE r.user_id = $1
     ORDER BY r.updated_at DESC`,
    [userId]
  );

  return result.rows;
}
