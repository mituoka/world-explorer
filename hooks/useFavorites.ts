'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'world-explorer-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored) as string[]));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const toggle = useCallback((worldName: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(worldName)) {
        next.delete(worldName);
      } else {
        next.add(worldName);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (worldName: string) => favorites.has(worldName),
    [favorites]
  );

  return { favorites, toggle, isFavorite, mounted };
}
