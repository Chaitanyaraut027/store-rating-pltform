import { z } from "zod";

// Validate store creation data.
export const createStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, "Store name must be at least 20 characters")
    .max(60, "Store name must be at most 60 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid store email address"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(400, "Address must be at most 400 characters"),

  // A store can be created before an owner is assigned.
  owner_id: z
    .number({ invalid_type_error: "owner_id must be a number" })
    .int("owner_id must be an integer")
    .positive("owner_id must be a positive integer")
    .optional(),
});

// Fields allowed for filtering stores.
export const STORE_FILTER_FIELDS = [
  "name",
  "email",
  "address",
];

// Fields allowed for sorting stores.
export const STORE_SORT_FIELDS = [
  "name",
  "email",
  "address",
  "created_at",
  "average_rating",
];

// Allowed sorting directions.
export const SORT_DIRECTIONS = ["asc", "desc"];
