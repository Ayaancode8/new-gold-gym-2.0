import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, join, extname, relative } from "node:path";

const root = resolve("out");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff" };
const port = Number(process.env.PORT ?? 3000);
createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const url = new URL(request.url, "http://localhost");
    const file = resolve(root, "." + decodeURIComponent(url.pathname));
    if (relative(root, file).startsWith("..")) { response.writeHead(403); response.end(); return; }
    let target = file;
    if (await stat(file).then(s => s.isDirectory()).catch(() => false)) {
      if (!url.pathname.endsWith("/")) { response.writeHead(301, { Location: url.pathname + "/" + url.search }); response.end(); return; }
      target = join(file, "index.html");
    }
    const contents = await readFile(target);
    response.writeHead(200, { "Content-Type": types[extname(target)] ?? "application/octet-stream" });
    response.end(request.method === "HEAD" ? undefined : contents);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : await readFile(join(root, "404.html")).catch(() => "Not found. Run npm run build first."));
  }
}).listen(port, "0.0.0.0", () => console.log(`Static demo: http://localhost:${port}`));
