// api/index.js
import "../_config/env.js";
import { connectDB } from "../_config/db.js";
import { createServer } from "../server.js";

// For Vercel serverless functions, we need to export the handler
let app;

async function getApp() {
  if (!app) {
    try {
      // Connect to database
      await connectDB();

      // Create Express server
      app = await createServer();
    } catch (error) {
      console.error("[vercel] Database connection failed:", error);
      throw error;
    }
  }
  return app;
}

export default async function handler(req, res) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.error("[vercel] Handler error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
