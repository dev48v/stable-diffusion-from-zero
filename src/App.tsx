// STEP 4–10 — Single-page UI. Generate → display → save to gallery.
//
// State design:
//   - `prompt`, `model`, `seed` etc → form inputs, reset between gens
//   - `gallery` → list of every generation, persisted to localStorage
//   - `current` → the image currently displayed (latest gen OR gallery click)
//   - `loading` → shows skeleton while Pollinations renders (5–20s)
//
// Why a single component? The whole app is ~150 lines of logic. Splitting
// into 5 components + context would add ceremony without buying anything.
// When this grows past 300 lines, then extract.
import { useEffect, useMemo, useState } from 'react';
import { buildImageUrl, STARTER_PROMPTS, type Model } from './pollinations';
import type { GeneratedImage } from './types';
import { loadGallery, saveGallery } from './storage';

const MODELS: Model[] = ['flux', 'flux-realism', 'flux-anime', 'sdxl', 'sd3', 'dalle3'];
const DIMENSIONS = [
  { label: 'Square 1024', w: 1024, h: 1024 },
  { label: 'Portrait 768×1152', w: 768, h: 1152 },
  { label: 'Landscape 1152×768', w: 1152, h: 768 },
  { label: 'Small 512', w: 512, h: 512 },
];

// Random seed = different image each gen with same prompt. The user
// can lock a seed via the input to reproduce a result exactly.
const randSeed = (): number => Math.floor(Math.random() * 1_000_000);

