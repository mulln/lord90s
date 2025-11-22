export function charmCheck(player, difficulty) {
  return player.charm + Math.random() * 3 >= difficulty;
}

export function nerveCheck(player, difficulty) {
  return player.nerve + Math.random() * 3 >= difficulty;
}

export function spiceEligibility(player) {
  return player.charm + player.nerve >= 12;
}

