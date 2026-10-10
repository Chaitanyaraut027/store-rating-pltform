
import { findUserById, createUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { registerSchema } from "../validators/auth.validator.js";
import pool from "../config/database.js";

const BCRYPT_ROUNDS = 12;

// Get platform statistics.
export async function getDashboard(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'USER')::int AS total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'STORE_OWNER')::int AS total_store_owners,
        (SELECT COUNT(*) FROM stores)::int AS total_stores,
        (SELECT COUNT(*) FROM ratings)::int AS total_ratings
    `);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

// List all normal users.
export async function listUsers(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT id, name, email, address, role, created_at
      FROM users
      WHERE role = 'USER'
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      data: { users: result.rows },
    });
  } catch (error) {
    next(error);
  }
}

// Get a user by ID.
export async function getUser(req, res, next) {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

// List store owners and their store ratings.
export async function listStoreOwners(req, res, next) {
  try {
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
        ROUND(AVG(r.rating), 2)::float AS average_rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE u.role = 'STORE_OWNER'
      GROUP BY u.id, s.id
      ORDER BY u.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      data: { store_owners: result.rows },
    });
  } catch (error) {
    next(error);
  }
}

// Create a normal user account.
export async function createNormalUser(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, address, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await createUser({ name, email, address, passwordHash });

    return res.status(201).json({
      success: true,
      message: "User account created successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

// Create a store owner account.
export async function createStoreOwner(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, address, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, email, address, password_hash, role)
       VALUES ($1, $2, $3, $4, 'STORE_OWNER')
       RETURNING id, name, email, address, role, created_at`,
      [name, email, address, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: "Store owner account created successfully",
      data: { user: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
}
