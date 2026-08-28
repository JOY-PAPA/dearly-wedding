import { execFile } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const inputPath = process.argv[2];

if (!inputPath) {
  throw new Error("Usage: node scripts/import-instagram-bouquets.mjs <links.txt>");
}

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "public", "bouquets");
const generatedFile = path.join(projectRoot, "app", "bouquet-posts.generated.ts");
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36";
const curl = promisify(execFile);
const curlExecutable = process.platform === "win32" ? "curl.exe" : "curl";

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)));
}

function getTagAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match?.[1] ? decodeHtml(match[1]) : "";
}

function getEmbeddedMediaImage(html) {
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const classes = getTagAttribute(tag, "class").split(/\s+/);
    if (!classes.includes("EmbeddedMediaImage")) continue;
    return getTagAttribute(tag, "src");
  }
  return "";
}

function normalizeUrls(contents) {
  const urls = [];
  const seen = new Set();
  for (const match of contents.matchAll(/https:\/\/www\.instagram\.com\/(p|reel)\/([^/?\s]+)\/?[^\s]*/g)) {
    const href = `https://www.instagram.com/${match[1]}/${match[2]}/`;
    if (seen.has(href)) continue;
    seen.add(href);
    urls.push(href);
  }
  return urls;
}

async function runCurl(args, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await curl(curlExecutable, args, {
        encoding: "utf8",
        maxBuffer: 3 * 1024 * 1024,
        windowsHide: true,
      });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 900));
    }
  }
  throw lastError;
}

const contents = await readFile(path.resolve(inputPath), "utf8");
const allUrls = normalizeUrls(contents);
const requestedLimit = Number.parseInt(process.env.BOUQUET_IMPORT_LIMIT ?? "", 10);
const urls = Number.isFinite(requestedLimit) && requestedLimit > 0
  ? allUrls.slice(0, requestedLimit)
  : allUrls;
await mkdir(outputDir, { recursive: true });

console.log(`Found ${allUrls.length} unique Instagram links; importing ${urls.length}.`);

const results = new Array(urls.length);
let nextIndex = 0;
let completed = 0;

async function importOne(index) {
  const href = urls[index];
  const embedUrl = `${href}embed/`;
  const { stdout: html } = await runCurl([
    "--fail",
    "--location",
    "--silent",
    "--show-error",
    "--compressed",
    "--max-time",
    "30",
    embedUrl,
  ]);
  const imageUrl = getEmbeddedMediaImage(html);
  if (!imageUrl) throw new Error("Missing uncropped EmbeddedMediaImage");

  const filename = `bouquet-${String(index + 1).padStart(3, "0")}.jpg`;
  const imagePath = path.join(outputDir, filename);
  await runCurl([
    "--fail",
    "--location",
    "--silent",
    "--show-error",
    "--max-time",
    "30",
    "--user-agent",
    userAgent,
    "--referer",
    href,
    "--output",
    imagePath,
    imageUrl,
  ]);
  if ((await stat(imagePath)).size < 1024) throw new Error("Downloaded image is unexpectedly small");

  return {
    image: `/bouquets/${filename}`,
    href,
    alt: `다애플 부케 인스타그램 게시물 ${index + 1}`,
    tag: href.includes("/reel/") ? "REELS" : "DAAEPL BOUQUET",
  };
}

async function worker() {
  while (true) {
    const index = nextIndex;
    nextIndex += 1;
    if (index >= urls.length) return;
    try {
      results[index] = await importOne(index);
    } catch (error) {
      console.error(`Skipped ${urls[index]}: ${error.message}`);
    } finally {
      completed += 1;
      if (completed % 10 === 0 || completed === urls.length) {
        console.log(`Processed ${completed}/${urls.length}`);
      }
    }
  }
}

await Promise.all(Array.from({ length: Math.min(3, urls.length) }, () => worker()));

const imported = results.filter(Boolean);
if (imported.length === 0) throw new Error("No Instagram thumbnails could be imported.");
if (imported.length !== urls.length) {
  throw new Error(`Imported ${imported.length}/${urls.length}; generated data was left unchanged.`);
}

const source = `export type BouquetPost = {\n  image: string;\n  href: string;\n  alt: string;\n  tag: string;\n};\n\nexport const bouquetPosts: BouquetPost[] = ${JSON.stringify(imported, null, 2)};\n`;
await writeFile(generatedFile, source, "utf8");

console.log(`Imported ${imported.length}/${urls.length} bouquet posts.`);
