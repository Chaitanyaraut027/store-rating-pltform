
import {
  createStoreSchema,
  STORE_FILTER_FIELDS,
  STORE_SORT_FIELDS,
  SORT_DIRECTIONS,
} from "../validators/store.validator.js";

import { createStore, listStores } from "../models/store.model.js";
import pool from "../config/database.js";

const DEFAULT_SORT_FIELD = "created_at";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Create a store.
export async function adminCreateStore(req, res, next) {
  try {
    const parsed = createStoreSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, address, owner_id } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    // Check whether the assigned owner exists and has the correct role.
    if (owner_id !== undefined) {
      const ownerCheck = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND role = 'STORE_OWNER'",
        [owner_id]
      );

      if (ownerCheck.rows.length === 0) {
        return res.status(422).json({
          success: false,
          message: "owner_id does not refer to a valid Store Owner account",
        });
      }
    }

    const store = await createStore({ name, email, address, owner_id });

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: { store },
    });
  } catch (error) {
    next(error);
  }
}

// Get stores with filtering, sorting, and pagination.
export async function adminListStores(req, res, next) {
  try {
    const sortField = req.query.sortBy ?? req.query.sort_by ?? DEFAULT_SORT_FIELD;
    const sortDir = (req.query.sortOrder ?? req.query.sort_dir ?? DEFAULT_SORT_DIR).toLowerCase();

    // Validate sorting options.
    if (!STORE_SORT_FIELDS.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort_by value. Allowed: ${STORE_SORT_FIELDS.join(", ")}`,
      });
    }

    if (!SORT_DIRECTIONS.includes(sortDir)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort_dir value. Use 'asc' or 'desc'",
      });
    }

    // Validate pagination.
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

    // Keep only supported filter fields.
    const filters = {};

    for (const field of STORE_FILTER_FIELDS) {
      const value = req.query[field];

      if (typeof value === "string" && value.trim().length > 0) {
        filters[field] = value.trim();
      }
    }

    const { stores, total } = await listStores({
      filters,
      sortField,
      sortDir,
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: {
        stores,
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
