// Static site builder for the itDeal Sg frontend.
// Pages are plain JS modules returning HTML strings, so every component maps 1:1
// to a WordPress template part later. Output: ./dist (open dist/index.html).
//
//   npm run build   -> one-off production build
//   npm run dev     -> rebuild on change + Tailwind watch + local server on :5173

import { spawn } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync, watch, readFileSync, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const tailwindBin = join(root, 'node_modules/.bin/tailwindcss');
const cssArgs = ['-i', 'src/css/app.css', '-o', 'dist/assets/css/app.css'];

async function buildHtml({ clean = true } = {}) {
  const started = Date.now();
  // keep dist/assets/css alive during dev rebuilds (Tailwind watch owns it)
  if (clean) rmSync(dist, { recursive: true, force: true });
  mkdirSync(join(dist, 'assets/js/vendor'), { recursive: true });
  cpSync(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });

  // Alpine plugins must load before core
  const vendor = {
    'alpine-focus.min.js': 'node_modules/@alpinejs/focus/dist/cdn.min.js',
    'alpine-collapse.min.js': 'node_modules/@alpinejs/collapse/dist/cdn.min.js',
    'alpine.min.js': 'node_modules/alpinejs/dist/cdn.min.js',
  };
  for (const [name, src] of Object.entries(vendor)) cpSync(join(root, src), join(dist, 'assets/js/vendor', name));

  const { renderSite } = await import(`./src/pages/index.js?t=${started}`);
  const files = await renderSite();
  for (const { file, html } of files) writeFileSync(join(dist, file), html);
  console.log(`✓ ${files.length} pages built in ${Date.now() - started}ms`);
}

function buildCss({ watchMode = false } = {}) {
  const args = [...cssArgs, ...(watchMode ? ['--watch=always'] : ['--minify'])];
  return new Promise((resolve, reject) => {
    const child = spawn(tailwindBin, args, { cwd: root, stdio: 'inherit' });
    if (watchMode) return resolve(child);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`tailwind exited ${code}`))));
  });
}

function serve(port = 5173) {
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
  createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = join(dist, path);
    if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404, { 'content-type': 'text/html' });
      return res.end(existsSync(join(dist, '404.html')) ? readFileSync(join(dist, '404.html')) : 'Not found');
    }
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(readFileSync(file));
  }).listen(port, () => console.log(`→ http://localhost:${port}`));
}

// The page modules are imported fresh in a child process on every change,
// so nested imports never serve stale code.
if (process.argv.includes('--html-only')) {
  await buildHtml({ clean: false });
} else if (process.argv.includes('--dev')) {
  await buildHtml();
  await buildCss({ watchMode: true });
  serve();
  let timer;
  watch(join(root, 'src'), { recursive: true }, (_, name) => {
    if (name?.endsWith('.css')) return;
    clearTimeout(timer);
    timer = setTimeout(() => spawn(process.execPath, ['build.mjs', '--html-only'], { cwd: root, stdio: 'inherit' }), 120);
  });
} else {
  await buildHtml();
  await buildCss();
}
