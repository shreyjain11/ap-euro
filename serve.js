import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const allowed = new Set(['index.html', 'app.js', 'core.js', 'periods.js', 'styles.css']);
createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    const name = path === '/' ? 'index.html' : path.slice(1);
    if (!allowed.has(name)) { res.writeHead(404); res.end('Not found'); return; }
    const data = await readFile(resolve(root, name));
    res.writeHead(200, { 'Content-Type': `${types[extname(name)]}; charset=utf-8`, 'Cache-Control': 'no-store' }); res.end(data);
  } catch { res.writeHead(500); res.end('Unable to load the page'); }
}).listen(4173, '127.0.0.1', () => console.log('AP Euro preview: http://127.0.0.1:4173'));
