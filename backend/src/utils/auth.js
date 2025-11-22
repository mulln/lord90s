import jwt from "jsonwebtoken";
import config from "../config.js";

export function signToken(player) {
  return jwt.sign(
    { id: player.id, username: player.username },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No auth token." });

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token." });
  }
}

