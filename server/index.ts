import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";   

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "Server is up" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
