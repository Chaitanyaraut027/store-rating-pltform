import {
  createUser,
  findUserDetailsById,
  findUserByEmail,
  listUsers as listUsersModel,
} from "../models/user.model.js";

import {
  getDashboardStats,
  getStoreOwners,
} from "../models/admin.model.js";

import bcrypt from "bcrypt";

import {
  adminCreateUserSchema,
  USER_FILTER_FIELDS,
  USER_SORT_FIELDS,
  SORT_DIRECTIONS,
} from "../validators/admin.validator.js";

import { registerSchema } from "../validators/auth.validator.js";

const DEFAULT_SORT_FIELD = "created_at";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const BCRYPT_ROUNDS = 12;

// Get dashboard statistics.
export async function getDashboard(req, res, next) {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

// List users with filters and pagination.
export async function listUsers(req, res, next) {
  try {
    const sortField = req.query.sort_by ?? DEFAULT_SORT_FIELD;
    const sortDir = (
      req.query.sort_dir ?? DEFAULT_SORT_DIR
    ).toLowerCase();

    if (!USER_SORT_FIELDS.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort_by value. Allowed: ${USER_SORT_FIELDS.join(", ")}`,
      });
    }

    if (!SORT_DIRECTIONS.includes(sortDir)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort_dir value. Use 'asc' or 'desc'",
      });
    }

    const rawPage = req.query.page ?? String(DEFAULT_PAGE);
    const rawLimit = req.query.limit ?? String(DEFAULT_LIMIT);

    const page = parseInt(rawPage, 10);
    const limit = parseInt(rawLimit, 10);

    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer",
      });
    }

    if (isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
      return res.status(400).json({
        success: false,
        message: `limit must be between 1 and ${MAX_LIMIT}`,
      });
    }

    const offset = (page - 1) * limit;
    const filters = {};

    // Apply supported filters.
    for (const field of USER_FILTER_FIELDS) {
      const value = req.query[field];

      if (typeof value === "string" && value.trim()) {
        filters[field] = value.trim();
      }
    }

    const { users, total } = await listUsersModel({
      filters,
      sortField,
      sortDir,
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get a user by ID.
export async function getUser(req, res, next) {
  try {
    const user = await findUserDetailsById(req.params.id);

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

// List store owners and their ratings.
export async function listStoreOwners(req, res, next) {
  try {
    const storeOwners = await getStoreOwners();

    return res.status(200).json({
      success: true,
      data: { store_owners: storeOwners },
    });
  } catch (error) {
    next(error);
  }
}

// Create a user or admin account.
export async function adminCreateUser(req, res, next) {
  try {
    const parsed = adminCreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, address, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();
    const role = parsed.data.role || "USER";

    const existing = await findUserByEmail(email);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await createUser({
      name,
      email,
      address,
      passwordHash,
      role,
    });

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

    const existing = await findUserByEmail(email);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await createUser({
      name,
      email,
      address,
      passwordHash,
      role: "STORE_OWNER",
    });

    return res.status(201).json({
      success: true,
      message: "Store owner account created successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
