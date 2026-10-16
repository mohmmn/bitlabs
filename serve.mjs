// Petit serveur local pour prévisualiser dist/ comme en production.
// Usage : node serve.mjs   (puis http://localhost:4321)

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 4321;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolve(urlPath) {
  const file = path.normalize(path.join(DIST, decodeURIComponent(urlPath)));
  if (!file.startsWith(DIST)) return null;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!urlPath.endsWith('/')) return { redirect: `${urlPath}/` };
      return { file: path.join(file, 'index.html') };
    }
    return { file };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const urlPath = new URL(req.url, 'http://localhost').pathname;
  const found = await resolve(urlPath);
  if (found?.redirect) {
    res.writeHead(301, { Location: found.redirect }).end();
    return;
  }
  try {
    const body = await readFile(found.file);
    res.writeHead(200, { 'Content-Type': types[path.extname(found.file)] || 'application/octet-stream' }).end(body);
  } catch {
    const body = await readFile(path.join(DIST, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': types['.html'] }).end(body);
  }
}).listen(PORT, () => console.log(`Aperçu : http://localhost:${PORT}`));
