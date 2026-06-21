import { Search, Shuffle, Sparkles } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { cn } from '@/lib/utils';

interface Props {
  onRandomClick?: () => void;
}

export default function HeroSection({ onRandomClick }: Props) {
  const { searchQuery, setSearchQuery } = useFilterStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0C4A6E via-[#0369A1] to-[#0C4A6E]">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#F97316]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0EA5E9]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F97316]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 mb-6 animate-fade-down">
            <Sparkles className="w-4 h-4 text-[#F97316]" />
            <span className="text-sm text-white/80 font-medium">
              精选全球 <span className="text-[#F97316] font-bold">50+</span> 个心动目的地
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6 animate-fade-down"
            style={{ fontFamily: "'Fraunces', serif", animationDelay: '100ms' }}
          >
            发现下一次
            <span className="text-[#F97316"> 心动 </span>
            的目的地
          </h1>
          <p
            className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-down"
            style={{ animationDelay: '200ms' }}
          >
            从千年古都到热带海岛，从繁华都市到自然秘境，
            用智能筛选找到最适合你的旅行灵感
          </p>

          <div
            className="relative max-w-xl mx-auto mb-8 animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0C4A6E]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索目的地、国家、标签..."
                className={cn(
                  "w-full pl-14 pr-32 py-5 rounded-2xl text-[#0C4A6E] bg-white",
                  "placeholder:text-[#0C4A6E]/40 font-medium",
                  "shadow-2xl shadow-black/10",
                  "focus:outline-none focus:ring-4 focus:ring-[#F97316]/30",
                  "transition-all duration-300",
                  "text-base"
                )}
              />
              <button
                onClick={onRandomClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#F97316]/30 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Shuffle className="w-4 h-4" />
                随机选
              </button>
            </div>
          </div>

          <div
            className="flex flex-wrap justify-center gap-2 animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            {['🌸 樱花季', '🏖️ 海滩度假', '🏛️ 古城探索', '🍜 美食之旅', '🎒 独行友好'].map(
              (tag, i) => (
                <button
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{ animationDelay: `${500 + i * 50}ms` }}
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
