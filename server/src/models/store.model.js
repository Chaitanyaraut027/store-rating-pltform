
import pool from "../config/database.js";

// Create a store and return its details.
export async function createStore({ name, email, address, owner_id }) {
  const result = await pool.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id, created_at`,
    [name, email, address, owner_id ?? null]
  );

  return result.rows[0];
}

// Find a store by ID and calculate its average rating.
export async function findStoreById(id) {
  const result = await pool.query(
    `SELECT
       s.id,
       s.name,
       s.email,
       s.address,
       s.owner_id,
       s.created_at,
       COALESCE(ROUND(AVG(r.rating), 2)::float, 0) AS average_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  );

  return result.rows[0] || null;
}

// Get stores with filtering, sorting, and pagination.
export async function listStores({
  filters,
  sortField,
  sortDir,
  limit,
  offset,
  userId,
}) {
  const conditions = [];
  const params = [];

  // Add filters using parameterized values.
  if (filters.name) {
    params.push(`%${filters.name}%`);
    conditions.push(`s.name ILIKE $${params.length}`);
  }

  if (filters.email) {
    params.push(`%${filters.email}%`);
    conditions.push(`s.email ILIKE $${params.length}`);
  }

  if (filters.address) {
    params.push(`%${filters.address}%`);
    conditions.push(`s.address ILIKE $${params.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Make a copy of params for the count query before we add limit/offset/userId
  const countParams = [...params];

  let myRatingSelect = "";
  let myRatingJoin = "";
  if (userId) {
    params.push(userId);
    myRatingSelect = `, MAX(ur.rating)::int AS my_rating`;
    myRatingJoin = `LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $${params.length}`;
  }

  // Sorting fields and directions must be validated before use.
  const orderClause = `ORDER BY ${sortField} ${sortDir.toUpperCase()}`;

  params.push(limit);
  const limitParam = `$${params.length}`;

  params.push(offset);
  const offsetParam = `$${params.length}`;

  const dataResult = await pool.query(
    `SELECT
       s.id,
       s.name,
       s.email,
       s.address,
       s.owner_id,
       s.created_at,
       COALESCE(ROUND(AVG(r.rating), 2)::float, 0) AS average_rating
       ${myRatingSelect}
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${myRatingJoin}
     ${whereClause}
     GROUP BY s.id
     ${orderClause}
     LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  );

  // Count matching stores for pagination.
  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT s.id)::int AS total
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${whereClause}`,
    countParams
  );

  return {
    stores: dataResult.rows,
    total: countResult.rows[0].total,
  };
}
