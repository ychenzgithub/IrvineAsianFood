import { useState, useEffect, useMemo, useCallback } from 'react';
import { Place, FilterState, MainCategory, City, PriceLevel, BusinessStatus } from '../types/food';
import { INITIAL_PLACES } from '../data/initialPlaces';
import { createSearchIndex, searchPlaces } from '../utils/search';
import { calculateDistanceInMiles } from '../utils/formatters';
import { UserLocation } from './useGeolocation';

const STORAGE_KEY = 'irvine_asian_food_places_v6_verified_locations';
const FAVORITES_KEY = 'irvine_asian_food_favorites_v1';




export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  city: 'All',
  category: 'All',
  subcategory: 'All',
  plazaId: 'All',
  priceLevel: 'All',
  tags: [],
  status: 'All',
  onlyFavorites: false,
  sortBy: 'recommended',
};

export function usePlacesData(userLocation: UserLocation | null) {
  // Load saved places or fallback to INITIAL_PLACES
  const [places, setPlaces] = useState<Place[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load places from localStorage', e);
    }
    return INITIAL_PLACES;
  });

  // Favorites tracking
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load favorites', e);
    }
    return [];
  });

  // Selected Place for details view
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Sync places to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch (e) {
      console.error('Failed to save places to localStorage', e);
    }
  }, [places]);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = useCallback((placeId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(placeId);
      if (isFav) {
        return prev.filter((id) => id !== placeId);
      } else {
        return [...prev, placeId];
      }
    });
  }, []);

  // Add a single custom place (from Add modal or web update)
  const addPlace = useCallback((newPlace: Place) => {
    setPlaces((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === newPlace.id || (p.name === newPlace.name && p.city === newPlace.city));
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = { ...updated[existsIndex], ...newPlace };
        return updated;
      }
      return [newPlace, ...prev];
    });
  }, []);

  // Batch merge new places (from web discovery sync)
  const mergePlaces = useCallback((newPlaces: Place[]) => {
    setPlaces((prev) => {
      const map = new Map<string, Place>();
      prev.forEach((p) => map.set(p.id, p));
      newPlaces.forEach((p) => map.set(p.id, { ...map.get(p.id), ...p }));
      return Array.from(map.values());
    });
  }, []);

  // Reset database back to default
  const resetToDefault = useCallback(() => {
    setPlaces(INITIAL_PLACES);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Search index instance
  const fuseIndex = useMemo(() => createSearchIndex(places), [places]);

  // Filtered & Sorted Places
  const filteredPlaces = useMemo(() => {
    // 1. Search Query Fuzzy filter
    let results = searchPlaces(fuseIndex, filters.searchQuery, places);

    // 2. City filter
    if (filters.city !== 'All') {
      results = results.filter((p) => p.city === filters.city);
    }

    // 3. Category filter
    if (filters.category !== 'All') {
      results = results.filter((p) => p.category === filters.category);
    }

    // 4. Subcategory filter
    if (filters.subcategory !== 'All') {
      results = results.filter((p) => p.subcategory.includes(filters.subcategory));
    }

    // 5. Plaza filter
    if (filters.plazaId !== 'All') {
      results = results.filter((p) => p.plazaId === filters.plazaId);
    }

    // 6. Price Level filter
    if (filters.priceLevel !== 'All') {
      results = results.filter((p) => p.priceLevel === filters.priceLevel);
    }

    // 7. Status filter
    if (filters.status !== 'All') {
      results = results.filter((p) => p.status === filters.status);
    }

    // 8. Tags filter
    if (filters.tags.length > 0) {
      results = results.filter((p) =>
        filters.tags.every((tag) => p.tags.includes(tag))
      );
    }

    // 9. Only Favorites filter
    if (filters.onlyFavorites) {
      results = results.filter((p) => favorites.includes(p.id));
    }

    // 10. Sort By
    results = [...results].sort((a, b) => {
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      if (filters.sortBy === 'distance' && userLocation) {
        const distA = calculateDistanceInMiles(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistanceInMiles(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      }
      if (filters.sortBy === 'priceAsc') {
        return a.priceLevel.length - b.priceLevel.length;
      }
      if (filters.sortBy === 'priceDesc') {
        return b.priceLevel.length - a.priceLevel.length;
      }
      // default: recommended (coming_soon & grand_opening first or high rating)
      return (b.rating * 100 + b.reviewCount * 0.05) - (a.rating * 100 + a.reviewCount * 0.05);
    });

    return results;
  }, [places, fuseIndex, filters, favorites, userLocation]);

  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) return null;
    return places.find((p) => p.id === selectedPlaceId) || null;
  }, [places, selectedPlaceId]);

  return {
    places,
    filteredPlaces,
    favorites,
    selectedPlace,
    selectedPlaceId,
    filters,
    setFilters,
    setSelectedPlaceId,
    toggleFavorite,
    addPlace,
    mergePlaces,
    resetToDefault,
  };
}
