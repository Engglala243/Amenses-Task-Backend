import "./_config/env.js";
import { connectDB } from "./_config/db.js";
import { createServer } from "./server.js";

async function main() {
  try {
    // Connect to database
    await connectDB();

    // Create Express server
    const app = await createServer();

    // Set trust proxy for Railway's reverse proxy
    app.set("trust proxy", 1);

    // Add a basic health check route if not already present
    app.get("/", (req, res) => {
      res.json({
        message: "Polling Backend API is running!",
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      });
    });

    // Use Railway's dynamic PORT or fallback to 5000
    const port = process.env.PORT || 5000;

    // Listen on 0.0.0.0 for Railway deployment (not localhost)
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
      if (process.env.NODE_ENV === "production") {
        console.log(
          `🌐 Railway URL: https://amenses-task-backend-production.up.railway.app`
        );
      } else {
        console.log(`🏠 Local URL: http://localhost:${port}`);
      }
    });
  } catch (error) {
    console.error("[server] Database connection failed:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
