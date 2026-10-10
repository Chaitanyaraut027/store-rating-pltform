import { z } from "zod";
import { registerSchema } from "./auth.validator.js";

// Validation schema for an administrator creating a user
export const adminCreateUserSchema = registerSchema.extend({
  role: z.enum(["USER", "ADMIN", "STORE_OWNER"]),
});

// Fields allowed for filtering users
export const USER_FILTER_FIELDS = ["name", "email", "address", "role"];

// Fields allowed for sorting users
export const USER_SORT_FIELDS = ["name", "email", "address", "role", "created_at"];

// Allowed sorting directions
export const SORT_DIRECTIONS = ["asc", "desc"];
