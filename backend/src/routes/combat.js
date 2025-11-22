import express from "express";
import db from "../db/database.js";
import { authMiddleware } from "../utils/auth.js";
import { resolveCombat } from "../engine/combatEngine.js";

const router = express.Router();

router.post("/npc", authMiddleware, (req, res) => {
  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(req.user.id);

  if (player.ap <= 1)
    return res.json({ error: "Not enough AP for combat." });

  const npc = {
    name: "Street Thug",
    hp: 12,
    attack: 3,
    variance: 2
  };

  const result = resolveCombat(player, npc);

  db.prepare("UPDATE players SET hp = ?, ap = ap - 2 WHERE id = ?")
    .run(result.playerHp, player.id);

  res.json(result);
});

export default router;

