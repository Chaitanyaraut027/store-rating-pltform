import pool from "../config/database.js";

// Find a user by email, including the password hash.
export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, address, role, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
}

// Find a user by ID without the password hash.
export async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, name, email, address, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

// Create a user with a specific role (defaults to USER).
export async function createUser({ name, email, address, passwordHash, role = 'USER' }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, address, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, address, passwordHash, role]
  );

  return result.rows[0];
}

// Find a user by ID, including the password hash.
export async function findUserWithHashById(id) {
  const result = await pool.query(
    `SELECT id, name, email, address, role, password_hash
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

// Update a user's password hash.
export async function updatePasswordHash(userId, newPasswordHash) {
  await pool.query(
    `UPDATE users
     SET password_hash = $1, updated_at = NOW()
     WHERE id = $2`,
    [newPasswordHash, userId]
  );
}

// Find a user's details including their store's average rating if they are a STORE_OWNER.
export async function findUserDetailsById(id) {
  const result = await pool.query(
    `SELECT
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
     WHERE u.id = $1
     GROUP BY u.id, s.id`,
    [id]
  );

  return result.rows[0] || null;
}

// Get users with filtering, sorting, and pagination.
export async function listUsers({
  filters,
  sortField,
  sortDir,
  limit,
  offset,
}) {
  const conditions = [];
  const params = [];

  // Add filters using parameterized values.
  if (filters.name) {
    params.push(`%${filters.name}%`);
    conditions.push(`name ILIKE $${params.length}`);
  }

  if (filters.email) {
    params.push(`%${filters.email}%`);
    conditions.push(`email ILIKE $${params.length}`);
  }

  if (filters.address) {
    params.push(`%${filters.address}%`);
    conditions.push(`address ILIKE $${params.length}`);
  }

  if (filters.role) {
    params.push(filters.role);
    conditions.push(`role = $${params.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Make a copy of params for the count query
  const countParams = [...params];

  // Sorting fields and directions must be validated before use.
  const orderClause = `ORDER BY ${sortField} ${sortDir.toUpperCase()}`;

  params.push(limit);
  const limitParam = `$${params.length}`;

  params.push(offset);
  const offsetParam = `$${params.length}`;

  const dataResult = await pool.query(
    `SELECT id, name, email, address, role, created_at
     FROM users
     ${whereClause}
     ${orderClause}
     LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  );

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM users
     ${whereClause}`,
    countParams
  );

  return {
    users: dataResult.rows,
    total: countResult.rows[0].total,
  };
}
