import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import Database from "better-sqlite3";

const PORT = Number(process.env.PORT || 5178);
const DB_PATH = process.env.DB_PATH || "./feedback.db";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(morgan("tiny"));
app.use(cors({ origin: ALLOW_ORIGIN === "*" ? true : ALLOW_ORIGIN }));
app.use("/api/", rateLimit({ windowMs: 60_000, max: 30 })); // 분당 30건

const db = new Database(DB_PATH);
db.exec(`
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT
);
`);

const nowISO = () => new Date().toISOString();
const clientIP = (req: any) =>
  (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();

// 저장
app.post("/api/feedback", (req, res) => {
  try {
    const { name = "", email = "", message = "" } = req.body || {};
    if (typeof message !== "string" || message.trim().length < 1) {
      return res.status(400).json({ ok: false, error: "message required" });
    }
    if (message.length > 5000) {
      return res.status(400).json({ ok: false, error: "message too long" });
    }
    const info = db.prepare(`
      INSERT INTO feedback (created_at, name, email, message, ip, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      nowISO(),
      String(name).trim(),
      String(email).trim(),
      String(message).trim(),
      clientIP(req),
      String(req.headers["user-agent"] || "")
    );
    console.log("[feedback] saved #", info.lastInsertRowid);
    return res.json({ ok: true, id: info.lastInsertRowid });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// 관리자 조회 (토큰 필요)
app.get("/api/feedback", (req, res) => {
  const auth = req.headers.authorization || "";
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  const limit = Math.min(Number(req.query.limit || 100), 1000);
  const rows = db.prepare("SELECT * FROM feedback ORDER BY id DESC LIMIT ?").all(limit);
  return res.json({ ok: true, rows });
});

// 헬스체크
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`[feedback] listening on :${PORT}`));
