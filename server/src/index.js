import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import db from "./db.js";

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!JWT_SECRET || !ADMIN_PASSWORD) {
  console.error("Set JWT_SECRET and ADMIN_PASSWORD (see server/.env.example)");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "100kb" }));

const safeEqual = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

const auth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// --- public API ---
app.get("/api/products", (req, res) => {
  const rows = db.prepare("SELECT * FROM products WHERE available = 1 ORDER BY category, name").all();
  res.json(rows);
});

app.get("/api/pages/:slug", (req, res) => {
  const row = db.prepare("SELECT * FROM pages WHERE slug = ?").get(req.params.slug);
  row ? res.json(row) : res.status(404).json({ error: "Not found" });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone = "", message } = req.body || {};
  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email || ""))
    return res.status(400).json({ error: "Name, valid email and message are required" });
  db.prepare("INSERT INTO messages (name, email, phone, message) VALUES (?,?,?,?)").run(
    String(name).slice(0, 200), email, String(phone).slice(0, 50), String(message).slice(0, 5000)
  );
  res.status(201).json({ ok: true });
});

// --- admin API ---
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (safeEqual(username, ADMIN_USER) && safeEqual(password, ADMIN_PASSWORD))
    return res.json({ token: jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" }) });
  res.status(401).json({ error: "Invalid credentials" });
});

const productFields = (b) => [
  String(b.name || "").trim(), String(b.category || "").trim(), String(b.description || ""),
  Number(b.price), String(b.image || ""), b.available === false || b.available === 0 ? 0 : 1
];
const validProduct = (f) => f[0] && f[1] && Number.isFinite(f[3]) && f[3] >= 0;

app.get("/api/admin/products", auth, (req, res) =>
  res.json(db.prepare("SELECT * FROM products ORDER BY id DESC").all()));

app.post("/api/admin/products", auth, (req, res) => {
  const f = productFields(req.body || {});
  if (!validProduct(f)) return res.status(400).json({ error: "Invalid product" });
  const r = db.prepare(
    "INSERT INTO products (name, category, description, price, image, available) VALUES (?,?,?,?,?,?)"
  ).run(...f);
  res.status(201).json({ id: Number(r.lastInsertRowid) });
});

app.put("/api/admin/products/:id", auth, (req, res) => {
  const f = productFields(req.body || {});
  if (!validProduct(f)) return res.status(400).json({ error: "Invalid product" });
  db.prepare(
    "UPDATE products SET name=?, category=?, description=?, price=?, image=?, available=? WHERE id=?"
  ).run(...f, req.params.id);
  res.json({ ok: true });
});

app.delete("/api/admin/products/:id", auth, (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

app.put("/api/admin/pages/:slug", auth, (req, res) => {
  const { title, body } = req.body || {};
  if (!title || typeof body !== "string") return res.status(400).json({ error: "Invalid page" });
  db.prepare(
    "INSERT INTO pages (slug, title, body) VALUES (?,?,?) ON CONFLICT(slug) DO UPDATE SET title=excluded.title, body=excluded.body"
  ).run(req.params.slug, title, body);
  res.json({ ok: true });
});

app.get("/api/admin/messages", auth, (req, res) =>
  res.json(db.prepare("SELECT * FROM messages ORDER BY id DESC").all()));

// --- serve built frontend in production ---
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../client/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
