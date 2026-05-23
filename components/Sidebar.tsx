'use client';

import { useState } from 'react';
import { ChevronRight, Search, X, Bookmark } from 'lucide-react';
import { WORLDS_DATA } from '@/data/worlds';

export interface SelectedWorld {
  largeId: string;
  medIdx: number;
  worldName: string;
}

interface SidebarProps {
  expandedLarge: Set<string>;
  expandedMedium: Set<string>;
  selected: SelectedWorld | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleLarge: (id: string) => void;
  onToggleMedium: (key: string) => void;
  onSelectWorld: (largeId: string, medIdx: number, worldName: string) => void;
  isFavorite: (name: string) => boolean;
  mounted: boolean;
  favoritesSize: number;
}

export function Sidebar({
  expandedLarge,
  expandedMedium,
  selected,
  searchQuery,
  onSearchChange,
  onToggleLarge,
  onToggleMedium,
  onSelectWorld,
  isFavorite,
  mounted,
  favoritesSize,
}: SidebarProps) {
  const [hoveredWorld, setHoveredWorld] = useState<string | null>(null);

  // Filter worlds for search
  const matchesSearch = (worldName: string, hint: string) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return worldName.toLowerCase().includes(q) || hint.toLowerCase().includes(q);
  };

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{ width: '272px', backgroundColor: 'var(--col-bg-1)', borderRight: '1px solid var(--col-border)' }}
    >
      {/* App title */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3.5 border-b"
        style={{ borderColor: 'var(--col-border)' }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            世界探索マップ
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-subtle)' }}>
            {mounted && favoritesSize > 0 && (
              <span className="inline-flex items-center gap-1">
                <Bookmark size={9} strokeWidth={2} className="fill-amber-400 text-amber-400" />
                <span style={{ color: '#fbbf24' }}>{favoritesSize} saved</span>
                <span className="mx-1">·</span>
              </span>
            )}
            SNSコンテンツ発掘ツール
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 px-3 py-2.5 border-b" style={{ borderColor: 'var(--col-border)' }}>
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="世界を検索..."
            className="w-full pl-7 pr-7 py-1.5 text-xs rounded-[var(--radius-sm)] border transition-all focus:outline-none focus:ring-1 focus:ring-white/20"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderColor: searchQuery ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: 'var(--text-subtle)' }}
            >
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <nav className="flex-1 overflow-y-auto py-2">
        {WORLDS_DATA.map(large => {
          const isLargeExpanded = expandedLarge.has(large.id);
          const LargeIcon = large.icon;

          // Check if any world matches search
          const hasSearchMatch = large.categories.some(m =>
            m.worlds.some(w => matchesSearch(w.name, w.hint))
          );
          if (searchQuery && !hasSearchMatch) return null;

          return (
            <div key={large.id}>
              {/* ── Large category row ── */}
              <button
                onClick={() => onToggleLarge(large.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-100 cursor-pointer focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--item-hover)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ChevronRight
                  size={12}
                  strokeWidth={2.5}
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: 'var(--text-subtle)',
                    transform: isLargeExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                />
                <LargeIcon
                  size={13}
                  strokeWidth={1.75}
                  style={{ color: large.accent, flexShrink: 0 }}
                />
                <span className="flex-1 text-xs font-semibold truncate">
                  {large.name.replace('の世界', '')}
                </span>
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                  {large.categories.reduce((s, c) => s + c.worlds.length, 0)}
                </span>
              </button>

              {/* ── Medium + World rows ── */}
              {isLargeExpanded && large.categories.map((medium, medIdx) => {
                const medKey = `${large.id}-${medIdx}`;
                const isMedExpanded = expandedMedium.has(medKey);
                const MedIcon = medium.icon;

                const matchingWorlds = medium.worlds.filter(w => matchesSearch(w.name, w.hint));
                if (searchQuery && matchingWorlds.length === 0) return null;

                return (
                  <div key={medKey}>
                    {/* Medium category row */}
                    <button
                      onClick={() => onToggleMedium(medKey)}
                      className="w-full flex items-center gap-2 pl-7 pr-3 py-1.5 text-left transition-colors duration-100 cursor-pointer focus:outline-none"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--item-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <ChevronRight
                        size={10}
                        strokeWidth={2.5}
                        className="flex-shrink-0 transition-transform duration-200"
                        style={{
                          color: 'var(--text-subtle)',
                          transform: isMedExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}
                      />
                      <MedIcon size={11} strokeWidth={1.75} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
                      <span className="flex-1 text-[11px] font-medium truncate">{medium.name}</span>
                      <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                        {searchQuery ? matchingWorlds.length : medium.worlds.length}
                      </span>
                    </button>

                    {/* World rows */}
                    {isMedExpanded && (searchQuery ? matchingWorlds : medium.worlds).map(world => {
                      const isSelected =
                        selected?.largeId === large.id &&
                        selected?.medIdx === medIdx &&
                        selected?.worldName === world.name;
                      const isHovered = hoveredWorld === `${large.id}-${medIdx}-${world.name}`;
                      const fav = mounted && isFavorite(world.name);

                      return (
                        <button
                          key={world.name}
                          onClick={() => onSelectWorld(large.id, medIdx, world.name)}
                          onMouseEnter={() => setHoveredWorld(`${large.id}-${medIdx}-${world.name}`)}
                          onMouseLeave={() => setHoveredWorld(null)}
                          className="relative w-full flex items-center gap-2 pl-12 pr-3 py-1.5 text-left transition-colors duration-100 cursor-pointer focus:outline-none"
                          style={{
                            backgroundColor: isSelected ? `${large.accent}18` : isHovered ? 'var(--item-hover)' : 'transparent',
                            color: isSelected ? large.accent : 'var(--text-muted)',
                          }}
                        >
                          {isSelected && (
                            <div
                              className="absolute left-0 top-0 bottom-0 w-[2px]"
                              style={{ backgroundColor: large.accent }}
                            />
                          )}
                          <div
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: isSelected ? large.accent : 'var(--text-subtle)' }}
                          />
                          <span className="flex-1 text-[11px] truncate">{world.name}</span>
                          {fav && (
                            <Bookmark
                              size={9}
                              strokeWidth={2}
                              className="flex-shrink-0 fill-amber-400 text-amber-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
