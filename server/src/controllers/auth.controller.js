import bcrypt from "bcrypt";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../validators/auth.validator.js";

import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserWithHashById,
  updatePasswordHash,
} from "../models/user.model.js";

import { signToken } from "../utils/jwt.js";

const BCRYPT_ROUNDS = 12;

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    // Validate the registration data.
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

    // Check if the email is already registered.
    const existing = await findUserByEmail(email);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash the password before saving it.
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await createUser({
      name,
      email,
      address,
      passwordHash,
    });

    // Generate a token for the new user.
    const token = signToken({
      id: user.id,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
// Generate a valid dummy hash once when the module loads.
const dummyHash = await bcrypt.hash(
  "dummy-password-never-used",
  12
);

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    // Validate the login data.
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const email = parsed.data.email.toLowerCase();
    const { password } = parsed.data;

    const user = await findUserByEmail(email);

    // Use the real hash if the user exists; otherwise, use the dummy hash.
    const hashToCompare = user ? user.password_hash : dummyHash;

    const passwordMatch = await bcrypt.compare(
      password,
      hashToCompare
    );

    if (!user || !passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate a token after successful login.
    const token = signToken({
      id: user.id,
      role: user.role,
    });

    // Remove the password hash before sending the user data.
    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user: safeUser, token },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getMe(req, res, next) {
  try {
    // Get the logged-in user's details.
    const user = await findUserById(req.user.id);

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

// PATCH /api/auth/change-password
export async function changePassword(req, res, next) {
  try {
    // Validate the password change request.
    const parsed = changePasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { currentPassword, newPassword } = parsed.data;

    // Get the user's current password hash.
    const user = await findUserWithHashById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check the current password.
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    // Hash and save the new password.
    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await updatePasswordHash(req.user.id, newHash);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
}
