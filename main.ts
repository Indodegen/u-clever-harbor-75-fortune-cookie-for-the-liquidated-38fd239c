import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");
const text = readFileSync(entryPath, "utf8");

if (text.length < 1 || text.length > 160) {
  console.error("entry must be 1-160 characters, got " + text.length);
  process.exit(1);
}
if (text.trim().length === 0) {
  console.error("entry must not be whitespace only");
  process.exit(1);
}
if (text.includes("\n") || text.includes("\r")) {
  console.error("entry must be a single line");
  process.exit(1);
}
if (/[\u0000-\u001F\u007F\u200B\u200C\u200D\uFEFF]/.test(text)) {
  console.error("entry must not contain control or invisible characters");
  process.exit(1);
}
if (text !== text.trim()) {
  console.error("entry must not have leading or trailing whitespace");
  process.exit(1);
}
const words = text.trim().split(/\s+/);
if (words.length > 20) {
  console.error("entry must be at most 20 words, got " + words.length);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== text) {
  console.error("output round-trip mismatch");
  process.exit(1);
}
