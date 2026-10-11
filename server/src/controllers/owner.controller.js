import { getStoresByOwner, getRatingsByOwner } from "../models/owner.model.js";

// Returns all stores this owner owns along with their average rating and total ratings.
export async function getOwnerDashboard(req, res, next) {
  try {
    const stores = await getStoresByOwner(req.user.id);

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No store found for this owner",
      });
    }

    return res.status(200).json({
      success: true,
      data: { stores },
    });
  } catch (error) {
    next(error);
  }
}

// Returns all user ratings submitted for any store this owner owns.
export async function getOwnerRatings(req, res, next) {
  try {
    const ratings = await getRatingsByOwner(req.user.id);

    return res.status(200).json({
      success: true,
      data: { ratings },
    });
  } catch (error) {
    next(error);
  }
}
