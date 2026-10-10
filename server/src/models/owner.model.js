import pool from "../config/database.js";

// Get all stores owned by this owner along with their average rating and total ratings count.
export async function getStoresByOwner(ownerId) {
  const result = await pool.query(
    `SELECT
       s.id,
       s.name,
       s.email,
       s.address,
       s.created_at,
       COALESCE(ROUND(AVG(r.rating), 2)::float, 0) AS average_rating,
       COUNT(r.id)::int AS total_ratings
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id
     ORDER BY s.created_at DESC`,
    [ownerId]
  );
  return result.rows;
}

// Get all user ratings for every store owned by this owner.
// Returns user name, email, the store they rated, their rating value, and when they rated.
export async function getRatingsByOwner(ownerId) {
  const result = await pool.query(
    `SELECT
       r.id AS rating_id,
       s.id AS store_id,
       s.name AS store_name,
       u.id AS user_id,
       u.name AS user_name,
       u.email AS user_email,
       r.rating,
       r.created_at AS rated_at,
       r.updated_at
     FROM ratings r
     JOIN stores s ON s.id = r.store_id
     JOIN users u ON u.id = r.user_id
     WHERE s.owner_id = $1
     ORDER BY r.created_at DESC`,
    [ownerId]
  );
  return result.rows;
}
