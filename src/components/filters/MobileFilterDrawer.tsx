import { useEffect } from "react";
import { X } from "lucide-react";
import FilterPanel from "@/components/filters/FilterPanel";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileFilterDrawer({ open, onClose }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[80] lg:hidden",
          "bg-white rounded-t-3xl shadow-2xl",
          "transition-transform duration-300 ease-out",
          "max-h-[85vh] flex flex-col",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl font-bold text-sky-900">
              🎯 筛选条件
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              选择你的出行偏好
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="关闭筛选"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-6">
          <FilterPanel />
        </div>

        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0 rounded-b-none">
          <button
            onClick={onClose}
            className="btn-primary w-full justify-center text-base py-3"
          >
            查看结果
          </button>
        </div>
      </div>

      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -top-2 w-12 h-1 rounded-full bg-slate-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
    </>
  );
}
