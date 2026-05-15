Day 34 - I built a Stable Diffusion playground in 200 lines. Zero API keys. Zero backend. Zero signup. Just a URL.


🚀TechFromZero Series - StableDiffusionFromZero


🌐 Try it live: https://stable-diffusion-from-zero.vercel.app


This isn't a Hello World. It's a real image-gen playground:
📐 Type prompt → hit Pollinations URL → FLUX/SDXL renders → PNG appears


🔗 The full code (with step-by-step commits you can follow):
https://github.com/dev48v/stable-diffusion-from-zero


🧱 What I built (step by step):

1️⃣ Pollinations URL builder — `image.pollinations.ai/prompt/{prompt}?model=flux&seed=42` is the entire API. One line.

2️⃣ React prompt composer — textarea + starter prompt chips (astronaut cat, cyberpunk Tokyo, fantasy island…) for instant inspiration

3️⃣ Model selector — flux, flux-realism, flux-anime, sdxl, sd3, dalle3. Each one a different brain, same URL pattern.

4️⃣ Seed control — same prompt + same seed = same image, byte for byte. Lock it to iterate; randomise it to explore.

5️⃣ Enhance toggle — Pollinations runs your prompt through a small LLM first, expanding "astronaut cat" → "a highly detailed astronaut cat in zero gravity, cinematic lighting, 4k". Beginner prompts become pro instantly.

6️⃣ localStorage gallery — last 50 generations persist across reloads. We store URLs, not pixels. 50 entries ≈ 20 KB.

7️⃣ Favorites + download + share — ★ a generation, download as PNG, copy link to share — all client-side.

8️⃣ Vercel zero-config deploy — static SPA, no env vars, no backend, no Docker. Ships in 10 seconds.


💡 Every file has detailed comments explaining WHY, not just what. Written for any beginner who wants to learn image generation by reading real code — with full clarity on each step.

👉 If you're a beginner learning Stable Diffusion, clone it and read the commits one by one. Each commit = one concept. Each file = one lesson. Built from scratch, so nothing is hidden.

🔥 This is Day 34 of a 50-day series. A new technology every day. Follow along!

🌐 See all days: https://dev48v.infy.uk/techfromzero.php

#TechFromZero #Day34 #StableDiffusion #AI #LearnByDoing #OpenSource #BeginnerGuide #100DaysOfCode #ImageGeneration
