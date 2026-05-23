'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, ImageIcon, FileText, BookOpen, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [docContent, setDocContent] = useState<string | null>(null);
  const [snsContent, setSnsContent] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [snsLoading, setSnsLoading] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setDocContent(null);
    setSnsContent(null);

    setDocLoading(true);
    fetch(`/api/docs?world=${encodeURIComponent(selected.worldName)}`)
      .then(r => r.json())
      .then(data => setDocContent(data.content ?? null))
      .catch(() => setDocContent(null))
      .finally(() => setDocLoading(false));

    setSnsLoading(true);
    fetch(`/api/sns?world=${encodeURIComponent(selected.worldName)}`)
      .then(r => r.json())
      .then(data => setSnsContent(data.content ?? null))
      .catch(() => setSnsContent(null))
      .finally(() => setSnsLoading(false));
  }, [selected?.worldName]);

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
  const related = medium.worlds.filter(w => w.name !== world.name);

  return (
    <main
      className="flex-1 flex overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* ── 左カラム: 記事 ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <article className="max-w-2xl mx-auto px-10 py-12">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-8">
            <LargeIcon size={11} strokeWidth={1.75} style={{ color: large.accent }} />
            <span className="text-xs" style={{ color: large.accent }}>
              {large.name.replace('の世界', '')}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>/</span>
            <MedIcon size={11} strokeWidth={1.75} style={{ color: 'var(--text-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{medium.name}</span>
          </nav>

          {/* Title */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold leading-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {world.name}
            </h1>
            <button
              onClick={() => onToggle(world.name)}
              className="flex-shrink-0 mt-1 p-2 rounded-[var(--radius-md)] transition-all duration-150 cursor-pointer focus:outline-none"
              style={{
                backgroundColor: fav ? `${large.accent}18` : 'rgba(255,255,255,0.04)',
                color: fav ? large.accent : 'var(--text-subtle)',
              }}
              aria-label={fav ? 'お気に入りから削除' : 'お気に入りに追加'}
            >
              {fav ? <BookmarkCheck size={16} strokeWidth={2} /> : <Bookmark size={16} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Accent divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[2px] w-10 rounded-full" style={{ backgroundColor: large.accent }} />
            <div className="h-[1px] flex-1 rounded-full" style={{ backgroundColor: 'var(--col-border)' }} />
          </div>

          {/* Summary */}
          <section className="mb-10">
            <h2 className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-subtle)' }}>概要</h2>
            <p className="text-base leading-[1.9]" style={{ color: 'var(--text-muted)' }}>{world.hint}</p>
          </section>

          {/* Image placeholder */}
          <section className="mb-10">
            <h2 className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-subtle)' }}>画像</h2>
            <div className="grid grid-cols-3 gap-2 rounded-[var(--radius-lg)] border border-dashed p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {[0, 1, 2].map(i => (
                <div key={i} className="aspect-square rounded-[var(--radius-md)] flex flex-col items-center justify-center gap-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.07)' }}>
                  <ImageIcon size={16} style={{ color: 'var(--text-subtle)' }} strokeWidth={1.25} />
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.65rem' }}>追加</span>
                </div>
              ))}
            </div>
          </section>

          {/* Document */}
          <section className="mb-10">
            <h2 className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-subtle)' }}>ドキュメント</h2>
            {docLoading ? (
              <div className="flex items-center gap-2 py-6" style={{ color: 'var(--text-subtle)' }}>
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: large.accent }} />
                <span className="text-xs">読み込み中...</span>
              </div>
            ) : docContent ? (
              <div className="prose-doc" style={{ '--accent': large.accent } as React.CSSProperties}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{docContent}</ReactMarkdown>
              </div>
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-dashed px-6 py-8 flex flex-col items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <FileText size={22} strokeWidth={1.25} style={{ color: 'var(--text-subtle)' }} />
                <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>まだドキュメントがありません</p>
                <p className="text-[11px] text-center" style={{ color: 'var(--text-subtle)', opacity: 0.6 }}>/world-research で記事を生成できます</p>
              </div>
            )}
          </section>

          {/* Related worlds */}
          {related.length > 0 && (
            <section>
              <h2 className="text-[10px] font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--text-subtle)' }}>同じカテゴリーの世界</h2>
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
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{w.name}</p>
                      <p className="text-xs line-clamp-1" style={{ color: 'var(--text-subtle)' }}>{w.hint.split('。')[0]}。</p>
                    </div>
                    <ArrowRight size={13} strokeWidth={1.75} className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: large.accent }} />
                  </button>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>

      {/* ── 右カラム: SNS投稿 ── */}
      <div
        className="w-80 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ borderLeft: '1px solid var(--col-border)' }}
      >
        {/* SNS header */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-5 py-4"
          style={{ borderBottom: '1px solid var(--col-border)' }}
        >
          <span style={{ fontSize: '0.85rem' }}>📱</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>SNS投稿</span>
          {snsContent && (
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ backgroundColor: `${large.accent}20`, color: large.accent }}
            >
              生成済
            </span>
          )}
        </div>

        {/* SNS content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {snsLoading ? (
            <div className="flex items-center gap-2 py-4" style={{ color: 'var(--text-subtle)' }}>
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: large.accent }} />
              <span className="text-xs">読み込み中...</span>
            </div>
          ) : snsContent ? (
            <div className="space-y-4">
              {/* Platform badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ backgroundColor: 'rgba(225,48,108,0.12)', color: '#e1306c' }}>
                  <span style={{ fontSize: '0.75rem' }}>📸</span>
                  Instagram
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '0.75rem' }}>𝕏</span>
                  X
                </div>
              </div>
              <div className="prose-doc prose-sns" style={{ '--accent': large.accent } as React.CSSProperties}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{snsContent}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span style={{ fontSize: '1.75rem', opacity: 0.4 }}>📱</span>
              <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>SNS投稿がありません</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-subtle)', opacity: 0.5 }}>
                /world-sns で<br />投稿を生成できます
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
