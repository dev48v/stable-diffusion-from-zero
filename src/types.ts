import type { Model } from './pollinations';

export interface GeneratedImage {
  id: string;
  prompt: string;
  model: Model;
  width: number;
  height: number;
  seed: number;
  url: string;
  createdAt: number;
  favorited: boolean;
}
