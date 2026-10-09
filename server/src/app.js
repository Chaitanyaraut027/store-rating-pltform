
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";

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

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Handle unexpected errors in one place.
app.use((err, req, res, next) => {
  console.error("Request failed:", {
    method: req.method,
    path: req.path,
    message: err.message,
    code: err.code,
  });

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});
export default app;