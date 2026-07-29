'use client'

import {
  Landmark,
  Heart,
  TrendingUp,
  Trophy,
  Building2,
  Drama,
  Shield,
  Monitor,
  GraduationCap,
  Globe,
  type LucideIcon,
} from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  icon: string
  order: number
}

const ICON_MAP: Record<string, LucideIcon> = {
  Landmark,
  Heart,
  TrendingUp,
  Trophy,
  Building2,
  Drama,
  Shield,
  Monitor,
  GraduationCap,
  Globe,
}

interface CategoriesSidebarProps {
  categories: CategoryItem[]
  onSelect: (category: string) => void
  selected?: string
}

export function CategoriesSidebar({
  categories,
  onSelect,
  selected,
}: CategoriesSidebarProps) {
  return (
    <aside className="bg-white rounded-lg p-5">
      <h2 className="text-[#C8102E] font-black text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#C8102E]" />
        Categorias
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((c) => {
          const Icon = ICON_MAP[c.icon] || Globe
          const isSelected = selected === c.name
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.name)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded text-left text-sm font-semibold transition-colors border ${
                isSelected
                  ? 'bg-[#C8102E] text-white border-[#C8102E]'
                  : 'bg-gray-50 text-black border-transparent hover:bg-gray-100 hover:border-[#C8102E]/30'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isSelected ? 'text-white' : 'text-[#C8102E]'
                }`}
              />
              <span className="truncate">{c.name}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
