import { Scale, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompareStore } from "@/store/useCompareStore";
import destinations from "@/data/destinations";

export default function CompareBar() {
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const openDrawer = useCompareStore((s) => s.openDrawer);
  const canAdd = ids.length < 4;

  const items = ids
    .map((id) => destinations.find((d) => d.id === id))
    .filter(Boolean);

  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-3">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl shadow-sky-900/15">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-900 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Scale size={16} />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-sky-900 leading-tight">
                  对比清单
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {ids.length}/4 个目的地
                </div>
              </div>
              <span className="sm:hidden text-sm font-bold text-sky-900">
                {ids.length}/4
              </span>
            </div>

            <div className="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0 px-1 sm:px-2 overflow-x-auto hide-scrollbar">
              {items.map((d) =>
                d ? (
                  <div
                    key={d.id}
                    className="flex items-center gap-1.5 bg-slate-100 rounded-full pl-0.5 pr-1 py-0.5 flex-shrink-0 animate-pop"
                  >
                    <img
                      src={d.coverImage}
                      alt={d.name}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                    />
                    <span className="text-xs font-medium text-slate-700 max-w-[60px] truncate">
                      {d.name}
                    </span>
                    <button
                      onClick={() => remove(d.id)}
                      className="p-0.5 rounded-full hover:bg-white text-slate-400 hover:text-rose-500 transition-colors"
                      aria-label={`移除 ${d.name}`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : null,
              )}

              {!canAdd && (
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                  <AlertCircle size={12} />
                  最多 4 个
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={clear}
                className="hidden sm:inline-flex text-xs text-slate-400 hover:text-rose-500 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                清空
              </button>
              <button
                onClick={openDrawer}
                disabled={ids.length < 2}
                className={cn(
                  "rounded-xl px-3 sm:px-4 py-2 text-sm font-bold transition-all",
                  ids.length >= 2
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed",
                )}
              >
                <span className="hidden sm:inline">开始对比</span>
                <span className="sm:hidden">对比</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
