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

app.set("trust proxy", 1);
app.use(cookieParser());

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api", authRoutes);
app.use("/api", newsRoutes);
app.use("/api", aiRoutes);
app.use("/api", memeRoutes);
app.use("/api", requireAuth, voteRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "Server is up" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
