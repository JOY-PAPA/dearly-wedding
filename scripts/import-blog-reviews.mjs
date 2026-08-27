import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourcePath = process.argv[2];
const destinationPath = process.argv[3] || "app/blog-reviews.generated.ts";
const concurrency = Math.max(1, Number(process.env.IMPORT_CONCURRENCY || 8));
const delayMs = Math.max(0, Number(process.env.IMPORT_DELAY_MS || 0));

if (!sourcePath) {
  throw new Error("Usage: node scripts/import-blog-reviews.mjs <links.txt> [output.ts]");
}

const source = await readFile(resolve(sourcePath), "utf8");
const links = [...source.matchAll(/https:\/\/blog\.naver\.com\/([^/\s]+)\/(\d+)/g)].map((match) => ({
  href: match[0],
  blogId: match[1],
  logNo: match[2],
}));

if (!links.length) {
  throw new Error("No Naver Blog links found.");
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=88",
];

function decodeHtml(value = "") {
  return value
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&hearts;/gi, "♥")
    .replace(/&nbsp;/gi, " ")
    .replace(/&zwj;/gi, "\u200d")
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&middot;/gi, "·")
    .replace(/&ndash;|&mdash;/gi, "—")
    .replace(/&hellip;/gi, "…")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function readMeta(html) {
  const values = new Map();
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = new Map();
    for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gsi)) {
      attrs.set(match[1].toLowerCase(), decodeHtml(match[3]));
    }
    const key = (attrs.get("property") || attrs.get("name") || "").toLowerCase();
    const content = attrs.get("content");
    if (key && content && !values.has(key)) values.set(key, content);
  }
  return values;
}

function normalizeTitle(value, index) {
  const title = decodeHtml(value)
    .replace(/\s*:\s*네이버\s*블로그\s*$/i, "")
    .replace(/\s*\|\s*NAVER\s*BLOG\s*$/i, "")
    .trim();
  return title || `김다애 플래너 실제 진행 후기 ${String(index + 1).padStart(3, "0")}`;
}

function normalizeExcerpt(value) {
  const excerpt = decodeHtml(value).replace(/https?:\/\/\S+/g, "").trim();
  if (!excerpt) return "베리굿 웨딩 김다애 플래너와 함께 준비한 실제 고객님의 웨딩 기록입니다.";
  return excerpt.length > 130 ? `${excerpt.slice(0, 127).trim()}…` : excerpt;
}

function normalizeDate(value) {
  const match = value?.match(/(20\d{2})[-./]?(\d{2})/);
  return match ? `${match[1]}.${match[2]}` : "REAL REVIEW";
}

async function loadReview(item, index) {
  const mobileUrl = `https://m.blog.naver.com/PostView.naver?blogId=${encodeURIComponent(item.blogId)}&logNo=${item.logNo}`;
  try {
    const response = await fetch(mobileUrl, {
      headers: {
        "accept-language": "ko-KR,ko;q=0.9,en;q=0.7",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const meta = readMeta(html);
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
    const dateSource = meta.get("article:published_time") || meta.get("og:article:published_time") || html.match(/20\d{2}[./-]\s*\d{1,2}[./-]/)?.[0] || "";
    return {
      category: "REAL WEDDING",
      title: normalizeTitle(meta.get("og:title") || titleTag, index),
      date: normalizeDate(dateSource),
      excerpt: normalizeExcerpt(meta.get("og:description") || meta.get("description")),
      image: meta.get("og:image") || fallbackImages[index % fallbackImages.length],
      href: item.href,
    };
  } catch (error) {
    console.warn(`Fallback ${index + 1}/${links.length}: ${item.href} (${error.message})`);
    return {
      category: "REAL WEDDING",
      title: `김다애 플래너 실제 진행 후기 · ${item.blogId}`,
      date: "REAL REVIEW",
      excerpt: "베리굿 웨딩 김다애 플래너와 함께 준비한 실제 고객님의 웨딩 기록입니다.",
      image: fallbackImages[index % fallbackImages.length],
      href: item.href,
    };
  }
}

let cachedByHref = new Map();
try {
  const previousOutput = await readFile(resolve(destinationPath), "utf8");
  const previousJson = previousOutput.match(/export const blogReviews: BlogReview\[\] = ([\s\S]*);\s*$/)?.[1];
  if (previousJson) {
    cachedByHref = new Map(JSON.parse(previousJson).map((review) => [review.href, review]));
  }
} catch {
  // The first import has no cache to reuse.
}

const reviews = new Array(links.length);
let cursor = 0;
await Promise.all(Array.from({ length: Math.min(concurrency, links.length) }, async () => {
  while (cursor < links.length) {
    const index = cursor++;
    const item = links[index];
    const cached = cachedByHref.get(item.href);
    if (cached && !cached.title.startsWith("김다애 플래너 실제 진행 후기")) {
      reviews[index] = {
        ...cached,
        title: normalizeTitle(cached.title, index),
        excerpt: normalizeExcerpt(cached.excerpt),
      };
      continue;
    }
    if (delayMs) await new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));
    reviews[index] = await loadReview(item, index);
  }
}));

const output = `export type BlogReview = {\n  category: string;\n  title: string;\n  date: string;\n  excerpt: string;\n  image: string;\n  href: string;\n};\n\nexport const blogReviews: BlogReview[] = ${JSON.stringify(reviews, null, 2)};\n`;
await writeFile(resolve(destinationPath), output, "utf8");
console.log(`Imported ${reviews.length} reviews to ${destinationPath}`);
