import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

// signup
router.post("/signup", registerUser);

// login
router.post("/login", loginUser);

// get current user
router.get("/me", requireAuth, (req, res) => {
  const u = (req as any).user;
  res.json({ id: u._id, name: u.name, email: u.email, createdAt: u.createdAt });
});


export default router;
