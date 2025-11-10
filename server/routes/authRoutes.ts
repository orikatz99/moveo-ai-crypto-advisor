import express from "express";
import { registerUser, loginUser, savePreferences } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

// signup
router.post("/signup", registerUser);

// login
router.post("/login", loginUser);

// preferences 
router.put("/preferences", requireAuth, savePreferences);

// get current user
  router.get("/me", requireAuth, (req, res) => {
  const u = (req as any).user;
  res.json({
    id: u._id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
    preferences: u.preferences || {},
  });

  // logout
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});

});




export default router;
