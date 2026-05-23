'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MediumCategory as MediumCategoryType } from '@/data/worlds';
import { WorldChip } from './WorldChip';

interface MediumCategoryProps {
  category: MediumCategoryType;
  accent: string;
  isFavorite: (name: string) => boolean;
  onToggle: (name: string) => void;
  searchQuery: string;
}

export function MediumCategory({
  category,
  accent,
  isFavorite,
  onToggle,
  searchQuery,
}: MediumCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredWorlds = searchQuery
    ? category.worlds.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.hint.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : category.worlds;

  if (searchQuery && filteredWorlds.length === 0) return null;

  const shouldForceOpen = searchQuery.length > 0 && filteredWorlds.length > 0;
  const expanded = isOpen || shouldForceOpen;

  const Icon = category.icon;

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3
                   bg-white/3 hover:bg-white/6 transition-colors duration-150
                   focus:outline-none focus:ring-2 focus:ring-white/15"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={14} className="text-slate-400 flex-shrink-0" strokeWidth={1.75} />
          <span className="text-sm font-medium text-slate-200">{category.name}</span>
          <span className="text-xs text-slate-600">
            {filteredWorlds.length}/{category.worlds.length}
          </span>
        </div>
        <ChevronDown
          size={13}
          className="text-slate-600 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {expanded && (
        <div className="px-4 py-3 flex flex-wrap gap-2 bg-black/15">
          {filteredWorlds.map(world => (
            <WorldChip
              key={world.name}
              world={world}
              accent={accent}
              isFavorite={isFavorite(world.name)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
