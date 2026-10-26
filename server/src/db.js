import { DatabaseSync } from "node:sqlite";
import { seed } from "./seed.js";

const db = new DatabaseSync(process.env.DB_FILE || "dgapbrownie.db");

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  available INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS mantras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  meaning TEXT NOT NULL DEFAULT '',
  slot TEXT NOT NULL DEFAULT 'any',
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

if (db.prepare("SELECT COUNT(*) AS n FROM products").get().n === 0) {
  const p = db.prepare(
    "INSERT INTO products (name, category, description, price, image) VALUES (?,?,?,?,?)"
  );
  for (const x of seed.products) p.run(x.name, x.category, x.description, x.price, x.image);
}
if (db.prepare("SELECT COUNT(*) AS n FROM mantras").get().n === 0) {
  const m = db.prepare("INSERT INTO mantras (text, meaning, slot) VALUES (?,?,?)");
  for (const x of seed.mantras) m.run(x.text, x.meaning, x.slot);
}
const pg = db.prepare("INSERT OR IGNORE INTO pages (slug, title, body) VALUES (?,?,?)");
for (const x of seed.pages) pg.run(x.slug, x.title, x.body);

export default db;
