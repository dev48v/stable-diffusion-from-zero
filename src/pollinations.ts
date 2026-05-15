// STEP 3 — Pollinations.ai URL builder.
//
// Pollinations.ai is a community-run AI image gateway. They host
// Stable Diffusion, FLUX, and a handful of other models behind a
// dead-simple URL convention:
//
//   https://image.pollinations.ai/prompt/<URL-encoded prompt>?<params>
//
// Hit the URL, you get an image back. No auth, no JSON, no SDK.
// This is the entire API. Perfect for a beginner-friendly playground.
//
// Why no API key?
//   Pollinations runs on donated GPU compute and is genuinely free
//   for any volume a learning project would hit. No signup, no
//   rate-limit gating — they throttle by IP if you abuse it.
//
// Supported query params (the useful subset):
//   model    flux | flux-realism | flux-anime | sdxl | sd3 | dalle3
//   width    pixel width  (def 1024)
//   height   pixel height (def 1024)
//   seed     integer — same seed + same prompt = same image (reproducible!)
//   nologo   true to drop the Pollinations watermark
//   private  true to skip the public feed (still public URL though)
//   enhance  true to let an LLM rewrite the prompt before generating

export type Model = 'flux' | 'flux-realism' | 'flux-anime' | 'sdxl' | 'sd3' | 'dalle3';

export interface GenParams {
  prompt: string;
  model?: Model;
  width?: number;
  height?: number;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}

export const buildImageUrl = (params: GenParams): string => {
  // encodeURIComponent handles the spaces, slashes, quotes — anything
  // that would break the URL path segment. Prompt goes in the path,
  // not the query string, because Pollinations parses it as a path
  // arg first.
  const path = encodeURIComponent(params.prompt.trim());

  const q = new URLSearchParams();
  q.set('model', params.model ?? 'flux');
  q.set('width', String(params.width ?? 1024));
  q.set('height', String(params.height ?? 1024));
  if (params.seed !== undefined) q.set('seed', String(params.seed));
  // Default to nologo = true. The watermark is not gated by their TOS
  // and most users find it intrusive in a learning demo.
  q.set('nologo', String(params.nologo ?? true));
  if (params.enhance) q.set('enhance', 'true');

  return `https://image.pollinations.ai/prompt/${path}?${q.toString()}`;
};

// List of suggested starter prompts the UI offers as one-click chips.
// Curated to show off variety: portrait, landscape, abstract, anime.
export const STARTER_PROMPTS: string[] = [
  'An astronaut riding a horse on Mars, cinematic lighting, 4k',
  'A cozy reading nook with a sleeping cat, watercolor painting',
  'Cyberpunk Tokyo street at night, neon reflections in rain',
  'A floating island with waterfalls, fantasy concept art',
  'Anime-style portrait of a librarian wizard surrounded by books',
  'Abstract liquid gold sculpture, studio photography, white background',
];
