import { z } from "zod";

// Validate a rating submission
export const ratingSchema = z.object({
  store_id: z
    .number({ invalid_type_error: "store_id must be a number" })
    .int("store_id must be an integer")
    .positive("store_id must be a positive integer"),

  rating: z
    .number({ invalid_type_error: "rating must be a number" })
    .int("rating must be an integer")
    .min(1, "rating must be at least 1")
    .max(5, "rating must be at most 5"),
});
