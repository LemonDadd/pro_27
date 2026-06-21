import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Heart, Footprints, Globe, Compass,
  Trophy, BarChart3, ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WorldMap from '@/components/map/WorldMap';
import DestinationCard from '@/components/destination/DestinationCard';
import destinations from '@/data/destinations';
import { useUserStore } from '@/store/useUserStore';
import type { Destination, Continent } from '@/types';
import { CONTINENT_LABELS } from '@/utils/display';
import { cn } from '@/lib/utils';

function StatCard({
  icon: Icon, label, value, sublabel, gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sublabel?: string;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg ring-1 ring-slate-100 hover:shadow-xl transition-all duration-300">
      <div className={cn(
        'absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10',
        gradient
      )} />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            gradient
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div
          className="text-4xl font-bold tracking-tight text-[#0C4A6E] mb-1"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {value}
        </div>
        <div className="text-sm font-semibold text-slate-600">{label}</div>
        {sublabel && (
          <div className="text-xs text-slate-400 mt-1">{sublabel}</div>
        )}
      </div>
    </div>
  );
}

function ContinentBar({
  continent, count, total,
}: { continent: Continent; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#0C4A6E]">
          {CONTINENT_LABELS[continent]}
        </span>
        <span className="text-slate-500 font-medium tabular-nums">
          {count} 个
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out',
            'bg-gradient-to-r from-[#F97316] to-[#EA580C]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function FootprintMap() {
  const wishlistIds = useUserStore((s) => s.wishlist);
  const visitedIds = useUserStore((s) => s.visited);

  const mapDestinations = useMemo(() => {
    const relevantIds = new Set([...visitedIds, ...wishlistIds]);
    if (relevantIds.size === 0) return destinations;
    return destinations;
  }, [visitedIds, wishlistIds]);

  const visitedDestinations = useMemo(() => {
    return visitedIds
      .map((id) => destinations.find((d) => d.id === id))
      .filter(Boolean) as Destination[];
  }, [visitedIds]);

  const wishlistDestinations = useMemo(() => {
    return wishlistIds
      .map((id) => destinations.find((d) => d.id === id))
      .filter(Boolean) as Destination[];
  }, [wishlistIds]);

  const visitedCountries = useMemo(() => {
    const unique = new Set(visitedDestinations.map((d) => d.country));
    return unique.size;
  }, [visitedDestinations]);

  const visitedContinents = useMemo(() => {
    const unique = new Set(visitedDestinations.map((d) => d.continent));
    return unique.size;
  }, [visitedDestinations]);

  const continentDistribution = useMemo(() => {
    const dist = {} as Record<Continent, number>;
    const continents: Continent[] = ['asia', 'europe', 'americas', 'africa', 'oceania', 'middle-east'];
    continents.forEach((c) => { dist[c] = 0; });
    visitedDestinations.forEach((d) => {
      dist[d.continent] = (dist[d.continent] || 0) + 1;
    });
    return Object.entries(dist)
      .filter(([, c]) => c > 0 || true)
      .map(([continent, count]) => ({
        continent: continent as Continent,
        count,
      }))
      .filter((item) =>
        visitedDestinations.length === 0 ? true : item.count > 0
      );
  }, [visitedDestinations]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE]/30 via-white to-[#FEF3C7]/20 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-[#0C4A6E]/10 text-sm font-semibold text-[#0C4A6E] mb-4">
              <Globe className="w-4 h-4 text-[#F97316]" />
              我的旅行足迹
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C4A6E] tracking-tight mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              足迹世界地图
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              可视化你的旅行足迹，看看世界地图上，哪些角落已经留下了你的印记 ✨
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              icon={Footprints}
              label="已打卡目的地"
              value={visitedDestinations.length}
              sublabel={visitedDestinations.length > 0 ? '继续探索更多吧！' : '迈出第一步吧！'}
              gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={Heart}
              label="想去清单"
              value={wishlistDestinations.length}
              sublabel={wishlistDestinations.length > 0 ? '待完成的心愿' : '去收藏一些目的地吧'}
              gradient="bg-gradient-to-br from-rose-500 to-rose-600"
            />
            <StatCard
              icon={MapPin}
              label="已到访国家"
              value={visitedCountries}
              sublabel={`共覆盖 ${visitedContinents} 大洲`}
              gradient="bg-gradient-to-br from-[#0C4A6E] to-[#0369A1]"
            />
            <StatCard
              icon={Trophy}
              label="世界探索度"
              value={`${Math.min(100, Math.round((visitedDestinations.length / destinations.length) * 100))}%`}
              sublabel={`${visitedDestinations.length}/${destinations.length} 目的地`}
              gradient="bg-gradient-to-br from-[#F97316] to-[#EA580C]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <WorldMap
                destinations={mapDestinations}
                showStatus={true}
                visitedIds={visitedIds}
                wishlistIds={wishlistIds}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316]/10 to-[#0C4A6E]/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <h3
                    className="font-serif text-xl font-bold text-[#0C4A6E]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    大洲分布
                  </h3>
                </div>
                {continentDistribution.length === 0 || visitedDestinations.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">
                      还没有去过任何地方
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      你的第一张地图会是什么样？
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {continentDistribution.map((item) => (
                      <ContinentBar
                        key={item.continent}
                        continent={item.continent}
                        count={item.count}
                        total={visitedDestinations.length}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#F97316]/10 via-white to-[#0C4A6E]/10 rounded-2xl p-6 ring-1 ring-[#F97316]/10">
                <h4
                  className="font-serif text-lg font-bold text-[#0C4A6E] mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  <Compass className="w-5 h-5 text-[#F97316]" />
                  下一站去哪？
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  不知道下一站去哪？试试我们的快速推荐工具，3 道题找到最适合你的目的地！
                </p>
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#F97316]/25 transition-all duration-200 hover:scale-105"
                >
                  ✨ 快速推荐
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {visitedDestinations.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-bold text-[#0C4A6E] flex items-center gap-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  <Footprints className="w-6 h-6 text-emerald-500" />
                  已去过足迹
                </h2>
                <Link
                  to="/wishlist"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                >
                  查看全部
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                {visitedDestinations.slice(0, 6).map((d) => (
                  <div key={d.id} className="flex-shrink-0 w-72 sm:w-80">
                    <DestinationCard destination={d} compact />
                  </div>
                ))}
              </div>
            </section>
          )}

          {wishlistDestinations.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-bold text-[#0C4A6E] flex items-center gap-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  想去的地方
                </h2>
                <Link
                  to="/wishlist"
                  className="text-sm font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                >
                  查看全部
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                {wishlistDestinations.slice(0, 6).map((d) => (
                  <div key={d.id} className="flex-shrink-0 w-72 sm:w-80">
                    <DestinationCard destination={d} compact />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
