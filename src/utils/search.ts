import Fuse from 'fuse.js';
import { Place } from '../types/food';

export function createSearchIndex(places: Place[]) {
  const options = {
    keys: [
      { name: 'name', weight: 0.35 },
      { name: 'enName', weight: 0.25 },
      { name: 'subcategory', weight: 0.15 },
      { name: 'plazaName', weight: 0.1 },
      { name: 'city', weight: 0.05 },
      { name: 'tags', weight: 0.05 },
      { name: 'dishes.name', weight: 0.05 },
      { name: 'description', weight: 0.05 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  };

  return new Fuse(places, options);
}

export function searchPlaces(fuse: Fuse<Place>, query: string, allPlaces: Place[]): Place[] {
  const trimmed = query.trim();
  if (!trimmed) return allPlaces;

  const results = fuse.search(trimmed);
  return results.map((res) => res.item);
}
