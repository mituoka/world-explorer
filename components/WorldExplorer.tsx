'use client';

import { useState } from 'react';
import { WORLDS_DATA } from '@/data/worlds';
import { useFavorites } from '@/hooks/useFavorites';
import { Sidebar } from './Sidebar';
import type { SelectedWorld } from './Sidebar';
import { DocumentPanel } from './DocumentPanel';

export function WorldExplorer() {
  const firstLargeId = WORLDS_DATA[0].id;
  const firstMedKey = `${firstLargeId}-0`;

  const [expandedLarge, setExpandedLarge] = useState<Set<string>>(new Set([firstLargeId]));
  const [expandedMedium, setExpandedMedium] = useState<Set<string>>(new Set([firstMedKey]));
  const [selected, setSelected] = useState<SelectedWorld>({
    largeId: firstLargeId,
    medIdx: 0,
    worldName: WORLDS_DATA[0].categories[0].worlds[0].name,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { favorites, toggle, isFavorite, mounted } = useFavorites();

  const handleToggleLarge = (id: string) => {
    setExpandedLarge(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleMedium = (key: string) => {
    setExpandedMedium(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSelectWorld = (largeId: string, medIdx: number, worldName: string) => {
    setSelected({ largeId, medIdx, worldName });
    // Auto-expand path if needed
    setExpandedLarge(prev => new Set([...prev, largeId]));
    setExpandedMedium(prev => new Set([...prev, `${largeId}-${medIdx}`]));
    setSearchQuery('');
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <Sidebar
        expandedLarge={expandedLarge}
        expandedMedium={expandedMedium}
        selected={selected}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleLarge={handleToggleLarge}
        onToggleMedium={handleToggleMedium}
        onSelectWorld={handleSelectWorld}
        isFavorite={isFavorite}
        mounted={mounted}
        favoritesSize={favorites.size}
      />
      <DocumentPanel
        selected={selected}
        isFavorite={isFavorite}
        onToggle={toggle}
        onSelectWorld={handleSelectWorld}
        mounted={mounted}
      />
    </div>
  );
}
