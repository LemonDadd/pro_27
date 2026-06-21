import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Destination } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { CONTINENT_LABELS } from '@/utils/display';

interface Props {
  destinations: (Destination & { matchScore?: number })[];
  showStatus?: boolean;
  visitedIds?: string[];
  wishlistIds?: string[];
}

export default function WorldMap({
  destinations,
  showStatus = false,
  visitedIds: externalVisited,
  wishlistIds: externalWishlist,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const wishlist = useUserStore((s) => s.wishlist);
  const visited = useUserStore((s) => s.visited);

  const effectiveVisited = externalVisited || visited;
  const effectiveWishlist = externalWishlist || wishlist;

  const getMarkerColor = (id: string) => {
    if (!showStatus) return '#F97316';
    if (effectiveVisited.includes(id)) return '#10B981';
    if (effectiveWishlist.includes(id)) return '#F43F5E';
    return '#0C4A6E';
  };

  const continentStats = destinations.reduce(
    (acc, d) => {
      acc[d.continent] = (acc[d.continent] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 overflow-hidden">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0C4A6E]">
              🌍 世界地图
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              点击标记查看目的地详情
            </p>
          </div>
          {showStatus && (
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                已去过
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                想去
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#0C4A6E]" />
                未探索
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#F0FDFA] p-4 sm:p-8">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="500" fill="url(#oceanGrad)" />

        <g fill="#CBD5E1" fillOpacity="0.6" stroke="#94A3B8" strokeWidth="0.5" strokeOpacity="0.3">
          <path d="M150,120 Q200,100 280,110 L320,160 Q300,200 250,220 L200,210 Q160,180 150,120 Z" />
          <path d="M450,80 Q520,60 600,70 L640,110 Q660,150 620,170 L560,160 Q480,140 450,80 Z" />
          <path d="M480,200 Q540,180 620,190 L680,230 Q700,280 650,320 L580,340 Q520,320 480,280 L460,240 Z" />
          <path d="M700,100 Q780,90 850,110 L880,150 Q870,200 820,210 L760,200 Q710,170 700,100 Z" />
          <path d="M100,280 Q160,260 220,270 L250,310 Q240,370 200,400 L150,390 Q110,360 100,320 Z" />
          <path d="M750,280 Q800,270 840,290 L860,340 Q850,400 800,420 L760,400 Q740,360 750,280 Z" />
        </g>

        {destinations.map((dest) => {
          const lat = dest.coordinates.lat;
          const lng = dest.coordinates.lng;
          const x = 500 + (lng / 180) * 450;
          const y = 250 - (lat / 90) * 200;
          const color = getMarkerColor(dest.id);
          const isHovered = hoveredId === dest.id;

          return (
            <g key={dest.id}>
              <Link to={`/destination/${dest.id}`}>
                {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill={color}
                  fillOpacity="0.2"
                  className="animate-ping"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 10 : 7}
                fill={color}
                stroke="white"
                strokeWidth="2"
                filter="url(#glow)"
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredId(dest.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
              </Link>
              {isHovered && (
                <g>
                  <rect
                    x={x - 60}
                    y={y - 50}
                    width="120"
                    height="40"
                    rx="8"
                    fill="white"
                    stroke={color}
                    strokeWidth="1"
                    filter="url(#glow)"
                  />
                  <text
                    x={x}
                    y={y - 32}
                    textAnchor="middle"
                    fill="#0C4A6E"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="Fraunces, serif"
                  >
                    {dest.name}
                  </text>
                  <text
                    x={x}
                    y={y - 18}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="10"
                  >
                    {dest.country}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        </svg>
      </div>

      <div className="p-6 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap gap-2">
          {Object.entries(continentStats).map(([continent, count]) => (
          <span
            key={continent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-medium ring-1 ring-slate-100"
          >
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            {CONTINENT_LABELS[continent as keyof typeof CONTINENT_LABELS]}: {count}
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}
