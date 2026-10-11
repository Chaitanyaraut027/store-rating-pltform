
import {
  STORE_FILTER_FIELDS,
  STORE_SORT_FIELDS,
  SORT_DIRECTIONS,
} from "../validators/store.validator.js";
import { listStores } from "../models/store.model.js";

const DEFAULT_SORT_FIELD = "created_at";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Browse stores with filters, sorting, and pagination.
export async function browseStores(req, res, next) {
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

    // Include the current user's rating in the results.
    const { stores, total } = await listStores({
      filters,
      sortField,
      sortDir,
      limit,
      offset,
      userId: req.user.id,
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
