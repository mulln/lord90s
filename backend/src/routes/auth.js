import express from "express";
import bcrypt from "bcrypt";
import db from "../db/database.js";
import { signToken } from "../utils/auth.js";
import { professions } from "../engine/professions.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password, profession } = req.body;

  if (!professions[profession]) {
    return res.status(400).json({ error: "Invalid profession." });
  }

  const hash = bcrypt.hashSync(password, 10);

  const stmt = db.prepare(`
    INSERT INTO players (username, password_hash, profession, charm, grit, skill, nerve)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const p = professions[profession].baseStats;

  try {
    stmt.run(username, hash, profession, p.charm, p.grit, p.skill, p.nerve);
  } catch (e) {
    return res.status(400).json({ error: "Username taken." });
  }

  const player = db.prepare("SELECT * FROM players WHERE username = ?").get(username);

  res.json({ token: signToken(player), player });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const player = db.prepare("SELECT * FROM players WHERE username = ?").get(username);
  if (!player) return res.status(404).json({ error: "User not found." });

  if (!bcrypt.compareSync(password, player.password_hash)) {
    return res.status(401).json({ error: "Invalid password." });
  }

  res.json({ token: signToken(player), player });
});

export default router;
