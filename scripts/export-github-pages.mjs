import { spawn } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(projectRoot, "github-pages-dist");
const clientDir = path.resolve(projectRoot, "dist", "client");
const basePath = "";
const siteUrl = "https://www.kimdaae.com";
const localUrl = "http://127.0.0.1:4317/";
const reviewDataSource = await readFile(path.join(projectRoot, "app", "blog-reviews.generated.ts"), "utf8");
const reviewDataJson = reviewDataSource.match(/export const blogReviews: BlogReview\[\] = ([\s\S]*);\s*$/)?.[1];

if (!reviewDataJson) {
  throw new Error("Unable to read generated blog review data.");
}

const reviewsPayload = JSON.stringify(JSON.parse(reviewDataJson))
  .replaceAll("<", "\\u003c")
  .replaceAll(">", "\\u003e")
  .replaceAll("&", "\\u0026");

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
          const reviews = ${reviewsPayload};
          const reviewsPerPage = 3;
          const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);
          let reviewPage = 1;
          const reviewList = document.querySelector(".review-list");
          const pagination = document.querySelector(".review-pagination");

          const makeElement = (tag, className, text) => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (text !== undefined) element.textContent = text;
            return element;
          };

          const openReviewModal = (review) => {
            const previousOverflow = document.body.style.overflow;
            const backdrop = makeElement("div", "review-modal-backdrop");
            const panel = makeElement("article", "review-modal-panel");
            panel.setAttribute("role", "dialog");
            panel.setAttribute("aria-modal", "true");
            panel.setAttribute("aria-labelledby", "review-modal-title");

            const closeButton = makeElement("button", "review-modal-close", "×");
            closeButton.type = "button";
            closeButton.setAttribute("aria-label", "후기 상세 닫기");

            const imageWrap = makeElement("div", "review-modal-image");
            const image = makeElement("img");
            image.src = review.image;
            image.alt = review.title;
            imageWrap.append(image);

            const copy = makeElement("div", "review-modal-copy");
            const meta = makeElement("p", "blog-meta");
            meta.append(makeElement("span", "", review.category), document.createTextNode(review.date));
            const title = makeElement("h2", "", review.title);
            title.id = "review-modal-title";
            const excerpt = makeElement("p", "review-modal-excerpt", review.excerpt);
            const note = makeElement("p", "review-modal-note", "고객님이 직접 남겨주신 실제 웨딩 준비 후기입니다. 자세한 전체 내용은 아래 원문에서 확인하실 수 있습니다.");
            const planner = makeElement("div", "review-modal-planner");
            planner.append(makeElement("span", "", "PLANNED BY"), makeElement("b", "", "베리굿 웨딩 김다애 플래너"));
            const originalLink = makeElement("a", "review-original-link");
            originalLink.href = review.href;
            originalLink.target = "_blank";
            originalLink.rel = "noreferrer";
            originalLink.append(document.createTextNode("네이버 블로그 원문 보기"), makeElement("span", "", "↗"));
            copy.append(meta, title, excerpt, note, planner, originalLink);

            const close = () => {
              window.removeEventListener("keydown", closeWithEscape);
              document.body.style.overflow = previousOverflow;
              backdrop.remove();
            };
            const closeWithEscape = (event) => {
              if (event.key === "Escape") close();
            };
            closeButton.addEventListener("click", close);
            backdrop.addEventListener("mousedown", (event) => {
              if (event.target === backdrop) close();
            });
            window.addEventListener("keydown", closeWithEscape);
            panel.append(closeButton, imageWrap, copy);
            backdrop.append(panel);
            document.body.append(backdrop);
            document.body.style.overflow = "hidden";
            closeButton.focus();
          };

          const makeReviewCard = (review) => {
            const card = makeElement("button", "review-card");
            card.type = "button";
            card.setAttribute("aria-haspopup", "dialog");
            card.addEventListener("click", () => openReviewModal(review));

            const image = makeElement("img");
            image.src = review.image;
            image.alt = review.title;

            const copy = makeElement("div", "blog-card-copy");
            const meta = makeElement("p", "blog-meta");
            meta.append(makeElement("span", "", review.category), document.createTextNode(review.date));
            copy.append(meta, makeElement("h3", "", review.title), makeElement("p", "", review.excerpt));

            const footer = makeElement("div", "blog-card-footer");
            footer.append(makeElement("b", "", "베리굿 웨딩 김다애 플래너"), makeElement("span", "", "후기 상세 보기 →"));
            copy.append(footer);
            card.append(image, copy);
            return card;
          };

          const changeReviewPage = (nextPage) => {
            reviewPage = Math.min(Math.max(nextPage, 1), totalReviewPages);
            renderReviews();
            document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
          };

          const makePageButton = (label, page, options = {}) => {
            const button = makeElement("button", options.className || "", label);
            button.type = "button";
            button.disabled = Boolean(options.disabled);
            if (options.label) button.setAttribute("aria-label", options.label);
            if (page === reviewPage && !options.arrow) {
              button.classList.add("active");
              button.setAttribute("aria-current", "page");
            }
            button.addEventListener("click", () => changeReviewPage(page));
            return button;
          };

          const renderPagination = () => {
            if (!pagination) return;
            const pageStart = Math.min(Math.max(reviewPage - 2, 1), Math.max(totalReviewPages - 4, 1));
            const pageEnd = Math.min(pageStart + 4, totalReviewPages);
            const controls = [makePageButton("‹", reviewPage - 1, { className: "page-arrow", disabled: reviewPage === 1, label: "이전 후기 페이지", arrow: true })];

            if (pageStart > 1) {
              controls.push(makePageButton("1", 1), makeElement("span", "page-ellipsis", "…"));
            }
            for (let page = pageStart; page <= pageEnd; page += 1) controls.push(makePageButton(String(page), page));
            if (pageEnd < totalReviewPages) {
              controls.push(makeElement("span", "page-ellipsis", "…"), makePageButton(String(totalReviewPages), totalReviewPages));
            }
            controls.push(makePageButton("›", reviewPage + 1, { className: "page-arrow", disabled: reviewPage === totalReviewPages, label: "다음 후기 페이지", arrow: true }));
            pagination.replaceChildren(...controls);
          };

          function renderReviews() {
            if (!reviewList) return;
            const start = (reviewPage - 1) * reviewsPerPage;
            reviewList.replaceChildren(...reviews.slice(start, start + reviewsPerPage).map(makeReviewCard));
            renderPagination();
          }

          renderReviews();

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
  await writeFile(path.join(outputDir, "CNAME"), "www.kimdaae.com\n", "utf8");
} catch (error) {
  if (serverError) process.stderr.write(serverError);
  throw error;
} finally {
  server.kill();
}

console.log(`GitHub Pages export created at ${outputDir}`);
