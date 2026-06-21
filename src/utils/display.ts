import type {
  Tag,
  SeasonalTag,
  VisaType,
  Popularity,
  BudgetLevel,
  DayRange,
  FlightDuration,
  Continent,
  HighlightType,
  SafetyLevel,
} from "@/types";

export const TAG_LABELS: Record<Tag, string> = {
  beach: "海滩",
  "ancient-city": "古城",
  nature: "自然",
  food: "美食",
  adventure: "冒险",
  family: "亲子",
  honeymoon: "蜜月",
  "solo-friendly": "独行友好",
  city: "城市",
  ski: "滑雪",
  "road-trip": "自驾",
};

export const TAG_EMOJI: Record<Tag, string> = {
  beach: "🏖️",
  "ancient-city": "🏛️",
  nature: "🌿",
  food: "🍜",
  adventure: "🧗",
  family: "👨‍👩‍👧",
  honeymoon: "💍",
  "solo-friendly": "🎒",
  city: "🏙️",
  ski: "⛷️",
  "road-trip": "🚗",
};

export const SEASONAL_TAG_LABELS: Record<SeasonalTag, string> = {
  "cherry-blossom": "🌸 樱花季",
  lavender: "💜 薰衣草季",
  aurora: "🌌 极光",
  "red-leaves": "🍁 红叶",
};

export const VISA_LABELS: Record<VisaType, string> = {
  "visa-free": "免签",
  "visa-on-arrival": "落地签",
  "e-visa": "电子签",
  "visa-required": "需要签证",
};

export const VISA_COLORS: Record<VisaType, string> = {
  "visa-free": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "visa-on-arrival": "bg-amber-100 text-amber-700 border-amber-200",
  "e-visa": "bg-sky-100 text-sky-700 border-sky-200",
  "visa-required": "bg-rose-100 text-rose-700 border-rose-200",
};

export const POPULARITY_LABELS: Record<Popularity, string> = {
  hot: "🔥 热门",
  niche: "✨ 小众",
  cold: "❄️ 冷僻",
};

export const POPULARITY_COLORS: Record<Popularity, string> = {
  hot: "bg-rose-50 text-rose-600",
  niche: "bg-violet-50 text-violet-600",
  cold: "bg-cyan-50 text-cyan-600",
};

export const BUDGET_LABELS: Record<BudgetLevel, string> = {
  1: "¥ 经济",
  2: "$$ 中档",
  3: "$$$ 奢华",
};

export const BUDGET_SYMBOLS: Record<BudgetLevel, string> = {
  1: "¥",
  2: "$$",
  3: "$$$",
};

export const DAY_RANGE_LABELS: Record<DayRange, string> = {
  "3-5": "3-5 天",
  "5-7": "5-7 天",
  "7-10": "7-10 天",
  "10+": "10 天以上",
};

export const FLIGHT_DURATION_LABELS: Record<FlightDuration, string> = {
  "<2h": "小于 2 小时",
  "2-5h": "2-5 小时",
  "5-10h": "5-10 小时",
  "10h+": "10 小时以上",
};

export const CONTINENT_LABELS: Record<Continent, string> = {
  asia: "亚洲",
  europe: "欧洲",
  americas: "美洲",
  africa: "非洲",
  oceania: "大洋洲",
  "middle-east": "中东",
};

export const HIGHLIGHT_INFO: Record<
  HighlightType,
  { label: string; emoji: string; color: string }
> = {
  do: { label: "必做", emoji: "🎯", color: "text-orange-600 bg-orange-50" },
  eat: { label: "必吃", emoji: "🍽️", color: "text-rose-600 bg-rose-50" },
  see: { label: "必看", emoji: "👀", color: "text-sky-600 bg-sky-50" },
};

export const SAFETY_LABELS: Record<SafetyLevel, string> = {
  low: "一般",
  medium: "良好",
  high: "优秀",
};

export const SAFETY_COLORS: Record<SafetyLevel, string> = {
  low: "text-amber-600 bg-amber-50",
  medium: "text-sky-600 bg-sky-50",
  high: "text-emerald-600 bg-emerald-50",
};

export const MONTH_LABELS = [
  "",
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

export const MONTH_SHORT_LABELS = [
  "", "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

export const FORMATTERS = {
  days(min: number, max: number): string {
    if (min === max) return `${min} 天`;
    return `${min}-${max} 天`;
  },
  flight(hours: number): string {
    if (hours < 1) return `${Math.round(hours * 60)} 分钟`;
    if (Number.isInteger(hours)) return `${hours}h`;
    const h = Math.floor(hours);
    const m = Math.round((hours % 1) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  },
};
