import { ArrowUpDown, Wallet, Clock, Star, Map, LayoutGrid, SlidersHorizontal } from "lucide-react";
import type { SortBy } from "@/types";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: SortBy; label: string; icon: React.ReactNode }[] = [
  { value: "match", label: "匹配度", icon: <Star size={15} /> },
  { value: "budget-asc", label: "预算从低到高", icon: <Wallet size={15} /> },
  {
    value: "flight-asc",
    label: "飞行时间由短到长",
    icon: <Clock size={15} />,
  },
  { value: "recommend", label: "推荐指数", icon: <Star size={15} /> },
];

interface Props {
  total: number;
  viewMode: "grid" | "map";
  onToggleView: (v: "grid" | "map") => void;
  onOpenFilter?: () => void;
}

export default function SortControls({ total, viewMode, onToggleView, onOpenFilter }: Props) {
  const { sortBy, setSortBy } = useFilterStore();
  const activeFilterCount = useFilterStore((s) =>
    s.budgetLevels.length +
    s.months.length +
    s.dayRanges.length +
    s.themes.length +
    s.flightDurations.length +
    s.visaTypes.length +
    s.popularity.length +
    s.seasonalTags.length
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl px-5 py-3 shadow-md ring-1 ring-slate-100 mb-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium">
          <ArrowUpDown size={15} />
          排序：
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setSortBy(o.value)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150",
                sortBy === o.value
                  ? "bg-sky-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {o.icon}
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onOpenFilter && (
          <button
            onClick={onOpenFilter}
            className="lg:hidden inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold text-white bg-gradient-to-br from-sky-900 to-sky-700 shadow-md relative"
          >
            <SlidersHorizontal size={16} />
            筛选
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
        <div className="text-sm text-slate-600">
          找到 <span className="font-bold text-orange-500 text-lg">{total}</span>{" "}
          个目的地
        </div>
        <div className="flex items-center bg-slate-100 rounded-full p-1">
          <button
            onClick={() => onToggleView("grid")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all",
              viewMode === "grid"
                ? "bg-white text-sky-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <LayoutGrid size={15} />
            网格
          </button>
          <button
            onClick={() => onToggleView("map")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all",
              viewMode === "map"
                ? "bg-white text-sky-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Map size={15} />
            地图
          </button>
        </div>
      </div>
    </div>
  );
}
