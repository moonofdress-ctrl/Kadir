#!/usr/bin/env node
/* Static preview of studio/ without HyperFrames or FFmpeg.

   Usage: node studio/tools/preview.mjs [port]     (default 8780)
   Open http://127.0.0.1:8780/?fit&t=12.5 to see the frame at 12.5 seconds, scaled to the window.
   No audio sync and no rendering here: this is for looking at frames while building scenes. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2] || 8780);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".png": "image/png", ".wav": "audio/wav", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`studio preview on http://127.0.0.1:${PORT}/?fit&t=0`));
