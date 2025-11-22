import { determineSpiceTier } from "../../romanceEngine.js";

export function buildAIPrompt(player, isNight) {
  const spiceTier = determineSpiceTier(player);

  const context = isNight
    ? "a neon-drenched nightclub or dimly-lit alleyway in a major US city"
    : "a busy 90s daytime urban street, record store, arcade, or coffee shop";

  return `
Write a short text-based encounter for a retro BBS-style RPG set in the 1990s.

Tone: gritty, funny, slightly chaotic, seductive if appropriate.
Setting: ${context}
Player profession: ${player.profession}
Player stats: charm=${player.charm}, grit=${player.grit}, skill=${player.skill}, nerve=${player.nerve}
Allowed spice tier: ${spiceTier}
NPC affinity (0–10): ${extractAffinity(player)}

Spice tier rules:
- Tier 1: Flirting, light innuendo.
- Tier 2: Spicy tension, close physical proximity.
- Tier 3: 'fade-to-black' hookup potential, explicit suggestion but NOT pornographic.

Output STRICTLY as JSON:

{
  "npc": "<NPC name>",
  "text": "<80 words max describing encounter>",
  "choices": [
    { "label": "Choice text", "tag": "[flirt]" },
    { "label": "...", "tag": "[advance]" },
    { "label": "...", "tag": "[retreat]" }
  ]
}

Rules:
- No more than 3 choices.
- Tags MUST be one of: [flirt], [advance], [retreat], [risk], [reward].
- Do NOT resolve consequences.
- Dialog should match the allowed spice tier.
  `;
}

function extractAffinity(player) {
  try {
    const flags = JSON.parse(player.romance_flags ?? "{}");
    return flags.affinity ?? 0;
  } catch {
    return 0;
  }
}

