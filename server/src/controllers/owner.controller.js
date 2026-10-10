
import pool from "../config/database.js";

// Get the owner's store details and rating summary.
export async function getOwnerDashboard(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         s.created_at,
         ROUND(AVG(r.rating), 2)::float AS average_rating,
         COUNT(r.id)::int AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = $1
       GROUP BY s.id`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No store found for this owner",
      });
    }

    return res.status(200).json({
      success: true,
      data: { store: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
}

// Get the ratings for the owner's store.
export async function getOwnerRatings(req, res, next) {
  try {
    const storeResult = await pool.query(
      "SELECT id FROM stores WHERE owner_id = $1",
      [req.user.id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No store found for this owner",
      });
    }

    const storeId = storeResult.rows[0].id;

    const result = await pool.query(
      `SELECT
         u.id AS user_id,
         u.name AS user_name,
         u.email AS user_email,
         r.rating,
         r.created_at AS rated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    return res.status(200).json({
      success: true,
      data: { ratings: result.rows },
    });
  } catch (error) {
    next(error);
  }
}