export const App = () => {
  const [prompt, setPrompt] = useState(STARTER_PROMPTS[0]);
  const [model, setModel] = useState<Model>('flux');
  const [dimIdx, setDimIdx] = useState(0);
  const [seed, setSeed] = useState<number>(randSeed());
  const [enhance, setEnhance] = useState(true);

  const [gallery, setGallery] = useState<GeneratedImage[]>(() => loadGallery());
  const [current, setCurrent] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveGallery(gallery);
  }, [gallery]);

  const dim = DIMENSIONS[dimIdx];

  const generate = (): void => {
    if (!prompt.trim()) return;
    const newSeed = seed;
    const url = buildImageUrl({
      prompt,
      model,
      width: dim.w,
      height: dim.h,
      seed: newSeed,
      enhance,
    });
    const item: GeneratedImage = {
      id: crypto.randomUUID().slice(0, 8),
      prompt,
      model,
      width: dim.w,
      height: dim.h,
      seed: newSeed,
      url,
      createdAt: Date.now(),
      favorited: false,
    };
    setLoading(true);
    setCurrent(item);
    setGallery((g) => [item, ...g]);
    // Auto-roll the seed for the next gen — but only after this one
    // is dispatched. User can lock it via the input if they want.
    setSeed(randSeed());
  };

  const toggleFavorite = (id: string): void => {
    setGallery((g) =>
      g.map((it) => (it.id === id ? { ...it, favorited: !it.favorited } : it)),
    );
    if (current?.id === id) {
      setCurrent({ ...current, favorited: !current.favorited });
    }
  };

  const removeItem = (id: string): void => {
    setGallery((g) => g.filter((it) => it.id !== id));
    if (current?.id === id) setCurrent(null);
  };

  const favoritedOnly = useMemo(() => gallery.filter((g) => g.favorited), [gallery]);
  const [showFavs, setShowFavs] = useState(false);
  const visible = showFavs ? favoritedOnly : gallery;

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-dot" />
          <span>Diffusion Playground</span>
          <span className="brand-tag">From Zero · Day 34</span>
        </div>
        <a
          href="https://github.com/dev48v/stable-diffusion-from-zero"
          target="_blank"
          rel="noreferrer noopener"
          className="header-link"
        >
          GitHub →
        </a>
      </header>

      <main className="main">
        <section className="composer">
          <h1>Type words. Get pictures.</h1>
          <p className="muted">Powered by Stable Diffusion + FLUX via Pollinations.ai — free, no signup.</p>

          <div className="presets">
            {STARTER_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                className="preset"
                onClick={() => setPrompt(p)}
                disabled={loading}
              >
                {p.slice(0, 60)}{p.length > 60 ? '…' : ''}
              </button>
            ))}
          </div>

          <textarea
            className="prompt-input"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            maxLength={500}
            placeholder="Describe the image you want..."
          />

          <div className="controls">
            <label className="ctrl">
              <span>Model</span>
              <select value={model} onChange={(e) => setModel(e.target.value as Model)} disabled={loading}>
                {MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="ctrl">
              <span>Size</span>
              <select value={dimIdx} onChange={(e) => setDimIdx(Number(e.target.value))} disabled={loading}>
                {DIMENSIONS.map((d, i) => (
                  <option key={d.label} value={i}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="ctrl">
              <span>Seed</span>
              <div className="seed-row">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  disabled={loading}
                />
                <button type="button" onClick={() => setSeed(randSeed())} className="seed-btn" disabled={loading}>🎲</button>
              </div>
            </label>
            <label className="ctrl checkbox">
              <input type="checkbox" checked={enhance} onChange={(e) => setEnhance(e.target.checked)} disabled={loading} />
              <span>Enhance prompt</span>
            </label>
          </div>

          <button className="gen-btn" onClick={generate} disabled={loading || !prompt.trim()} type="button">
            {loading ? '✨ Generating…' : '🎨 Generate image'}
          </button>
        </section>

        {current && (
          <section className="viewer">
            <div className={`stage ${loading ? 'stage-loading' : ''}`}>
              <img
                src={current.url}
                alt={current.prompt}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
                style={{ aspectRatio: `${current.width} / ${current.height}` }}
              />
              {loading && <div className="stage-spinner">Rendering…</div>}
            </div>
            <div className="viewer-meta">
              <div className="viewer-prompt">{current.prompt}</div>
              <div className="viewer-tags">
                <span className="tag">{current.model}</span>
                <span className="tag">{current.width}×{current.height}</span>
                <span className="tag">seed {current.seed}</span>
              </div>
              <div className="viewer-actions">
                <button
                  className={current.favorited ? 'fav active' : 'fav'}
                  onClick={() => toggleFavorite(current.id)}
                  type="button"
                >
                  {current.favorited ? '★ Favorited' : '☆ Favorite'}
                </button>
                <a href={current.url} download={`sdfz-${current.id}.png`} className="dl-btn">
                  ⬇ Download
                </a>
                <button className="share-btn" onClick={() => navigator.clipboard.writeText(current.url)} type="button">
                  🔗 Copy link
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="gallery-section">
          <div className="gallery-header">
            <h2>Gallery <span className="muted">({visible.length})</span></h2>
            <div className="gallery-filter">
              <button
                className={!showFavs ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setShowFavs(false)}
                type="button"
              >
                All
              </button>
              <button
                className={showFavs ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setShowFavs(true)}
                type="button"
              >
                ★ Favorites
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="empty">{showFavs ? 'No favorites yet.' : 'Generate your first image above.'}</div>
          ) : (
            <div className="gallery-grid">
              {visible.map((it) => (
                <div key={it.id} className="thumb" onClick={() => setCurrent(it)}>
                  <img src={it.url} alt={it.prompt} loading="lazy" />
                  {it.favorited && <span className="thumb-fav">★</span>}
                  <button
                    className="thumb-rm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(it.id);
                    }}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a href="https://dev48v.infy.uk" target="_blank" rel="noreferrer noopener">
          ← Back to dev48v.infy.uk
        </a>
        <span className="footer-sep">·</span>
        <a href="https://pollinations.ai" target="_blank" rel="noreferrer noopener">
          Powered by Pollinations.ai
        </a>
      </footer>
    </div>
  );
};
