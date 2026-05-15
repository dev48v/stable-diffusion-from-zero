// Tiny CLI — `node cli/generate.js "your prompt here"` writes a PNG.
//
// Same Pollinations URL builder as the web app, just hits fetch from
// Node and pipes the bytes to disk. Useful for batch generation or
// when you want to feed a prompt list through a shell loop.
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const prompt = process.argv.slice(2).join(' ');
if (!prompt) {
  console.error('Usage: node cli/generate.js "your prompt"');
  process.exit(1);
}

const params = new URLSearchParams({
  model: 'flux',
  width: '1024',
  height: '1024',
  seed: String(Math.floor(Math.random() * 1_000_000)),
  nologo: 'true',
  enhance: 'true',
});

const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
console.log(`Fetching: ${url}`);

const res = await fetch(url);
if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());

const outDir = 'generated';
await mkdir(outDir, { recursive: true });
const file = join(outDir, `${Date.now()}.png`);
await writeFile(file, buf);
console.log(`Saved: ${file}`);
