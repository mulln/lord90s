export default {
  aiEnabled: process.env.OPENAI_API_KEY ? true : false,
  spiceTier: Number(process.env.SPICE_TIER || 2), // Default mild unless configured
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
  dbPath: process.env.DB_PATH || "./lord90s.db"
};

