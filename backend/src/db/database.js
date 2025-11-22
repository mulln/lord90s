import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

import config from "../config.js";

const dbFile = config.dbPath;
const schemaPath = path.join(process.cwd(), "backend/src/db/schema.sql");

const dbExists = fs.existsSync(dbFile);
const db = new Database(dbFile);

if (!dbExists) {
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);
  console.log("SQLite database created & schema applied.");
}

export default db;

