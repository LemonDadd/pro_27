import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Footprints, Trash2, Compass,
  ArrowRight, Move, Share2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EmptyState from '@/components/common/EmptyState';
import WishlistShareModal from '@/components/share/WishlistShareModal';
import destinations from '@/data/destinations';
import { useUserStore } from '@/store/useUserStore';
import type { Destination } from '@/types';
import {
  TAG_EMOJI, TAG_LABELS, BUDGET_SYMBOLS
} from '@/utils/display';
import { cn } from '@/lib/utils';

type TabKey = 'wishlist' | 'visited';

function QuickCard({
  destination,
  currentTab,
  onMove,
  onRemove,
}: {
  destination: Destination;
  currentTab: TabKey;
  onMove: () => void;
  onRemove: () => void;
}) {
  const isWishlist = currentTab === 'wishlist';

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/destination/${destination.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={destination.coverImage}
            alt={destination.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
            {destination.seasonalTags?.slice(0, 2).map((st) => (
              <span
                key={st}
                className="rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-sky-900 shadow-sm"
              >
                {st.includes('cherry') && '🌸'}
                {st.includes('lavender') && '💜'}
                {st.includes('aurora') && '🌌'}
                {st.includes('red') && '🍁'}
              </span>
            ))}
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <span className="text-xl font-bold text-orange-300 drop-shadow">
              {BUDGET_SYMBOLS[destination.budgetLevel]}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3
              className="font-serif text-2xl font-semibold leading-tight tracking-tight"
            >
              {destination.name}
            </h3>
            <div className="text-sm text-white/85 mt-0.5">
              {destination.country}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {destination.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-amber-50 text-amber-800 px-2.5 py-1 text-xs font-medium ring-1 ring-amber-100"
            >
              {TAG_EMOJI[t]} {TAG_LABELS[t]}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onRemove}
              className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
              title={isWishlist ? '从想去中移除' : '从足迹中移除'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onMove}
              className="p-2 rounded-full text-slate-400 hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/5 transition-all"
              title={isWishlist ? '移到已去过' : '移到想去清单'}
            >
              <Move className="w-4 h-4" />
            </button>
          </div>
          <Link
            to={`/destination/${destination.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
          >
            查看详情
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Wishlist() {
  const [activeTab, setActiveTab] = useState<TabKey>('wishlist');
  const [shareOpen, setShareOpen] = useState(false);
  const wishlistIds = useUserStore((s) => s.wishlist);
  const visitedIds = useUserStore((s) => s.visited);
  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const toggleVisited = useUserStore((s) => s.toggleVisited);
  const removeFromWishlist = useUserStore((s) => s.removeFromWishlist);
  const isInWishlist = useUserStore((s) => s.isInWishlist);
  const hasVisited = useUserStore((s) => s.hasVisited);

  const wishlistItems = useMemo(() => {
    return wishlistIds
      .map((id) => destinations.find((d) => d.id === id))
      .filter(Boolean) as Destination[];
  }, [wishlistIds]);

  const visitedItems = useMemo(() => {
    return visitedIds
      .map((id) => destinations.find((d) => d.id === id))
      .filter(Boolean) as Destination[];
  }, [visitedIds]);

  const currentItems = activeTab === 'wishlist' ? wishlistItems : visitedItems;

  const handleMove = (id: string) => {
    if (activeTab === 'wishlist') {
      toggleWishlist(id);
      if (!hasVisited(id)) toggleVisited(id);
    } else {
      toggleVisited(id);
      if (!isInWishlist(id)) toggleWishlist(id);
    }
  };

  const handleRemove = (id: string) => {
    if (activeTab === 'wishlist') {
      removeFromWishlist(id);
    } else {
      toggleVisited(id);
    }
  };

  return (
    <Layout
      flexCol
      extras={
        <WishlistShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={activeTab === 'wishlist' ? '愿望清单' : '足迹记录'}
          subtitle={
            activeTab === 'wishlist'
              ? `我想去的 ${currentItems.length} 个旅行目的地`
              : `我已经打卡的 ${currentItems.length} 个足迹`
          }
          accentBg={
            activeTab === 'wishlist'
              ? 'bg-gradient-to-br from-orange-400 to-orange-600'
              : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
          }
          icon={
            activeTab === 'wishlist' ? (
              <Heart className="w-7 h-7 fill-white" />
            ) : (
              <Footprints className="w-7 h-7" />
            )
          }
          items={currentItems}
        />
      }
    >
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F97316]/10 to-[#0C4A6E]/10 text-sm font-semibold text-[#0C4A6E] mb-4">
            {activeTab === 'wishlist' ? (
              <Heart className="w-4 h-4 text-[#F97316]" />
            ) : (
              <Footprints className="w-4 h-4 text-emerald-500" />
            )}
            我的旅行清单
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C4A6E] tracking-tight mb-3"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {activeTab === 'wishlist' ? '愿望清单' : '足迹记录'}
          </h1>
          <p className="text-slate-500 text-lg">
            {activeTab === 'wishlist'
              ? '收藏你心动的目的地，为下一次旅行做准备'
              : '记录你走过的每一个角落，见证旅途的成长'}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8 p-1.5 rounded-2xl bg-white shadow-md ring-1 ring-slate-100 w-fit">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200',
              activeTab === 'wishlist'
                ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-[#F97316]/25'
                : 'text-slate-500 hover:text-[#0C4A6E] hover:bg-slate-50'
            )}
          >
            <Heart className={cn(
              'w-4 h-4',
              activeTab === 'wishlist' && 'fill-white'
            )} />
            💖 想去清单
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-bold',
              activeTab === 'wishlist'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-500'
            )}>
              {wishlistItems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('visited')}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200',
              activeTab === 'visited'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-500 hover:text-[#0C4A6E] hover:bg-slate-50'
            )}
          >
            <Footprints className="w-4 h-4" />
            👣 已去过足迹
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-bold',
              activeTab === 'visited'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-500'
            )}>
              {visitedItems.length}
            </span>
          </button>
        </div>

        {currentItems.length === 0 ? (
          <EmptyState
            icon={
              activeTab === 'wishlist' ? (
                <Heart className="w-12 h-12 text-rose-400" />
              ) : (
                <Footprints className="w-12 h-12 text-emerald-400" />
              )
            }
            title={
              activeTab === 'wishlist'
                ? '还没有想去的目的地'
                : '还没有去过的足迹'
            }
            description={
              activeTab === 'wishlist'
                ? '快去首页发现心动的目的地，把它们加入你的愿望清单吧！'
                : '出去走走吧！世界那么大，总有一处风景值得你留下足迹。'
            }
            action={
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-[#F97316]/25"
              >
                <Compass className="w-4 h-4" />
                去首页发现目的地
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((dest, i) => (
                <div
                  key={dest.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <QuickCard
                    destination={dest}
                    currentTab={activeTab}
                    onMove={() => handleMove(dest.id)}
                    onRemove={() => handleRemove(dest.id)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#FEF3C7]/50 via-white to-[#E0F2FE]/50 ring-1 ring-[#0C4A6E]/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3
                    className="font-serif text-lg font-bold text-[#0C4A6E] mb-1"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    旅行进度小结
                  </h3>
                  <p className="text-sm text-slate-500">
                    已收藏 <span className="font-bold text-[#F97316]">{wishlistItems.length}</span> 个想去 · 
                    已打卡 <span className="font-bold text-emerald-500">{visitedItems.length}</span> 个足迹
                  </p>
                </div>
                <div className="flex gap-3">
                  {currentItems.length > 0 && (
                    <button
                      onClick={() => setShareOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white text-sm font-semibold shadow-lg shadow-[#F97316]/30 hover:shadow-xl hover:shadow-[#F97316]/40 hover:-translate-y-0.5 transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      分享截图
                    </button>
                  )}
                  <Link
                    to="/quiz"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#0C4A6E] text-sm font-semibold ring-1 ring-[#0C4A6E]/10 hover:ring-[#0C4A6E]/20 transition-all"
                  >
                    ✨ 快速推荐
                  </Link>
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0C4A6E] text-white text-sm font-semibold hover:bg-[#0B3D5A] transition-all"
                  >
                    <Footprints className="w-4 h-4" />
                    查看足迹地图
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
