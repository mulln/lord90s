CREATE TABLE players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  profession TEXT,
  charm INTEGER DEFAULT 5,
  grit INTEGER DEFAULT 5,
  skill INTEGER DEFAULT 5,
  nerve INTEGER DEFAULT 5,
  hp INTEGER DEFAULT 20,
  max_hp INTEGER DEFAULT 20,
  ap INTEGER DEFAULT 30,
  cash INTEGER DEFAULT 20,
  reputation INTEGER DEFAULT 1,
  romance_flags TEXT DEFAULT '{}',
  last_active DATE,
  created_at DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE encounters_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER,
  npc_name TEXT,
  spice_level INTEGER,
  affinity INTEGER,
  choice TEXT,
  created_at DATE DEFAULT CURRENT_TIMESTAMP
);

