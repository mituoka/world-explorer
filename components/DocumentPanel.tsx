'use client';

import { Bookmark, BookmarkCheck, ImageIcon, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { WORLDS_DATA } from '@/data/worlds';
import type { SelectedWorld } from './Sidebar';

interface DocumentPanelProps {
  selected: SelectedWorld | null;
  isFavorite: (name: string) => boolean;
  onToggle: (name: string) => void;
  onSelectWorld: (largeId: string, medIdx: number, worldName: string) => void;
  mounted: boolean;
}

export function DocumentPanel({
  selected,
  isFavorite,
  onToggle,
  onSelectWorld,
  mounted,
}: DocumentPanelProps) {
  if (!selected) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <BookOpen size={32} style={{ color: 'var(--text-subtle)' }} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
            サイドバーから世界を選択してください
          </p>
        </div>
      </main>
    );
  }

  const large = WORLDS_DATA.find(l => l.id === selected.largeId)!;
  const medium = large.categories[selected.medIdx];
  const world = medium.worlds.find(w => w.name === selected.worldName)!;
  const fav = mounted && isFavorite(world.name);
  const LargeIcon = large.icon;
  const MedIcon = medium.icon;

  // Related worlds: same medium category, excluding current
  const related = medium.worlds.filter(w => w.name !== world.name);

  return (
    <main
      className="flex-1 flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Document scroll area */}
      <div className="flex-1 overflow-y-auto">
        <article className="max-w-2xl mx-auto px-10 py-12">

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-1.5 mb-8">
            <LargeIcon size={11} strokeWidth={1.75} style={{ color: large.accent }} />
            <span className="text-xs" style={{ color: large.accent }}>
              {large.name.replace('の世界', '')}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>/</span>
            <MedIcon size={11} strokeWidth={1.75} style={{ color: 'var(--text-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              {medium.name}
            </span>
          </nav>

          {/* ── Title ── */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1
              className="text-3xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              {world.name}
            </h1>
            <button
              onClick={() => onToggle(world.name)}
              className="flex-shrink-0 mt-1 p-2 rounded-[var(--radius-md)] transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
              style={{
                backgroundColor: fav ? `${large.accent}18` : 'rgba(255,255,255,0.04)',
                color: fav ? large.accent : 'var(--text-subtle)',
              }}
              aria-label={fav ? 'お気に入りから削除' : 'お気に入りに追加'}
            >
              {fav
                ? <BookmarkCheck size={16} strokeWidth={2} />
                : <Bookmark size={16} strokeWidth={1.5} />
              }
            </button>
          </div>

          {/* ── Accent divider ── */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[2px] w-10 rounded-full" style={{ backgroundColor: large.accent }} />
            <div className="h-[1px] flex-1 rounded-full" style={{ backgroundColor: 'var(--col-border)' }} />
          </div>

          {/* ── Summary / Lede ── */}
          <section className="mb-10">
            <h2
              className="text-[10px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: 'var(--text-subtle)' }}
            >
              概要
            </h2>
            <p
              className="text-base leading-[1.9]"
              style={{ color: 'var(--text-muted)' }}
            >
              {world.hint}
            </p>
          </section>

          {/* ── Image placeholder ── */}
          <section className="mb-10">
            <h2
              className="text-[10px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: 'var(--text-subtle)' }}
            >
              画像
            </h2>
            <div
              className="grid grid-cols-3 gap-2 rounded-[var(--radius-lg)] overflow-hidden border border-dashed p-4"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="aspect-square rounded-[var(--radius-md)] flex flex-col items-center justify-center gap-1.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.07)' }}
                >
                  <ImageIcon size={16} style={{ color: 'var(--text-subtle)' }} strokeWidth={1.25} />
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.65rem' }}>追加</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Document / Notes placeholder ── */}
          <section className="mb-10">
            <h2
              className="text-[10px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: 'var(--text-subtle)' }}
            >
              ドキュメント
            </h2>
            <div
              className="rounded-[var(--radius-lg)] border border-dashed px-6 py-8 flex flex-col items-center gap-2"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <FileText size={22} strokeWidth={1.25} style={{ color: 'var(--text-subtle)' }} />
              <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>
                まだドキュメントがありません
              </p>
              <p className="text-[11px] text-center" style={{ color: 'var(--text-subtle)', opacity: 0.6 }}>
                マークダウン・メモを追加してコンテンツを充実させましょう
              </p>
            </div>
          </section>

          {/* ── Related worlds ── */}
          {related.length > 0 && (
            <section>
              <h2
                className="text-[10px] font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'var(--text-subtle)' }}
              >
                同じカテゴリーの世界
              </h2>
              <div className="space-y-2">
                {related.map(w => (
                  <button
                    key={w.name}
                    onClick={() => onSelectWorld(selected.largeId, selected.medIdx, w.name)}
                    className="group w-full flex items-start gap-3 px-4 py-3 rounded-[var(--radius-md)] text-left transition-all duration-150 cursor-pointer focus:outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${large.accent}40`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--card-border)')}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {w.name}
                      </p>
                      <p className="text-xs line-clamp-1" style={{ color: 'var(--text-subtle)' }}>
                        {w.hint.split('。')[0]}。
                      </p>
                    </div>
                    <ArrowRight
                      size={13}
                      strokeWidth={1.75}
                      className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: large.accent }}
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

        </article>
      </div>
    </main>
  );
}
