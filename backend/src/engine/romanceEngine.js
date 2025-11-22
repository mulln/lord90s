import config from "../config.js";

export function determineSpiceTier(player) {
  const base = player.charm + player.nerve;
  if (base < 10) return 1;
  if (base < 15) return Math.min(config.spiceTier, 2);
  return Math.min(config.spiceTier, 3);
}

export function getAffinity(player) {
  try {
    const flags = JSON.parse(player.romance_flags ?? "{}");
    return flags.affinity ?? 0;
  } catch {
    return 0;
  }
}

export function adjustAffinity(player, delta, db) {
  let flags = {};

  try {
    flags = JSON.parse(player.romance_flags ?? "{}");
  } catch {
    flags = {};
  }

  flags.affinity = (flags.affinity ?? 0) + delta;
  if (flags.affinity < 0) flags.affinity = 0;
  if (flags.affinity > 10) flags.affinity = 10;

  db.prepare("UPDATE players SET romance_flags = ? WHERE id = ?")
    .run(JSON.stringify(flags), player.id);
}

export function applyRomanceOutcome(player, choiceTag, db) {
  let result = { msg: "", effects: {}, affinityDelta: 0 };

  switch (choiceTag) {
    case "[flirt]":
      result.msg = "You flash a smile and test the waters.";
      result.affinityDelta = +1;
      break;

    case "[advance]":
      result.msg = "You step in closer — bold move.";
      result.affinityDelta = +2;
      result.effects.nerve = +1;
      break;

    case "[retreat]":
      result.msg = "You pull back and play it cool.";
      result.affinityDelta = -1;
      break;

    case "[risk]":
      result.msg = "You take a daring chance...";
      result.affinityDelta = rng.int(-1, 2);
      break;
  }

  adjustAffinity(player, result.affinityDelta, db);

  return result;
}
