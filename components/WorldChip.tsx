'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import type { World } from '@/data/worlds';

interface WorldChipProps {
  world: World;
  accent: string;
  isFavorite: boolean;
  onToggle: (name: string) => void;
}

export function WorldChip({ world, accent, isFavorite, onToggle }: WorldChipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => onToggle(world.name)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                   border transition-all duration-200 hover:scale-105 active:scale-95
                   bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10
                   focus:outline-none focus:ring-2 focus:ring-white/20"
        style={{
          color: isFavorite ? accent : '#94a3b8',
          borderColor: isFavorite ? `${accent}40` : undefined,
          backgroundColor: isFavorite ? `${accent}12` : undefined,
        }}
        aria-label={`${world.name}${isFavorite ? 'をお気に入りから削除' : 'をお気に入りに追加'}`}
      >
        {isFavorite
          ? <BookmarkCheck size={11} strokeWidth={2} />
          : <Bookmark size={11} strokeWidth={1.75} className="text-slate-600" />
        }
        <span>{world.name}</span>
      </button>

      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                     w-72 p-3 rounded-xl text-xs leading-relaxed
                     bg-[#1a1a2e] border border-white/15 shadow-2xl
                     pointer-events-none"
          role="tooltip"
        >
          <div className="font-semibold mb-1" style={{ color: accent }}>
            {world.name}
          </div>
          <div className="text-slate-300">{world.hint}</div>
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: '#1a1a2e' }}
          />
        </div>
      )}
    </div>
  );
}
