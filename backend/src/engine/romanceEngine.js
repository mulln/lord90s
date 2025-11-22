import { spiceEligibility } from "./statChecks.js";
import config from "../config.js";

export function determineSpiceTier(player) {
  if (!spiceEligibility(player)) return 1;
  return Math.min(config.spiceTier, 3);
}

export function applyRomanceOutcome(player, choiceTag) {
  let result = { msg: "", effects: {} };

  switch (choiceTag) {
    case "[flirt]":
      result.msg = "Your charm helps you make a connection.";
      result.effects.charm = +1;
      break;

    case "[advance]":
      result.msg = "You take a bold step…";
      result.effects.nerve = +1;
      break;

    case "[retreat]":
      result.msg = "You step back safely.";
      break;
  }

  return result;
}

