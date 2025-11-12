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

// Allow working behind proxy (important for Render HTTPS)
app.set("trust proxy", 1);

// Middleware
app.use(cookieParser());
app.use(express.json());

// Configure allowed origins for CORS
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

// Enhanced CORS setup (works for both localhost & Vercel)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman & similar tools
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Allow preflight (OPTIONS) requests globally
app.options("*", cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API routes
app.use("/api", authRoutes);
app.use("/api", newsRoutes);
app.use("/api", aiRoutes);
app.use("/api", memeRoutes);
app.use("/api", requireAuth, voteRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "Server is up" });
});

// Start the server
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
