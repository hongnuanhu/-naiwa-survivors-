// 仅提供构建后的静态文件，无外部依赖；从任意当前目录执行均可。
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const host = option('--host', '127.0.0.1');
const port = Number(option('--port', '4173'));
if (!host || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('用法：node scripts/serve.mjs [--host 127.0.0.1] [--port 4173]');
try { await stat(resolve(root, 'index.html')); } catch { throw new Error('缺少 dist/index.html。源码包请先 npm ci 和 npm run build；运行包请完整解压。'); }
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.mp3':'audio/mpeg', '.txt':'text/plain; charset=utf-8', '.md':'text/plain; charset=utf-8' };
const server = createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, { Allow:'GET, HEAD' }); res.end(); return; }
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!target.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type':mime[extname(target)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `端口 ${port} 被占用，请加 --port 4174。` : error.message); process.exitCode = 1; });
server.listen(port, host, () => console.log(`奶蛙幸存者：http://${host}:${port}\n保持终端打开；按 Ctrl+C 停止。`));
