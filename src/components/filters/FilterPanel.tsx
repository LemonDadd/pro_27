import { useMemo, useState } from "react";
import { X, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useFilterStore } from "@/store/useFilterStore";
import type {
  BudgetLevel,
  DayRange,
  Tag,
  FlightDuration,
  VisaType,
  Popularity,
  SeasonalTag,
} from "@/types";
import {
  BUDGET_LABELS,
  DAY_RANGE_LABELS,
  FLIGHT_DURATION_LABELS,
  TAG_LABELS,
  TAG_EMOJI,
  VISA_LABELS,
  POPULARITY_LABELS,
  SEASONAL_TAG_LABELS,
  MONTH_SHORT_LABELS,
} from "@/utils/display";
import { cn } from "@/lib/utils";

const BUDGET_OPTIONS: { value: BudgetLevel; label: string }[] = [
  { value: 1, label: BUDGET_LABELS[1] },
  { value: 2, label: BUDGET_LABELS[2] },
  { value: 3, label: BUDGET_LABELS[3] },
];

const DAY_RANGE_OPTIONS: { value: DayRange; label: string }[] = [
  { value: "3-5", label: DAY_RANGE_LABELS["3-5"] },
  { value: "5-7", label: DAY_RANGE_LABELS["5-7"] },
  { value: "7-10", label: DAY_RANGE_LABELS["7-10"] },
  { value: "10+", label: DAY_RANGE_LABELS["10+"] },
];

const THEME_OPTIONS: { value: Tag; label: string; emoji: string }[] = (
  Object.keys(TAG_LABELS) as Tag[]
).map((t) => ({ value: t, label: TAG_LABELS[t], emoji: TAG_EMOJI[t] }));

const FLIGHT_OPTIONS: { value: FlightDuration; label: string }[] = [
  { value: "<2h", label: FLIGHT_DURATION_LABELS["<2h"] },
  { value: "2-5h", label: FLIGHT_DURATION_LABELS["2-5h"] },
  { value: "5-10h", label: FLIGHT_DURATION_LABELS["5-10h"] },
  { value: "10h+", label: FLIGHT_DURATION_LABELS["10h+"] },
];

const VISA_OPTIONS: { value: VisaType; label: string }[] = (
  Object.keys(VISA_LABELS) as VisaType[]
).map((v) => ({ value: v, label: VISA_LABELS[v] }));

const POPULARITY_OPTIONS: { value: Popularity; label: string }[] = (
  Object.keys(POPULARITY_LABELS) as Popularity[]
).map((p) => ({ value: p, label: POPULARITY_LABELS[p] }));

const SEASONAL_OPTIONS: { value: SeasonalTag; label: string }[] = (
  Object.keys(SEASONAL_TAG_LABELS) as SeasonalTag[]
).map((s) => ({ value: s, label: SEASONAL_TAG_LABELS[s] }));

function Chip<T extends string | number>({
  label,
  active,
  onClick,
  emoji,
}: {
  value?: T;
  label: string;
  active: boolean;
  onClick: () => void;
  emoji?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150 border",
        active
          ? "bg-sky-900 text-white border-sky-900 shadow-md scale-[1.02]"
          : "bg-white text-slate-600 border-slate-200 hover:border-sky-400 hover:text-sky-700",
      )}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </button>
  );
}

function FilterGroup({
  title,
  children,
  defaultOpen = true,
  count,
  onReset,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
  onReset?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 font-semibold text-slate-800"
        >
          <span>{title}</span>
          {typeof count === "number" && count > 0 && (
            <span className="rounded-full bg-orange-500 text-white text-[11px] font-bold px-1.5 py-0.5 min-w-[20px] text-center">
              {count}
            </span>
          )}
          {open ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </button>
        {onReset && (count ?? 0) > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            <X size={12} /> 清除
          </button>
        )}
      </div>
      {open && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export default function FilterPanel() {
  const s = useFilterStore();
  const totalActive = useMemo(
    () =>
      s.budgetLevels.length +
      s.months.length +
      s.dayRanges.length +
      s.themes.length +
      s.flightDurations.length +
      s.visaTypes.length +
      s.popularity.length +
      s.seasonalTags.length,
    [s],
  );

  return (
    <aside className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 p-5 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-100">
        <h2 className="font-serif text-xl font-bold text-sky-900">
          🎯 筛选条件
        </h2>
        {totalActive > 0 && (
          <button
            onClick={s.reset}
            className="text-xs text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-rose-50"
          >
            <RotateCcw size={13} />
            全部重置
          </button>
        )}
      </div>
      <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-0 custom-scrollbar">
        <FilterGroup
          title="💰 预算档位"
          count={s.budgetLevels.length}
          onReset={() => s.budgetLevels.forEach(s.toggleBudget)}
        >
          {BUDGET_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              value={o.value}
              label={o.label}
              active={s.budgetLevels.includes(o.value)}
              onClick={() => s.toggleBudget(o.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="📅 出行月份"
          count={s.months.length}
          onReset={() => s.months.forEach(s.toggleMonth)}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <Chip
              key={m}
              value={m}
              label={MONTH_SHORT_LABELS[m]}
              active={s.months.includes(m)}
              onClick={() => s.toggleMonth(m)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="⏱️ 旅行天数"
          count={s.dayRanges.length}
          onReset={() => s.dayRanges.forEach(s.toggleDayRange)}
        >
          {DAY_RANGE_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              value={o.value}
              label={o.label}
              active={s.dayRanges.includes(o.value)}
              onClick={() => s.toggleDayRange(o.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="🎨 旅行主题"
          count={s.themes.length}
          onReset={() => s.themes.forEach(s.toggleTheme)}
        >
          {THEME_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              value={o.value}
              label={o.label}
              emoji={o.emoji}
              active={s.themes.includes(o.value)}
              onClick={() => s.toggleTheme(o.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="✈️ 飞行时长"
          count={s.flightDurations.length}
          onReset={() => s.flightDurations.forEach(s.toggleFlightDuration)}
        >
          {FLIGHT_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              value={o.value}
              label={o.label}
              active={s.flightDurations.includes(o.value)}
              onClick={() => s.toggleFlightDuration(o.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="🛂 签证要求"
          count={s.visaTypes.length}
          onReset={() => s.visaTypes.forEach(s.toggleVisaType)}
        >
          {VISA_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              value={o.value}
              label={o.label}
              active={s.visaTypes.includes(o.value)}
              onClick={() => s.toggleVisaType(o.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="⭐ 目的地热度"
          count={s.popularity.length}
          onReset={() => s.popularity.forEach(s.togglePopularity)}
        >
          {POPULARITY_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              value={o.value}
              label={o.label}
              active={s.popularity.includes(o.value)}
              onClick={() => s.togglePopularity(o.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="🌸 季节限定"
          count={s.seasonalTags.length}
          onReset={() => s.seasonalTags.forEach(s.toggleSeasonalTag)}
        >
          {SEASONAL_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              value={o.value}
              label={o.label}
              active={s.seasonalTags.includes(o.value)}
              onClick={() => s.toggleSeasonalTag(o.value)}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}
