import express from "express";
import Vote from "../models/voteModel";

const router = express.Router();

router.post("/vote", async (req, res) => {
  try {
    const u = (req as any).user; // מגיע מ-auth middleware
    if (!u?._id) return res.status(401).json({ error: "Unauthorized" });

    const { type, itemId, value } = req.body || {};
    if (!type || !itemId || ![1, -1].includes(value)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const updated = await Vote.findOneAndUpdate(
      { userId: u._id, type, itemId },
      { $set: { value } },
      { upsert: true, new: true }
    );

    return res.json({ ok: true, vote: updated });
  } catch (err) {
    console.error("vote error:", err);
    return res.status(500).json({ error: "Failed to save vote" });
  }
});

export default router;
