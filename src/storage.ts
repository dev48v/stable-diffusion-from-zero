// STEP 8 — localStorage persistence for generated images + favorites.
//
// Why localStorage and not IndexedDB?
//   We store METADATA (prompt, seed, model, URL) — not the image
//   bytes. A URL is ~200 chars; 100 generations = 20KB. localStorage
//   is fine. The actual image is served from Pollinations' CDN every
//   time the URL is hit, so we never need to cache pixels locally.
import type { GeneratedImage } from './types';

const KEY = 'sdfz:gallery:v1';

export const loadGallery = (): GeneratedImage[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GeneratedImage[];
  } catch {
    // Corrupted JSON or storage disabled — start fresh.
    return [];
  }
};

export const saveGallery = (items: GeneratedImage[]): void => {
  try {
    // Keep the most recent 50 entries. localStorage caps around 5MB
    // per origin; 50 entries × ~1KB metadata = comfortably under cap.
    const capped = items.slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(capped));
  } catch {
    // Quota exceeded or storage disabled — fail silently. The image
    // is still on screen, user just can't refresh into history.
  }
};
