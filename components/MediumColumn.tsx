'use client';

import { WORLDS_DATA } from '@/data/worlds';

interface MediumColumnProps {
  selectedLargeId: string;
  selectedMediumIdx: number;
  onSelect: (idx: number) => void;
}

export function MediumColumn({
  selectedLargeId,
  selectedMediumIdx,
  onSelect,
}: MediumColumnProps) {
  const large = WORLDS_DATA.find(l => l.id === selectedLargeId);
  if (!large) return null;

  const LargeIcon = large.icon;

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{
        width: '212px',
        backgroundColor: 'var(--col-bg-2)',
      }}
    >
      {/* Header — shows current large category */}
      <div className="px-4 pt-5 pb-3 flex items-center gap-2">
        <LargeIcon
          size={14}
          strokeWidth={1.75}
          style={{ color: large.accent, flexShrink: 0 }}
        />
        <p
          className="text-xs font-semibold truncate"
          style={{ color: large.accent }}
        >
          {large.name.replace('の世界', '')}
        </p>
      </div>

      {/* Medium category list */}
      <nav className="flex-1 px-2 pb-4 space-y-0.5">
        {large.categories.map((medium, idx) => {
          const isSelected = idx === selectedMediumIdx;
          const Icon = medium.icon;

          return (
            <button
              key={medium.name}
              onClick={() => onSelect(idx)}
              className="relative w-full flex items-center gap-2.5 px-3 py-2.5
                         rounded-[var(--radius-md)] text-left transition-all duration-150
                         focus:outline-none focus:ring-1 focus:ring-white/15 cursor-pointer"
              style={{
                backgroundColor: isSelected ? `${large.accent}15` : 'transparent',
                color: isSelected ? large.accent : 'var(--text-muted)',
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
              {isSelected && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] rounded-r"
                  style={{ backgroundColor: large.accent }}
                />
              )}
              <Icon
                size={13}
                strokeWidth={isSelected ? 2 : 1.75}
                style={{ flexShrink: 0 }}
              />
              <span className="flex-1 text-xs font-medium truncate">{medium.name}</span>
              <span
                className="text-[10px] tabular-nums"
                style={{ color: isSelected ? `${large.accent}80` : 'var(--text-subtle)' }}
              >
                {medium.worlds.length}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom: category stats */}
      <div
        className="px-4 py-3 border-t text-[11px]"
        style={{ borderColor: 'var(--col-border)', color: 'var(--text-subtle)' }}
      >
        {large.categories.reduce((s, c) => s + c.worlds.length, 0)} worlds in {large.categories.length} topics
      </div>
    </aside>
  );
}
