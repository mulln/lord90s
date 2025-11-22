import { rng } from "../utils/rng.js";

export function calculatePlayerDamage(player) {
  return player.skill + rng.int(1, 5);
}

export function calculateNPCAttack(npc) {
  return npc.attack + rng.int(0, npc.variance);
}

export function resolveCombat(player, npc) {
  let log = [];
  let playerHp = player.hp;
  let npcHp = npc.hp;

  log.push(`A ${npc.name} confronts you!`);

  while (playerHp > 0 && npcHp > 0) {
    // Player turn
    const dmg = calculatePlayerDamage(player);
    npcHp -= dmg;
    log.push(`You hit the ${npc.name} for ${dmg}.`);

    if (npcHp <= 0) break;

    // NPC turn
    const ndmg = calculateNPCAttack(npc);
    playerHp -= ndmg;
    log.push(`The ${npc.name} hits you for ${ndmg}.`);
  }

  return {
    log,
    playerHp,
    npcHp,
    won: playerHp > 0
  };
}

