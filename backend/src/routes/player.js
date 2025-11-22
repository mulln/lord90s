import express from "express";
import db from "../db/database.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(req.user.id);
  res.json({ player });
});

export default router;

