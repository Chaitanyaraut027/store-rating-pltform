import "dotenv/config";

import app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Database connection sucessful");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.log(error)
    process.exit(1);
  }
}

startServer();