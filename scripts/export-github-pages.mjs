import { spawn } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(projectRoot, "github-pages-dist");
const clientDir = path.resolve(projectRoot, "dist", "client");
const basePath = "/dearly-wedding";
const siteUrl = "https://joy-papa.github.io/dearly-wedding";
const localUrl = "http://127.0.0.1:4317/";

if (!outputDir.startsWith(`${projectRoot}${path.sep}`)) {
  throw new Error("GitHub Pages output must stay inside the project directory.");
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(localUrl);
      if (response.ok) return response;
    } catch {
      // The production preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Timed out while waiting for the production preview.");
}

async function rewriteCssAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteCssAssets(target);
      return;
    }
    if (!entry.name.endsWith(".css")) return;
    const css = await readFile(target, "utf8");
    const rewritten = css.replace(/url\((['"]?)\/(?!\/)/g, `url($1${basePath}/`);
    await writeFile(target, rewritten, "utf8");
  }));
}

const server = spawn(
  process.execPath,
  [path.join(projectRoot, "node_modules", "vinext", "dist", "cli.js"), "start", "--port", "4317"],
  {
    cwd: projectRoot,
    env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let serverError = "";
server.stderr.on("data", (chunk) => { serverError += chunk.toString(); });

try {
  const response = await waitForServer();
  let html = await response.text();

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await cp(clientDir, outputDir, { recursive: true });

  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi, "")
    .replaceAll("https://dearly-wedding.yihyeon-papa.chatgpt.site", siteUrl)
    .replace(/(href|src|content)="\/(?!\/)/g, `$1="${basePath}/`)
    .replace(
      "</body>",
      `<script>
        (() => {
          const available = document.querySelector(".availability-pill b");
          if (available) available.textContent = Math.floor(Math.random() * 12 + 1) + "일 남음";

          const form = document.querySelector(".consult-section form");
          form?.addEventListener("submit", (event) => {
            event.preventDefault();
            const success = document.createElement("div");
            success.className = "success-message";
            success.setAttribute("role", "status");
            success.innerHTML = '<span>✓</span><h3>상담 신청이 준비되었습니다</h3><p>현재는 안내용 화면이며 정보가 외부로 전송되지 않습니다.<br>실제 운영 시 상담 시스템을 연결할 수 있어요.</p><button type="button">다시 작성하기</button>';
            form.replaceWith(success);
            success.querySelector("button")?.addEventListener("click", () => location.reload());
          });
        })();
      </script></body>`,
    );

  await rewriteCssAssets(outputDir);
  await writeFile(path.join(outputDir, "index.html"), html, "utf8");
  await writeFile(path.join(outputDir, "404.html"), html, "utf8");
  await writeFile(path.join(outputDir, ".nojekyll"), "", "utf8");
} catch (error) {
  if (serverError) process.stderr.write(serverError);
  throw error;
} finally {
  server.kill();
}

console.log(`GitHub Pages export created at ${outputDir}`);
