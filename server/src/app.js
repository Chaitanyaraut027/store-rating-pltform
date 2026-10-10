import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import ratingRoutes from "./routes/rating.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Store Rating API is running",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Admin-only routes
app.use("/api/admin", adminRoutes);

// Store owner routes
app.use("/api/owner", ownerRoutes);

// User rating routes
app.use("/api/ratings", ratingRoutes);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Handle unexpected errors in one place.
app.use((err, req, res, next) => {
  console.error("\n--- Request Error ---");
  console.error("Method:", req.method);
  console.error("Path:", req.originalUrl);
  console.error("Message:", err.message);
  console.error("Code:", err.code || "N/A");

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});
export default app;