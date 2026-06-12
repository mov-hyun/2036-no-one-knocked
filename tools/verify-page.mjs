import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const requireBase = process.env.PLAYWRIGHT_REQUIRE_BASE
  ? `${process.env.PLAYWRIGHT_REQUIRE_BASE.replace(/\\/g, "/")}/package.json`
  : import.meta.url;
const require = createRequire(requireBase);
const { chromium } = require("playwright");

let baseUrl = process.env.PREVIEW_URL || "";
const outDir = "output/playwright";
const rootDir = process.cwd();
const mimeMap = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

await mkdir(outDir, { recursive: true });

let server;
if (!baseUrl) {
  server = createServer(async (req, res) => {
    try {
      const rawPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const routePath = rawPath === "/" ? "/index.html" : rawPath;
      const filePath = path.resolve(rootDir, `.${routePath}`);
      const rootWithSep = rootDir.endsWith(path.sep) ? rootDir : `${rootDir}${path.sep}`;
      if (filePath !== rootDir && !filePath.startsWith(rootWithSep)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      const data = await readFile(filePath);
      res.writeHead(200, {
        "content-type": mimeMap[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      });
      res.end(data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
}

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    return chromium.launch({ headless: true });
  }
}

const browser = await launchBrowser();
const results = [];

async function auditPage(pathname, viewport, screenshotName) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(`${baseUrl}${pathname}`, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => {
    const hero = document.querySelector(".hero-image");
    return {
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroLoaded: hero ? hero.complete && hero.naturalWidth > 0 : true,
      bodyHeight: document.documentElement.scrollHeight,
    };
  });

  await page.screenshot({ path: `${outDir}/${screenshotName}`, fullPage: true });
  await page.close();
  results.push({ pathname, viewport, consoleErrors, ...metrics });
}

await auditPage("/index.html", { width: 1365, height: 768 }, "desktop-index.png");
await auditPage("/index.html", { width: 390, height: 844 }, "mobile-index.png");
await auditPage("/proposal.html", { width: 794, height: 1123 }, "proposal-page.png");

const proposal = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await proposal.goto(`${baseUrl}/proposal.html`, { waitUntil: "networkidle" });
await proposal.pdf({
  path: `${outDir}/proposal.pdf`,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
await proposal.close();

await browser.close();
if (server) await new Promise((resolve) => server.close(resolve));

const failures = results.filter((result) => {
  return result.overflowX > 1 || result.consoleErrors.length > 0 || result.heroLoaded === false;
});

console.log(JSON.stringify({ ok: failures.length === 0, results, failures }, null, 2));
process.exitCode = failures.length === 0 ? 0 : 1;
