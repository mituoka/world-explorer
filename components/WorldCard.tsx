'use client';

import { Bookmark, BookmarkCheck, FileText } from 'lucide-react';
import type { World } from '@/data/worlds';

interface WorldCardProps {
  world: World;
  accent: string;
  isFavorite: boolean;
  onToggle: (name: string) => void;
}

export function WorldCard({ world, accent, isFavorite, onToggle }: WorldCardProps) {
  return (
    <article
      className="group relative flex flex-col gap-0 rounded-[var(--radius-lg)]
                 border transition-all duration-200 overflow-hidden cursor-default"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: isFavorite ? `${accent}50` : 'var(--card-border)',
      }}
    >
      {/* Left accent rail */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-200"
        style={{
          backgroundColor: accent,
          opacity: isFavorite ? 0.7 : 0,
        }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-200 opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: accent, opacity: isFavorite ? 0 : undefined }}
      />

      {/* Main content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-bold leading-snug"
            style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}
          >
            {world.name}
          </h3>
          <button
            onClick={() => onToggle(world.name)}
            className="flex-shrink-0 mt-0.5 p-1 rounded-[var(--radius-sm)]
                       transition-all duration-150 focus:outline-none
                       focus:ring-1 focus:ring-white/20"
            style={{ color: isFavorite ? accent : 'var(--text-subtle)' }}
            aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            {isFavorite
              ? <BookmarkCheck size={14} strokeWidth={2} />
              : <Bookmark size={14} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* Hint — full text, no truncate */}
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {world.hint}
        </p>
      </div>

      {/* Document placeholder — visual promise of future content */}
      <div
        className="mx-5 mb-5 rounded-[var(--radius-sm)] border border-dashed px-4 py-3
                   flex items-center gap-2 transition-colors duration-150 cursor-pointer
                   hover:border-white/20"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        title="ドキュメントを追加（準備中）"
      >
        <FileText size={12} strokeWidth={1.5} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
        <span style={{ color: 'var(--text-subtle)', fontSize: '0.72rem' }}>
          ドキュメント・画像を追加...
        </span>
      </div>
    </article>
  );
}
