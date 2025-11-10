import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const header = req.header("Authorization");
    if (header?.startsWith("Bearer ")) {
      token = header.slice(7).trim();
    }

    if (!token && (req as any).cookies?.token) {
      token = (req as any).cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: "Missing auth token." });
    }

    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };

    const user = await User.findById(payload.sub).select("_id name email createdAt preferences");
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    (req as any).user = user;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
