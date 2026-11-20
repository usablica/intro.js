#!/usr/bin/env node
/*
 * Serves the repository (dist/, themes/, ...) as static files for the Cypress
 * tests, without rebuilding anything.
 *
 * Cypress used to run against `npm run dev` (rollup in watch mode), which
 * rebuilds and rewrites dist/ on start. Because dist/intro.js already existed
 * from the build step, the tests could start while it was being rewritten and
 * load a partial file, so `window.introJs` was undefined in every test.
 *
 * Usage: node bin/serve-static.js [port]   (default 10001)
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || process.env.PORT || 10001);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = path.join(root, urlPath);

    // never serve anything outside the repository
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404).end();
        return;
      }

      res.writeHead(200, {
        "Content-Type":
          types[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`Serving ${root} on http://localhost:${port}`);
  });
