---
title: "I built a Stable Diffusion playground in 200 lines and zero API keys. Here's how."
published: false
description: "A walkthrough of how to generate AI images from text in a beginner-friendly playground. No signup, no Docker, no backend. Just a URL."
tags: stablediffusion, ai, beginners, javascript
cover_image: ""
canonical_url: ""
series: "TechFromZero"
---

The first time I generated an AI image, I expected the worst.

A signup page. Email verification. A "free trial" with a credit card on file. A Python SDK that wouldn't install. CUDA. A Hugging Face account.

None of that happened.

I typed a URL into my browser, pressed Enter, and waited five seconds. An image of an astronaut riding a horse on Mars appeared. I had not given anyone an email address. I had not installed anything.

That's the API I built Day 34 of [TechFromZero](https://dev48v.infy.uk/techfromzero.php) around: a free, zero-auth gateway called [Pollinations.ai](https://pollinations.ai) that hosts Stable Diffusion, FLUX, and a handful of other models behind a beautifully boring URL pattern.

If you've been putting off learning generative AI because the setup looked like Day 1 of a Computer Science PhD, this is your skip-the-cutscene button.

## The whole API, on one line

```
https://image.pollinations.ai/prompt/an+astronaut+cat?model=flux
```

Hit that URL. You get an image. That is the entire integration.

There is no JSON to parse. There is no SDK to install. There is no token to manage. The image flows from Pollinations' CDN straight into your browser's `<img>` tag, and your browser doesn't know or care that an AI generated it. As far as it's concerned, it loaded a picture.

Compared to the way the same task usually feels — *npm install some-sdk; set ANTHROPIC\_API\_KEY; add billing; wait for the cold start* — this is approximately 100% less ceremony.

## What I built

A single-page React app. You type a prompt, click Generate, and an image appears. The app remembers your last 50 generations in `localStorage` (metadata only — the images live on Pollinations' CDN), lets you favorite the ones you like, lock the seed for reproducible variations, and download any image as a PNG.

I deliberately kept the whole thing one React component (~200 lines). Splitting it across five files and a Redux store would have added zero clarity for the reader and a lot of noise.

**Tech:** Vite + React 19 + TypeScript + `localStorage`. **Backend:** none. **API keys:** zero. **Vercel deploy:** static SPA, ~10 seconds.

📸 Try it: [stable-diffusion-from-zero.vercel.app](https://stable-diffusion-from-zero.vercel.app)
🧑‍💻 Code: [github.com/dev48v/stable-diffusion-from-zero](https://github.com/dev48v/stable-diffusion-from-zero)

## The four parameters that matter

Pollinations supports a fistful of query params. Four of them are the ones a beginner cares about:

### `model`

Pick the generator. The defaults you'll actually want:

- `flux` — fast, photorealistic, great default.
- `flux-anime` — illustration / stylised art.
- `sdxl` — Stable Diffusion XL, the classic. Strong on composition.
- `sd3` — Stable Diffusion 3. Specifically good at rendering legible text inside images. Yes, the AI can write the word "BAKERY" on a shop sign now.
- `dalle3` — OpenAI's DALL·E 3 routed through Pollinations. Surreal, concept-art-friendly.

### `seed`

Same prompt + same seed = same image, byte for byte. This is the most important parameter beginners ignore.

Why? Because once you find a composition you like, you want to *iterate* — slightly different lighting, slightly different angle, but the same person. Lock the seed, change the prompt by one word at a time, and you can see what a single word does to the model's mental picture.

In the playground, every generation rolls a new random seed automatically. If you find one you like, copy the number, paste it back into the seed input, and lock it for the next try.

### `width` + `height`

Pollinations accepts almost any pixel size, but the model was trained on 1024×1024-ish inputs, so it's best at square (1024×1024) and gentle aspect ratios (768×1152 portrait, 1152×768 landscape). Push past 2048 in either direction and you'll start to see weird artifacts — extra fingers, fractal hair, that AI-image uncanny-valley vibe.

### `enhance`

Easily my favorite. With `enhance=true`, Pollinations runs your prompt through a small LLM *first*, expanding it into a more descriptive version before handing it to the image model.

So when you type **"astronaut cat"**, the LLM rewrites that to something like:

> "A highly detailed astronaut cat floating in zero gravity, photorealistic, cinematic lighting, 4k resolution, intricate space suit details, distant Earth in the background"

…and *then* the image model renders the expanded version. Your three-word prompt looks like it was written by someone who's been making Midjourney art for two years.

## Things I learned (and that beginners should know)

**Generated images aren't free in the legal sense.** Pollinations' terms permit personal use; many model licences (FLUX in particular) restrict commercial use. If you're shipping a product, read the licence of the specific model you're using before you sell anything you generated.

**The seed parameter is reproducibility, not randomness.** I used to think `seed=42` was "the 42nd image". It's not. It's the random-number-generator's starting state. Different prompts with `seed=42` produce wildly different images. The seed only "matches" when the prompt is also identical.

**Aspect ratio affects content.** Ask for "a portrait of a librarian" at 1024×1024 and you'll get the librarian centered with bookshelves around them. Ask for the same thing at 1152×768 and you'll get a wider shot — the librarian *plus* a reading nook. The model uses the canvas shape as a hint.

**`enhance` makes lazy prompts good.** Three words become twenty. The output looks 5× better. For 95% of users this is the right default, which is why my playground turns it on automatically.

## How to extend this

A few good next steps if you want to keep going:

1. **Inpainting** — Pollinations supports a `mask=` parameter for editing parts of an existing image. Add a brush tool.
2. **Image-to-image** — pass an existing image URL as a starting point. Useful for stylistic transfer.
3. **Batch generation** — fire off a 4×4 grid of variations on the same prompt with different seeds. Pollinations is happy to serve in parallel.
4. **Self-host** — Pollinations is open source. You can run the inference stack yourself on a GPU and avoid even the implicit dependency on someone else's free infrastructure.

## What's next in the series

This is Day 34 of TechFromZero — one new technology every day, built from scratch with detailed commits. Day 35 picks up the AI thread with **voice AI** (Whisper + Gemini + ElevenLabs).

If you're learning AI from a beginner background and want a curriculum that's actually fun, [follow along at dev48v.infy.uk/techfromzero](https://dev48v.infy.uk/techfromzero.php). Each day stands alone — start anywhere.

Generated AI images used to require a CS degree, a GPU, and a credit card. Now they require a browser tab. The barrier to creating with AI is gone. The only barrier left is curiosity.

Try a weird prompt. See what happens.
