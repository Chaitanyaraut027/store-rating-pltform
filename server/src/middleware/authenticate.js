import { verifyToken } from "../utils/jwt.js";

// Check the JWT before allowing access.
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }

  // Extract and verifed the token.
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Attach the user details to the request.
  req.user = { id: decoded.id, role: decoded.role };

  next();
}
