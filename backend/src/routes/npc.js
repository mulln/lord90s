import express from "express";
import db from "../db/database.js";
import { authMiddleware } from "../utils/auth.js";
import { getEncounter } from "../engine/encounterEngine.js";
import { applyRomanceOutcome } from "../engine/romanceEngine.js";

const router = express.Router();

router.get("/encounter", authMiddleware, async (req, res) => {
  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(req.user.id);
  const encounter = await getEncounter(player);
  res.json(encounter);
});

router.post("/choose", authMiddleware, (req, res) => {
  const { tag } = req.body;

  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(req.user.id);
  const outcome = applyRomanceOutcome(player, tag, db);

  db.prepare(`
    UPDATE players
    SET charm = charm + ?, nerve = nerve + ?
    WHERE id = ?
  `).run(outcome.effects.charm || 0, outcome.effects.nerve || 0, player.id);

  res.json(outcome);
});

export default router;
