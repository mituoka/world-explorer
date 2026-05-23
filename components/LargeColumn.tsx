'use client';

import { WORLDS_DATA } from '@/data/worlds';

interface LargeColumnProps {
  selectedLargeId: string;
  onSelect: (id: string) => void;
}

export function LargeColumn({ selectedLargeId, onSelect }: LargeColumnProps) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{
        width: '184px',
        backgroundColor: 'var(--col-bg-1)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <p
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text-subtle)' }}
        >
          Categories
        </p>
      </div>

      {/* List */}
      <nav className="flex-1 px-2 pb-4 space-y-0.5">
        {WORLDS_DATA.map(large => {
          const isSelected = large.id === selectedLargeId;
          const Icon = large.icon;
          const totalWorlds = large.categories.reduce((s, c) => s + c.worlds.length, 0);

          return (
            <button
              key={large.id}
              onClick={() => onSelect(large.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)]
                         text-left transition-all duration-150 focus:outline-none
                         focus:ring-1 focus:ring-white/15 cursor-pointer"
              style={{
                backgroundColor: isSelected ? 'var(--item-selected)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--item-hover)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }
              }}
              aria-current={isSelected ? 'page' : undefined}
            >
              {/* Left accent line */}
              {isSelected && (
                <div
                  className="absolute left-0 top-0 h-full w-[2px] rounded-r"
                  style={{ backgroundColor: large.accent }}
                />
              )}
              <Icon
                size={15}
                strokeWidth={isSelected ? 2 : 1.75}
                style={{
                  color: isSelected ? large.accent : 'var(--text-subtle)',
                  flexShrink: 0,
                }}
              />
              <span className="flex-1 text-xs font-medium truncate">
                {large.name.replace('の世界', '')}
              </span>
              <span
                className="text-[10px] tabular-nums"
                style={{ color: 'var(--text-subtle)' }}
              >
                {totalWorlds}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
