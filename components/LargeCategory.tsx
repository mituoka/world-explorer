'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LargeCategory as LargeCategoryType } from '@/data/worlds';
import { MediumCategory } from './MediumCategory';

interface LargeCategoryProps {
  category: LargeCategoryType;
  isFavorite: (name: string) => boolean;
  onToggle: (name: string) => void;
  searchQuery: string;
}

export function LargeCategory({
  category,
  isFavorite,
  onToggle,
  searchQuery,
}: LargeCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalWorlds = category.categories.reduce(
    (sum, c) => sum + c.worlds.length,
    0
  );

  const matchingWorlds = searchQuery
    ? category.categories.reduce((sum, c) => {
        return (
          sum +
          c.worlds.filter(
            w =>
              w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              w.hint.toLowerCase().includes(searchQuery.toLowerCase())
          ).length
        );
      }, 0)
    : totalWorlds;

  if (searchQuery && matchingWorlds === 0) return null;

  const shouldForceOpen = searchQuery.length > 0 && matchingWorlds > 0;
  const expanded = isOpen || shouldForceOpen;

  const Icon = category.icon;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200"
      style={{
        borderColor: expanded ? `${category.accent}30` : 'rgba(255,255,255,0.06)',
        backgroundColor: '#10101c',
      }}
    >
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center gap-4 px-5 py-4
                   hover:bg-white/3 transition-colors duration-150
                   focus:outline-none focus:ring-2 focus:ring-white/15"
        aria-expanded={expanded}
      >
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: category.iconBg }}
        >
          <Icon size={22} style={{ color: category.accent }} strokeWidth={1.5} />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-base text-white">{category.name}</h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                color: category.accent,
                backgroundColor: `${category.accent}18`,
              }}
            >
              {searchQuery ? `${matchingWorlds}/` : ''}{totalWorlds} worlds
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">{category.desc}</p>
        </div>

        <ChevronDown
          size={16}
          className="text-slate-500 flex-shrink-0 transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          <div
            className="h-px w-full mb-4"
            style={{ backgroundColor: `${category.accent}20` }}
          />
          {category.categories.map(medium => (
            <MediumCategory
              key={medium.name}
              category={medium}
              accent={category.accent}
              isFavorite={isFavorite}
              onToggle={onToggle}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
