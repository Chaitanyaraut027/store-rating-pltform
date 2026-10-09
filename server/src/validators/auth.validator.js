import { z } from "zod";

// Password validation rules
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one special character"
  );

// Validate registration data
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must be at most 60 characters"),

  email: z.string().trim().email("Invalid email address"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(400, "Address must be at most 400 characters"),

  password: passwordSchema,
});

// Validate login data
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Validate password change data
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});
