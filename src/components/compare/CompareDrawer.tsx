import { useEffect } from "react";
import { X, Plane, Wallet, Shield, Languages, Calendar, CheckCircle2, XCircle, Minus } from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";
import destinations from "@/data/destinations";
import type { Destination } from "@/types";
import {
  BUDGET_LABELS, VISA_LABELS, CONTINENT_LABELS,
  POPULARITY_LABELS, SAFETY_LABELS, FORMATTERS,
  VISA_COLORS, POPULARITY_COLORS,
} from "@/utils/display";
import { cn } from "@/lib/utils";
import HeartButton from "@/components/common/HeartButton";
import { useUserStore } from "@/store/useUserStore";
import { Link } from "react-router-dom";

interface CompareRow {
  key: string;
  label: string;
  icon: React.ReactNode;
  render: (d: Destination, idx: number, all: Destination[]) => React.ReactNode;
  highlight?: "higher" | "lower" | "none";
  getValue?: (d: Destination) => number;
}

function BoolBadge({ v }: { v: boolean | null }) {
  if (v === true)
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
        <CheckCircle2 size={12} /> 优
      </span>
    );
  if (v === false)
    return (
      <span className="inline-flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-1 rounded-full text-xs font-medium">
        <XCircle size={12} /> 一般
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-full text-xs font-medium">
      <Minus size={12} /> 无
    </span>
  );
}

function HighlightCell({
  isBest,
  isWorst,
  children,
}: {
  value?: number;
  isBest?: boolean;
  isWorst?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        isBest && "text-emerald-600 font-bold",
        isWorst && "text-rose-500",
      )}
    >
      {children}
      {isBest && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">最佳</span>}
    </div>
  );
}

