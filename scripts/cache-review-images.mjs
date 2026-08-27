import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dataPath = resolve(process.argv[2] || "app/blog-reviews.generated.ts");
const publicDirectory = resolve(process.argv[3] || "public/reviews");
const source = await readFile(dataPath, "utf8");
const marker = "export const blogReviews: BlogReview[] = ";
const jsonStart = source.indexOf(marker);
const jsonEnd = source.lastIndexOf(";");

if (jsonStart < 0 || jsonEnd < 0) {
  throw new Error("Unable to read generated blog review data.");
}

const reviews = JSON.parse(source.slice(jsonStart + marker.length, jsonEnd));
await mkdir(publicDirectory, { recursive: true });

function extensionFor(contentType, url) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("avif")) return "avif";
  if (/\.png(?:\?|$)/i.test(url)) return "png";
  return "jpg";
}

async function cacheReviewImage(review, index) {
  const sourceImage = review.sourceImage || review.image;
  try {
    const response = await fetch(sourceImage, {
      headers: {
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      },
      signal: AbortSignal.timeout(20000),
    });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.startsWith("image/")) {
      throw new Error(`HTTP ${response.status} ${contentType}`);
    }
    const extension = extensionFor(contentType, sourceImage);
    const filename = `review-${String(index + 1).padStart(3, "0")}.${extension}`;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.length) throw new Error("Empty image response");
    await writeFile(resolve(publicDirectory, filename), bytes);
    return { ...review, sourceImage, image: `/reviews/${filename}` };
  } catch (error) {
    console.warn(`Image fallback ${index + 1}/${reviews.length}: ${error.message}`);
    return {
      ...review,
      sourceImage,
      image: `/instagram/daae-gi-${String((index % 6) + 1).padStart(2, "0")}.jpg`,
    };
  }
}

const cachedReviews = new Array(reviews.length);
let cursor = 0;
await Promise.all(Array.from({ length: Math.min(8, reviews.length) }, async () => {
  while (cursor < reviews.length) {
    const index = cursor++;
    cachedReviews[index] = await cacheReviewImage(reviews[index], index);
  }
}));

const output = `export type BlogReview = {\n  category: string;\n  title: string;\n  date: string;\n  excerpt: string;\n  image: string;\n  sourceImage?: string;\n  href: string;\n};\n\nexport const blogReviews: BlogReview[] = ${JSON.stringify(cachedReviews, null, 2)};\n`;
await writeFile(dataPath, output, "utf8");
console.log(`Cached ${cachedReviews.length} review images in ${publicDirectory}`);
