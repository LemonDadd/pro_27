import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useFilterStore } from "@/store/useFilterStore";
import type { Tag } from "@/types";
import { TAG_LABELS, TAG_EMOJI } from "@/utils/display";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRandomClick: () => void;
}

const THEME_CHIPS: { key: Tag; label: string }[] = [
  { key: "beach", label: `${TAG_EMOJI.beach} ${TAG_LABELS.beach}` },
  { key: "ancient-city", label: `${TAG_EMOJI["ancient-city"]} ${TAG_LABELS["ancient-city"]}` },
  { key: "food", label: `${TAG_EMOJI.food} ${TAG_LABELS.food}` },
  { key: "nature", label: `${TAG_EMOJI.nature} ${TAG_LABELS.nature}` },
  { key: "solo-friendly", label: `${TAG_EMOJI["solo-friendly"]} ${TAG_LABELS["solo-friendly"]}` },
];

export default function HeroSection({
  searchQuery,
  onSearchChange,
  onRandomClick,
}: HeroSectionProps) {
  const toggleTheme = useFilterStore((s) => s.toggleTheme);
  const activeThemes = useFilterStore((s) => s.themes);
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery);

  const handleChipClick = (key: Tag) => {
    onSearchChange("");
    setSearchQuery("");
    toggleTheme(key);
    const gridEl = document.getElementById("destination-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[640px] sm:min-h-[720px]">
      <div className="absolute inset-0 animate-zoom-slow">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000&q=80"
          alt="旅行风景"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0C4A6E]/60 via-[#0C4A6E]/40 to-[#0C4A6E]/80" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20">
        <div className="text-center animate-fade-up">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-2xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            🌍 下一站，去哪？
          </h1>

          <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            从 100+ 精选目的地中，找到属于你的旅行灵感
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <div className="pl-6 pr-3">
                  <Search className="w-5 h-5 text-[#0C4A6E]/40" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="搜索目的地、国家、主题..."
                  className="flex-1 py-4 pr-3 text-[#0C4A6E] placeholder:text-[#0C4A6E]/35 bg-transparent outline-none text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      onSearchChange("");
                      setSearchQuery("");
                    }}
                    className="mr-2 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="清除搜索"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onRandomClick}
              className="group relative w-full sm:w-auto px-8 py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-full shadow-lg shadow-[#F97316]/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#F97316]/50"
            >
              <span className="relative z-10">🎲 给我 3 个随机灵感</span>
            </button>

            <Link
              to="/quiz"
              className="group relative w-full sm:w-auto px-8 py-3.5 border-2 border-white/90 hover:border-white text-white font-semibold rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>💡 3 道题快速匹配</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {THEME_CHIPS.map((chip) => {
              const isActive = activeThemes.includes(chip.key);
              return (
                <button
                  key={chip.key}
                  onClick={() => handleChipClick(chip.key)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 hover:-translate-y-0.5",
                    isActive
                      ? "bg-[#F97316] text-white border-[#F97316] shadow-lg shadow-[#F97316]/30"
                      : "bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border-white/20 hover:border-white/40",
                  )}
                >
                  {chip.label}
                  {isActive && (
                    <span className="ml-1.5 inline-flex items-center justify-center">
                      <X size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeThemes.length > 0 && (
            <p className="text-xs text-white/60 mt-3 animate-fade-in">
              💡 再次点击标签可取消筛选
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
