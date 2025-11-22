import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/player.js";
import actionsRoutes from "./routes/actions.js";
import combatRoutes from "./routes/combat.js";
import npcRoutes from "./routes/npc.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "../../frontend/public")));

app.use("/auth", authRoutes);
app.use("/player", playerRoutes);
app.use("/actions", actionsRoutes);
app.use("/combat", combatRoutes);
app.use("/npc", npcRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`lord90s backend running on port ${PORT}`);
});

