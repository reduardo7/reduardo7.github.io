#!/usr/bin/env node
'use strict';

// Servidor estático mínimo, sin dependencias, para probar el sitio en local.
// Uso: npm start   (o PORT=3000 npm start)
//      ROOT=frusita PORT=3003 node scripts/serve.js   (sirve sólo ese subdirectorio)

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.env.ROOT
  ? path.resolve(__dirname, '..', process.env.ROOT)
  : path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function contentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

function sendFile(req, res, filePath) {
  res.writeHead(200, { 'Content-Type': contentType(filePath), 'Cache-Control': 'no-store' });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(filePath)
    .on('error', () => res.destroy())
    .pipe(res);
}

// Traduce la URL a una ruta dentro de ROOT, sin permitir salir de él.
function resolveRequestPath(pathname) {
  const target = path.resolve(ROOT, '.' + decodeURIComponent(pathname));
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;
  return target;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
  }

  let pathname;
  let search;
  try {
    const parsed = new URL(req.url, `http://${req.headers.host || HOST}`);
    pathname = parsed.pathname;
    search = parsed.search;
  } catch {
    return send(res, 400, 'Bad Request');
  }

  const target = resolveRequestPath(pathname);
  if (!target) return send(res, 403, 'Forbidden');

  fs.stat(target, (err, stats) => {
    if (err) return send(res, 404, 'Not Found');

    if (stats.isDirectory()) {
      // Igual que GitHub Pages: /x28-control → /x28-control/
      if (!pathname.endsWith('/')) {
        return send(res, 301, '', { Location: pathname + '/' + search });
      }
      const index = path.join(target, 'index.html');
      return fs.access(index, fs.constants.R_OK, (indexErr) => {
        if (indexErr) return send(res, 404, 'Not Found');
        sendFile(req, res, index);
      });
    }

    sendFile(req, res, target);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está en uso. Probá: PORT=8081 npm start`);
  } else {
    console.error(err);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log(`Sirviendo ${ROOT}`);
  console.log(`→ http://${HOST}:${PORT}/`);
});
