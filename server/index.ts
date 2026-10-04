// Production server: serves the built app from dist/ and the /api/ai proxy.
//   npm run build && GEMINI_API_KEY=... npm start

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { handleAi } from './handler.ts';

const DIST = resolve(import.meta.dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 3000;
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json',
};

createServer(async (req, res) => {
  try {
    if (await handleAi(req, res)) return;
    const path = normalize(decodeURIComponent((req.url || '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    let file = join(DIST, path);
    if (!file.startsWith(DIST)) { res.statusCode = 403; res.end(); return; }
    const s = await stat(file).catch(() => null);
    if (!s || s.isDirectory()) file = join(DIST, 'index.html');
    res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
    if (file.includes(`${join(DIST, 'assets')}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end(await readFile(file));
  } catch {
    res.statusCode = 500;
    res.end('Server error');
  }
}).listen(PORT, () => {
  console.log(`Ledger on http://localhost:${PORT} · model ${process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'} · server key ${process.env.GEMINI_API_KEY ? 'set' : 'not set'}`);
});