export default function CompareDrawer() {
  const ids = useCompareStore((s) => s.ids);
  const drawerOpen = useCompareStore((s) => s.drawerOpen);
  const closeDrawer = useCompareStore((s) => s.closeDrawer);
  const remove = useCompareStore((s) => s.remove);
  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const isInWishlist = useUserStore((s) => s.isInWishlist);

  const items = ids
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is Destination => !!d);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  const rows: CompareRow[] = [
    {
      key: "continent",
      label: "所在大洲",
      icon: <span className="text-base">🌍</span>,
      render: (d) => CONTINENT_LABELS[d.continent],
    },
    {
      key: "budget",
      label: "预算档位",
      icon: <Wallet size={16} />,
      render: (d) => BUDGET_LABELS[d.budgetLevel],
      getValue: (d) => d.budgetLevel,
      highlight: "lower",
    },
    {
      key: "flight",
      label: "飞行时长",
      icon: <Plane size={16} />,
      render: (d) => FORMATTERS.flight(d.flightHoursFromShanghai),
      getValue: (d) => d.flightHoursFromShanghai,
      highlight: "lower",
    },
    {
      key: "days",
      label: "建议天数",
      icon: <Calendar size={16} />,
      render: (d) => FORMATTERS.days(d.suggestedDays.min, d.suggestedDays.max),
    },
    {
      key: "visa",
      label: "签证类型",
      icon: <span className="text-base">🛂</span>,
      render: (d) => (
        <span
          className={cn(
            "inline-block rounded-full border px-2.5 py-1 text-xs font-medium",
            VISA_COLORS[d.visaType],
          )}
        >
          {VISA_LABELS[d.visaType]}
        </span>
      ),
    },
    {
      key: "popularity",
      label: "目的地热度",
      icon: <span className="text-base">🔥</span>,
      render: (d) => (
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
            POPULARITY_COLORS[d.popularity],
          )}
        >
          {POPULARITY_LABELS[d.popularity]}
        </span>
      ),
    },
    {
      key: "language",
      label: "语言友好度",
      icon: <Languages size={16} />,
      render: (d, _, all) => {
        const best = Math.max(...all.map((x) => x.ratings.languageFriendly));
        const worst = Math.min(...all.map((x) => x.ratings.languageFriendly));
        const v = d.ratings.languageFriendly;
        return (
          <HighlightCell
            value={v}
            isBest={all.length > 1 && v === best && best !== worst}
            isWorst={all.length > 1 && v === worst && best !== worst}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-14 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-700 to-sky-500"
                  style={{ width: `${v * 10}%` }}
                />
              </div>
              <span className="text-sm font-bold">{v}</span>
            </div>
          </HighlightCell>
        );
      },
      getValue: (d) => d.ratings.languageFriendly,
      highlight: "higher",
    },
    {
      key: "safety",
      label: "安全指数",
      icon: <Shield size={16} />,
      render: (d, _, all) => {
        const best = Math.max(...all.map((x) => x.ratings.safety));
        const worst = Math.min(...all.map((x) => x.ratings.safety));
        const v = d.ratings.safety;
        return (
          <HighlightCell
            value={v}
            isBest={all.length > 1 && v === best && best !== worst}
            isWorst={all.length > 1 && v === worst && best !== worst}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-14 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                  style={{ width: `${v * 10}%` }}
                />
              </div>
              <span className="text-sm font-bold">{v}</span>
            </div>
          </HighlightCell>
        );
      },
      getValue: (d) => d.ratings.safety,
      highlight: "higher",
    },
    {
      key: "priceIdx",
      label: "物价指数",
      icon: <span className="text-base">💵</span>,
      render: (d, _, all) => {
        const best = Math.min(...all.map((x) => x.ratings.priceIndex));
        const worst = Math.max(...all.map((x) => x.ratings.priceIndex));
        const v = d.ratings.priceIndex;
        return (
          <HighlightCell
            value={v}
            isBest={all.length > 1 && v === best && best !== worst}
            isWorst={all.length > 1 && v === worst && best !== worst}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-14 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300"
                  style={{ width: `${(1 - (v - 1) / 4) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold">{v}</span>
            </div>
          </HighlightCell>
        );
      },
      getValue: (d) => d.ratings.priceIndex,
      highlight: "lower",
    },
    {
      key: "recommend",
      label: "推荐指数",
      icon: <span className="text-base">⭐</span>,
      render: (d, _, all) => {
        const best = Math.max(...all.map((x) => x.recommendScore));
        const worst = Math.min(...all.map((x) => x.recommendScore));
        const v = d.recommendScore;
        return (
          <HighlightCell
            value={v}
            isBest={all.length > 1 && v === best && best !== worst}
            isWorst={all.length > 1 && v === worst && best !== worst}
          >
            <span className="text-sm font-bold">{v}</span>
          </HighlightCell>
        );
      },
      getValue: (d) => d.recommendScore,
      highlight: "higher",
    },
    {
      key: "bestMonths",
      label: "最佳月份",
      icon: <span className="text-base">📅</span>,
      render: (d) =>
        d.bestMonths
          .map((m) => {
            const map = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
            return map[m];
          })
          .join("、"),
    },
    {
      key: "safetyLevel",
      label: "安全等级",
      icon: <span className="text-base">🛡️</span>,
      render: (d) => SAFETY_LABELS[d.practical.safetyLevel],
    },
    {
      key: "currency",
      label: "货币",
      icon: <span className="text-base">💱</span>,
      render: (d) => d.practical.currency,
    },
  ];

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={closeDrawer}
      />

      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[850px] max-w-full bg-white shadow-2xl animate-slide-right flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-slate-100 flex-shrink-0 bg-gradient-to-r from-sky-900 to-sky-800 text-white">
          <div>
            <h2 className="font-serif text-2xl font-bold">⚖️ 目的地对比</h2>
            <p className="text-sm text-white/70 mt-0.5">
              对比 {items.length} 个目的地的关键指标
            </p>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="关闭对比"
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-center">
              <div className="text-6xl mb-4">🧭</div>
              <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">
                还没有选择对比的目的地
              </h3>
              <p className="text-slate-500 mb-6">
                在卡片上点击「对比」按钮，最多可对比 4 个目的地
              </p>
              <button onClick={closeDrawer} className="btn-primary">
                返回探索
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full min-w-[720px]">
              <thead className="sticky top-0 z-10 bg-white border-b border-slate-100">
                <tr>
                  <th className="w-40 text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/80">
                    指标
                  </th>
                  {items.map((d) => (
                    <th
                      key={d.id}
                      className="text-center p-3 bg-white min-w-[180px]"
                    >
                      <div className="relative inline-block">
                        <Link to={`/destination/${d.id}`} onClick={closeDrawer}>
                          <img
                            src={d.coverImage}
                            alt={d.name}
                            className="w-24 h-16 rounded-xl object-cover mx-auto mb-2 shadow-md hover:scale-105 transition-transform"
                          />
                        </Link>
                        <button
                          onClick={() => remove(d.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          aria-label={`移除 ${d.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <Link
                        to={`/destination/${d.id}`}
                        onClick={closeDrawer}
                        className="block font-serif text-base font-bold text-sky-900 hover:text-orange-500 transition-colors"
                      >
                        {d.name}
                      </Link>
                      <div className="text-xs text-slate-500">{d.country}</div>
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <HeartButton
                          size="sm"
                          active={isInWishlist(d.id)}
                          onChange={() => toggleWishlist(d.id)}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr
                    key={row.key}
                    className={cn(
                      "border-b border-slate-50 last:border-b-0",
                      rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/30",
                    )}
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        {row.icon}
                        {row.label}
                      </div>
                    </td>
                    {items.map((d) => (
                      <td
                        key={d.id}
                        className="p-4 text-center align-middle text-sm text-slate-700"
                      >
                        <div className="flex items-center justify-center">
                          {row.render(d, items.indexOf(d), items)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}

                <tr className="bg-gradient-to-b from-sky-50/60 to-white">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="text-base">🏷️</span>
                      旅行主题标签
                    </div>
                  </td>
                  {items.map((d) => (
                    <td key={d.id} className="p-4 align-middle">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {[...new Set(d.tags)].slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] bg-amber-50 text-amber-700 px-2 py-1 rounded-full ring-1 ring-amber-100 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="text-base">✨</span>
                      季节限定
                    </div>
                  </td>
                  {items.map((d) => (
                    <td key={d.id} className="p-4 text-center align-middle">
                      {d.seasonalTags && d.seasonalTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {d.seasonalTags.map((st) => (
                            <span
                              key={st}
                              className="text-[11px] bg-sky-50 text-sky-700 px-2 py-1 rounded-full font-medium"
                            >
                              {st === "cherry-blossom"
                                ? "🌸 樱花季"
                                : st === "lavender"
                                  ? "💜 薰衣草季"
                                  : st === "aurora"
                                    ? "🌌 极光"
                                    : "🍁 红叶"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <BoolBadge v={null} />
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="bg-gradient-to-r from-orange-50/50 to-transparent">
                  <td className="p-4 align-middle">
                    <div className="text-sm font-semibold text-slate-700">
                      快速操作
                    </div>
                  </td>
                  {items.map((d) => (
                    <td key={d.id} className="p-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/destination/${d.id}`}
                          onClick={closeDrawer}
                          className="btn-primary !py-2 !px-4 text-xs"
                        >
                          查看详情
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
