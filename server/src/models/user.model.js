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

// Create a user with the default USER role.
export async function createUser({ name, email, address, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, address, password_hash, role)
     VALUES ($1, $2, $3, $4, 'USER')
     RETURNING id, name, email, address, role, created_at`,
    [name, email, address, passwordHash]
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
