# Stable Diffusion From Zero — Image-Gen Playground

Day 34 of TechFromZero. A free image-generation playground powered by **Pollinations.ai** — type a prompt, get a picture. Zero auth, zero backend, zero cost.

This is the *what* of generative AI explained the only way that actually clicks: by letting you generate 50 images in 5 minutes.

---

## Quick start

```bash
git clone https://github.com/dev48v/stable-diffusion-from-zero
cd stable-diffusion-from-zero

npm install
npm run dev
# open http://localhost:5173
```

That's it. No API key, no Docker, no server. The browser hits Pollinations' CDN directly and renders the response into an `<img>` tag.

### CLI alternative

```bash
node cli/generate.js "an astronaut riding a horse on Mars"
# Saves PNG to ./generated/
```

---

## What's in here

```
stable-diffusion-from-zero/
├── src/
│   ├── pollinations.ts    URL builder + model list + starter prompts
│   ├── storage.ts         localStorage gallery persistence
│   ├── types.ts           GeneratedImage shape
│   ├── App.tsx            single-page UI (composer + viewer + gallery)
│   └── index.css          indigo theme, dark mode
├── cli/
│   └── generate.js        Node CLI that fetches + writes PNG
├── ARTICLE.md             beginner-friendly tutorial article
├── LINKEDIN.md            LinkedIn post text
└── vercel.json            SPA rewrite
```

---

## Step-by-step build

Each commit on `main` is one self-contained concept:

1. **Vite + TypeScript skeleton** — gitignore, package.json, tsconfig
2. **Pollinations URL builder** — model enum, query params, starter prompts
3. **Image generation flow** — prompt input + generate button
4. **Model + dimensions selector** — flux / sdxl / sd3 / dalle3, square / portrait / landscape
5. **Seed control** — random or locked for reproducible images
6. **Image viewer** — full-size display with model/seed badges
7. **Gallery + localStorage persistence** — last 50 generations
8. **Favorites + download + share** — star a generation, save the PNG, copy the URL
9. **Filter favorites vs all** — toggle gallery view
10. **CLI tool** — same URL builder, fetch + save PNG locally
11. **Vercel deploy** — SPA rewrite, zero config
12. **README + ARTICLE** — this guide

---

## How it works

The whole API is one URL pattern:

```
https://image.pollinations.ai/prompt/<URL-encoded prompt>?model=flux&width=1024&height=1024&seed=42&nologo=true
```

Hit the URL in a browser tab. You get an image. That's the entire integration.

Models available:

| Model | What it's good at |
|-------|-------------------|
| `flux` | Default. Fast, photoreal, versatile. |
| `flux-realism` | Hyper-photographic faces and product shots. |
| `flux-anime` | Stylised anime / illustration. |
| `sdxl` | Stable Diffusion XL — classic, strong on composition. |
| `sd3` | Stable Diffusion 3 — best text rendering inside images. |
| `dalle3` | OpenAI's DALL·E 3 — concept-art friendly, lower fidelity. |

The same `seed` + same `prompt` returns the same image every time. Lock the seed to iterate on a composition; randomise it to explore variations.

---

## Why these choices

- **Pollinations.ai over Replicate/Hugging Face** — zero auth is a beginner superpower. No signup, no token, no quota anxiety. Beginner sees an image in 1 line of code.
- **No backend** — image bytes flow Pollinations → browser. We never touch them server-side. Saves a Docker image, a Render service, and 100% of cold-start latency.
- **localStorage for metadata** — we store *URLs*, not pixels. 50 generations = ~20 KB. localStorage caps at 5 MB; we're using 0.4% of it.
- **Auto-rolling seed** — every Generate click rerolls the seed automatically. That's how you get variety without thinking about it. Lock the input to keep one image's seed for variation later.
- **`enhance` defaults on** — Pollinations runs your prompt through a small LLM first to expand "astronaut cat" into "a highly detailed astronaut cat in zero gravity, cinematic lighting, 4k". Beginner prompts look pro instantly.

---

## Deployment

**Frontend** → Vercel. Static SPA build, no env vars needed (Pollinations endpoint is hardcoded).

No backend. No database. No managed services. The site can run on any static host (Vercel, Netlify, GitHub Pages, S3, even Infinityfree).

---

## What you'll learn reading this

- How modern text-to-image works at the API surface (you'll see it's one URL)
- The `seed` parameter and why reproducibility matters in generative art
- Why `enhance` (a small LLM rewriting your prompt) makes amateur prompts look professional
- React state management for a "generate → display → save → reload" loop
- localStorage as a free, durable, browser-native datastore
- The Vercel zero-config deploy flow for static React apps

Article: [`ARTICLE.md`](ARTICLE.md)
