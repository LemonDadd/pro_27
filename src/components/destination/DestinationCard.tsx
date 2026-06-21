import { Link } from "react-router-dom";
import { MapPin, Calendar, Plane, Footprints, Eye } from "lucide-react";
import { useMemo } from "react";
import type { Destination } from "@/types";
import HeartButton from "@/components/common/HeartButton";
import RatingBar from "@/components/destination/RatingBar";
import {
  TAG_LABELS,
  TAG_EMOJI,
  BUDGET_SYMBOLS,
  SEASONAL_TAG_LABELS,
  VISA_LABELS,
  VISA_COLORS,
  FORMATTERS,
} from "@/utils/display";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

interface Props {
  destination: Destination;
  matchScore?: number;
  delay?: number;
  compact?: boolean;
}

export default function DestinationCard({
  destination,
  matchScore,
  delay = 0,
  compact = false,
}: Props) {
  const {
    id,
    name,
    country,
    tagline,
    coverImage,
    tags,
    seasonalTags,
    ratings,
    suggestedDays,
    budgetLevel,
    flightHoursFromShanghai,
    visaType,
  } = destination;

  const uniqueTags = useMemo(() => [...new Set(tags)], [tags]);

  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const toggleVisited = useUserStore((s) => s.toggleVisited);
  const isWished = useUserStore((s) => s.isInWishlist(id));
  const isVisited = useUserStore((s) => s.hasVisited(id));

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link to={`/destination/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={coverImage}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
            {seasonalTags?.slice(0, 2).map((st) => (
              <span
                key={st}
                className="rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-sky-900 shadow-sm"
              >
                {SEASONAL_TAG_LABELS[st]}
              </span>
            ))}
            {isVisited && (
              <span className="rounded-full bg-emerald-500 text-white px-2.5 py-1 text-xs font-medium shadow-sm flex items-center gap-1">
                <Footprints size={12} /> 已打卡
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur",
                VISA_COLORS[visaType],
              )}
            >
              {VISA_LABELS[visaType]}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-end justify-between gap-2 mb-1.5">
              <div>
                <h3 className="font-serif text-2xl font-semibold leading-tight tracking-tight">
                  {name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-white/85 mt-0.5">
                  <MapPin size={13} />
                  <span>{country}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-300 drop-shadow">
                  {BUDGET_SYMBOLS[budgetLevel]}
                </div>
                {typeof matchScore === "number" && (
                  <div className="text-[10px] text-white/70 font-medium">
                    匹配 {Math.round(matchScore)}
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-white/80 line-clamp-1 italic">
              {tagline}
            </p>
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {uniqueTags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full bg-amber-50 text-amber-800 px-2.5 py-1 text-xs font-medium ring-1 ring-amber-100"
            >
              {TAG_EMOJI[t]} {TAG_LABELS[t]}
            </span>
          ))}
        </div>

        {!compact && (
          <div className="space-y-2 pt-1">
            <RatingBar
              label="语言友好"
              value={ratings.languageFriendly}
              color="#0C4A6E"
            />
            <RatingBar
              label="安全指数"
              value={ratings.safety}
              color="#10B981"
            />
            <RatingBar
              label="物价指数"
              value={ratings.priceIndex}
              color="#F97316"
              inverse
            />
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span>
              {suggestedDays.min}-{suggestedDays.max} 天
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Plane size={13} />
            <span>{FORMATTERS.flight(flightHoursFromShanghai)}</span>
          </div>
          <div className="flex items-center gap-1">
            <HeartButton
              size="sm"
              active={isWished}
              onChange={(e) => {
                e?.stopPropagation?.();
                toggleWishlist(id);
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVisited(id);
              }}
              className={cn(
                "p-1.5 rounded-full transition-all",
                isVisited
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-slate-300 hover:text-slate-500 hover:bg-slate-50",
              )}
              title={isVisited ? "取消已去过" : "标记已去过"}
            >
              <Eye size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
