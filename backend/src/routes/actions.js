import express from "express";
import db from "../db/database.js";
import { authMiddleware } from "../utils/auth.js";
import { rng } from "../utils/rng.js";

const router = express.Router();

router.post("/explore", authMiddleware, (req, res) => {
  let player = db.prepare("SELECT * FROM players WHERE id = ?").get(req.user.id);

  if (player.ap <= 0)
    return res.json({ msg: "You are out of AP for today." });

  const cashFound = rng.int(1, 6);
  const newAP = player.ap - 1;

  db.prepare("UPDATE players SET cash = cash + ?, ap = ? WHERE id = ?")
    .run(cashFound, newAP, player.id);

  res.json({
    msg: `You explore the area and find $${cashFound}.`,
    ap: newAP
  });
});

export default router;
