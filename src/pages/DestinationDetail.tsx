import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Plane, ArrowLeft,
  Globe, Shield, Banknote, Plug, Clock, FileCheck2,
  Eye, Sparkles
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import RingProgress from '@/components/common/RingProgress';
import ImageCarousel from '@/components/common/ImageCarousel';
import HeartButton from '@/components/common/HeartButton';
import EmptyState from '@/components/common/EmptyState';
import DestinationCard from '@/components/destination/DestinationCard';
import destinations from '@/data/destinations';
import { useUserStore } from '@/store/useUserStore';
import {
  TAG_LABELS, TAG_EMOJI, BUDGET_SYMBOLS, VISA_LABELS,
  HIGHLIGHT_INFO, SAFETY_LABELS,
  MONTH_SHORT_LABELS, CONTINENT_LABELS
} from '@/utils/display';
import { cn } from '@/lib/utils';

function BestMonthsMatrix({ bestMonths }: { bestMonths: number[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-100">
      <h3 className="font-serif text-xl font-bold text-[#0C4A6E] mb-5 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#F97316]" />
        最佳出行月份
      </h3>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const isBest = bestMonths.includes(m);
          return (
            <div
              key={m}
              className={cn(
                'relative group flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200',
                isBest
                  ? 'bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-[#F97316]/20 scale-[1.02]'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              )}
            >
              <span className={cn(
                'text-xs font-bold',
                isBest ? 'text-white/90' : 'text-slate-400'
              )}>
                {MONTH_SHORT_LABELS[m]}
              </span>
              {isBest && (
                <Sparkles className="w-3.5 h-3.5 mt-0.5 text-white/90" />
              )}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className={cn(
                  'px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shadow-lg',
                  isBest
                    ? 'bg-[#0C4A6E] text-white'
                    : 'bg-slate-700 text-white'
                )}>
                  {isBest ? '🌟 推荐' : '平时可去'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HighlightCard({
  highlight, index,
}: { highlight: typeof destinations[number]['highlights'][number]; index: number }) {
  const info = HIGHLIGHT_INFO[highlight.type];
  const isReversed = index % 2 === 1;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white shadow-md ring-1 ring-slate-100 hover:shadow-xl transition-all duration-300',
        isReversed && 'sm:flex-row-reverse'
      )}
    >
      <div className="sm:w-1/3 flex-shrink-0">
        <div className={cn(
          'w-full h-32 sm:h-full rounded-xl flex items-center justify-center text-6xl',
          'bg-gradient-to-br from-[#FEF3C7]/50 to-[#F97316]/10'
        )}>
          {info.emoji}
        </div>
      </div>
      <div className="sm:w-2/3 flex flex-col justify-center">
        <div className={cn(
          'inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold mb-3',
          info.color
        )}>
          <span>{info.emoji}</span>
          <span>{info.label}</span>
        </div>
        <h4 className="font-serif text-xl font-bold text-[#0C4A6E] mb-2">
          {highlight.title}
        </h4>
        <p className="text-slate-600 leading-relaxed">
          {highlight.desc}
        </p>
      </div>
    </div>
  );
}

function PracticalCard({
  icon: Icon, label, value,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white shadow-md ring-1 ring-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0C4A6E]/10 to-[#F97316]/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-[#0C4A6E]" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-slate-400 font-medium mb-1">{label}</div>
          <div className="font-semibold text-[#0C4A6E] truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const toggleVisited = useUserStore((s) => s.toggleVisited);
  const isInWishlist = useUserStore((s) => s.isInWishlist);
  const hasVisited = useUserStore((s) => s.hasVisited);

  const destination = useMemo(() => {
    return destinations.find((d) => d.id === id);
  }, [id]);

  const similarDestinations = useMemo(() => {
    if (!destination) return [];
    return destination.similarDestinations
      .map((sid) => destinations.find((d) => d.id === sid))
      .filter(Boolean) as typeof destinations;
  }, [destination]);

  if (!destination) {
    return (
      <Layout flexCol>
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState
            title="找不到这个目的地"
            description="这个目的地可能已经被移除，或者链接有误"
            action={
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-[#F97316]/25"
              >
                <ArrowLeft className="w-4 h-4" />
                返回首页
              </Link>
            }
          />
        </div>
      </Layout>
    );
  }

  const wished = isInWishlist(destination.id);
  const visited = hasVisited(destination.id);

  return (
    <Layout>
      <div className="relative h-screen">
        <ImageCarousel
          images={destination.gallery}
          alt={destination.name}
          className="h-screen rounded-none"
          showControls={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 sm:left-8 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur text-[#0C4A6E] font-semibold text-sm hover:bg-white transition-all duration-200 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[#0C4A6E] text-xs font-semibold">
                <MapPin className="w-3 h-3" />
                {destination.country} · {CONTINENT_LABELS[destination.continent]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F97316]/90 backdrop-blur text-white text-xs font-semibold">
                {BUDGET_SYMBOLS[destination.budgetLevel]} 预算
              </span>
              {destination.seasonalTags?.map((st) => (
                <span
                  key={st}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[#0C4A6E] text-xs font-semibold"
                >
                  {st.includes('cherry') && '🌸'}
                  {st.includes('lavender') && '💜'}
                  {st.includes('aurora') && '🌌'}
                  {st.includes('red') && '🍁'}
                  {st}
                </span>
              ))}
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {destination.name}
              <span className="text-xl sm:text-2xl font-normal ml-3 text-white/70">
                {destination.nameEn}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/85 italic max-w-2xl">
              {destination.tagline}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 sm:right-8 z-10 flex flex-col gap-3">
          <HeartButton
            size="lg"
            active={wished}
            onChange={() => toggleWishlist(destination.id)}
            className="shadow-xl !p-4"
          />
          <button
            onClick={() => toggleVisited(destination.id)}
            className={cn(
              'w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-200',
              visited
                ? 'bg-emerald-500 text-white'
                : 'bg-white/90 backdrop-blur text-slate-500 hover:text-emerald-600 hover:bg-white'
            )}
            title={visited ? '取消打卡' : '我已打卡'}
          >
            <Eye className="w-6 h-6" />
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section>
          <div className="flex flex-wrap gap-2 mb-6">
            {destination.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 text-amber-800 text-sm font-medium ring-1 ring-amber-100"
              >
                {TAG_EMOJI[t]} {TAG_LABELS[t]}
              </span>
            ))}
          </div>
          <p className="text-lg text-slate-700 leading-relaxed max-w-4xl">
            {destination.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F97316]" />
              建议 {destination.suggestedDays.min}-{destination.suggestedDays.max} 天
            </span>
            <span className="flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-[#F97316]" />
              上海出发 {destination.flightHoursFromShanghai} 小时
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-[#F97316]" />
              {VISA_LABELS[destination.visaType]}
            </span>
          </div>
        </section>

        <section className="bg-gradient-to-br from-slate-50 to-[#FEF3C7]/30 rounded-3xl p-8 lg:p-10">
          <h2 className="font-serif text-2xl font-bold text-[#0C4A6E] mb-8 text-center">
            综合评分
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <RingProgress
              value={destination.ratings.languageFriendly}
              label="语言友好度"
              progressColor="#0C4A6E"
              valueColor="#0C4A6E"
            />
            <RingProgress
              value={destination.ratings.safety}
              label="安全指数"
              progressColor="#10B981"
              valueColor="#10B981"
            />
            <RingProgress
              value={destination.ratings.priceIndex}
              label="物价友好度"
              progressColor="#F97316"
              valueColor="#F97316"
              inverse
              inverseHint
            />
          </div>
        </section>

        <BestMonthsMatrix bestMonths={destination.bestMonths} />

        <section>
          <h2 className="font-serif text-2xl font-bold text-[#0C4A6E] mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#F97316]" />
            亮点推荐
          </h2>
          <div className="space-y-5">
            {destination.highlights.map((h, i) => (
              <HighlightCard key={h.title} highlight={h} index={i} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-[#0C4A6E] mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#F97316]" />
            实用信息
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PracticalCard
              icon={Banknote}
              label="货币"
              value={destination.practical.currency}
            />
            <PracticalCard
              icon={Globe}
              label="语言"
              value={destination.practical.language}
            />
            <PracticalCard
              icon={Plug}
              label="电源插头"
              value={destination.practical.plug}
            />
            <PracticalCard
              icon={Clock}
              label="时区"
              value={destination.practical.timezone}
            />
            <PracticalCard
              icon={Shield}
              label="安全等级"
              value={SAFETY_LABELS[destination.practical.safetyLevel]}
            />
            <PracticalCard
              icon={FileCheck2}
              label="签证"
              value={VISA_LABELS[destination.visaType]}
            />
          </div>
        </section>

        {similarDestinations.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-[#0C4A6E] mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-[#F97316]" />
              类似目的地
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {similarDestinations.map((d) => (
                <div key={d.id} className="flex-shrink-0 w-72 sm:w-80">
                  <DestinationCard destination={d} compact />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
