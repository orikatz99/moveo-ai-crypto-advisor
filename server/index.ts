// index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import newsRoutes from "./routes/newsRoutes";
import aiRoutes from "./routes/aiRoutes";
import memeRoutes from "./routes/memeRoutes";
import voteRoutes from "./routes/voteRoutes";
import { requireAuth } from "./middleware/requireAuth";

const app = express();

/** Let Render / proxies pass client IP & protocol */
app.set("trust proxy", 1);

/** Basic middlewares */
app.use(cookieParser());
app.use(express.json());

/** Build CORS whitelist from env (comma-separated) */
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

/** Strong CORS config + preflight support */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / tools with no Origin (Postman, curl)
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin)
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight globally

/** Public health check — must be BEFORE any protected routes */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "Server is up" });
});

/** Connect to MongoDB */
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

/** Public / general API routes */
app.use("/api", authRoutes);
app.use("/api", newsRoutes);
app.use("/api", aiRoutes);
app.use("/api", memeRoutes);

/** Protected routes (require auth) */
app.use("/api", requireAuth, voteRoutes);

/** Start server */
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
