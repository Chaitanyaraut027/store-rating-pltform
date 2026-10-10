
import { ratingSchema } from "../validators/rating.validator.js";
import {
  upsertRating,
  findRatingsByUserId,
} from "../models/rating.model.js";
import { findStoreById } from "../models/store.model.js";

// Submit or update a store rating.
export async function submitRating(req, res, next) {
  try {
    const parsed = ratingSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { store_id, rating } = parsed.data;

    // Check whether the store exists.
    const store = await findStoreById(store_id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Get the user ID from the verified token.
    const result = await upsertRating({
      userId: req.user.id,
      storeId: store_id,
      rating,
    });

    // Check whether the rating was created or updated.
    const isNew =
      result.created_at.getTime() === result.updated_at.getTime();

    return res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew
        ? "Rating submitted successfully"
        : "Rating updated successfully",
      data: { rating: result },
    });
  } catch (error) {
    next(error);
  }
}

// Get all ratings submitted by the current user.
export async function getMyRatings(req, res, next) {
  try {
    const ratings = await findRatingsByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      data: { ratings },
    });
  } catch (error) {
    next(error);
  }
}
