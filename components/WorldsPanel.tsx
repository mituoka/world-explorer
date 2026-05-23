'use client';

import { useMemo } from 'react';
import { Search, Bookmark } from 'lucide-react';
import { WORLDS_DATA } from '@/data/worlds';
import type { World, LargeCategory, MediumCategory } from '@/data/worlds';
import { WorldCard } from './WorldCard';

interface SearchResult {
  world: World;
  large: LargeCategory;
  medium: MediumCategory;
}

interface WorldsPanelProps {
  selectedLargeId: string;
  selectedMediumIdx: number;
  searchQuery: string;
  isFavorite: (name: string) => boolean;
  onToggle: (name: string) => void;
  mounted: boolean;
  favorites: Set<string>;
}

export function WorldsPanel({
  selectedLargeId,
  selectedMediumIdx,
  searchQuery,
  isFavorite,
  onToggle,
  mounted,
  favorites,
}: WorldsPanelProps) {
  const large = WORLDS_DATA.find(l => l.id === selectedLargeId)!;
  const medium = large.categories[selectedMediumIdx];
  const LargeIcon = large.icon;
  const MedIcon = medium.icon;

  const searchResults = useMemo((): SearchResult[] | null => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    for (const l of WORLDS_DATA) {
      for (const m of l.categories) {
        for (const w of m.worlds) {
          if (w.name.toLowerCase().includes(q) || w.hint.toLowerCase().includes(q)) {
            results.push({ world: w, large: l, medium: m });
          }
        }
      }
    }
    return results;
  }, [searchQuery]);

  const favoriteWorlds = useMemo(() => {
    if (!mounted) return [];
    const result: Array<{ world: World; large: LargeCategory }> = [];
    for (const l of WORLDS_DATA) {
      for (const m of l.categories) {
        for (const w of m.worlds) {
          if (favorites.has(w.name)) result.push({ world: w, large: l });
        }
      }
    }
    return result;
  }, [favorites, mounted]);

  const isSearching = searchResults !== null;

  return (
    <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#09091280' }}>
      {/* Panel header */}
      <header
        className="flex-shrink-0 px-7 pt-5 pb-4 border-b"
        style={{ borderColor: 'var(--col-border)' }}
      >
        {/* Breadcrumb */}
        {!isSearching && (
          <div className="flex items-center gap-1.5 mb-3">
            <LargeIcon size={11} strokeWidth={1.75} style={{ color: large.accent }} />
            <span className="text-[11px]" style={{ color: large.accent }}>
              {large.name.replace('の世界', '')}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>/</span>
            <MedIcon size={11} strokeWidth={1.75} style={{ color: 'var(--text-subtle)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>
              {medium.name}
            </span>
          </div>
        )}

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {isSearching ? `「${searchQuery}」の検索結果` : medium.name}
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
              {isSearching
                ? `${searchResults!.length} 件見つかりました`
                : `${medium.worlds.length} worlds`
              }
            </p>
          </div>

          {/* Accent stripe */}
          {!isSearching && (
            <div
              className="h-[3px] w-16 rounded-full mb-1.5 opacity-60"
              style={{ backgroundColor: large.accent }}
            />
          )}
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-10">

        {/* Favorites section — shown when not searching and there are favorites */}
        {!isSearching && mounted && favoriteWorlds.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark size={12} strokeWidth={2} className="fill-amber-400 text-amber-400" />
              <h3
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: '#fbbf24' }}
              >
                お気に入り
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                {favoriteWorlds.length}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
              {favoriteWorlds.map(({ world, large: l }) => (
                <WorldCard
                  key={world.name}
                  world={world}
                  accent={l.accent}
                  isFavorite={true}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search results */}
        {isSearching && (
          <>
            {searchResults!.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Search size={28} style={{ color: 'var(--text-subtle)' }} className="mb-3 opacity-40" />
                <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                  「{searchQuery}」に一致する世界が見つかりませんでした
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                {searchResults!.map(({ world, large: l }) => (
                  <WorldCard
                    key={`${l.id}-${world.name}`}
                    world={world}
                    accent={l.accent}
                    isFavorite={mounted && isFavorite(world.name)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Normal: selected medium category worlds */}
        {!isSearching && (
          <section>
            {medium.worlds.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                {medium.worlds.map(world => (
                  <WorldCard
                    key={world.name}
                    world={world}
                    accent={large.accent}
                    isFavorite={mounted && isFavorite(world.name)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
