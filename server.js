import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import {
  notFoundHandler,
  errorHandler,
} from "./_middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createServer() {
  const app = express();

  // CRITICAL: Set trust proxy for Railway deployment
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") || "*",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(process.env.LOG_LEVEL || "dev"));

  // Rate limiter with trust proxy support
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    trustProxy: true, // Add this for Railway compatibility
  });
  app.use(limiter);

  app.use("/public", express.static(path.join(__dirname, "public")));

  // Add root route for Railway health check
  app.get("/", (_req, res) => {
    res.json({
      message: "Polling Backend API is running!",
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.use("/api", routes);
  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
