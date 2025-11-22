import config from "../config.js";
import builtinDay from "./encounters/builtin/day_encounters.json" assert { type: "json" };
import builtinNight from "./encounters/builtin/night_encounters.json" assert { type: "json" };
import { buildAIPrompt, getAIResponse } from "./encounters/ai/aiDriver.js";

export async function getEncounter(player) {
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour <= 4;

  if (!config.aiEnabled) {
    const pool = isNight ? builtinNight : builtinDay;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { type: "builtin", encounter: pick };
  }

  const prompt = buildAIPrompt(player, isNight);
  const ai = await getAIResponse(prompt);

  return { type: "ai", encounter: ai };
}

