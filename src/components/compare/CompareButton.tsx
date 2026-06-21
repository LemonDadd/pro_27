import { useState } from "react";
import { Scale, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompareStore } from "@/store/useCompareStore";

interface Props {
  destinationId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CompareButton({
  destinationId,
  size = "sm",
  className,
}: Props) {
  const has = useCompareStore((s) => s.has(destinationId));
  const toggle = useCompareStore((s) => s.toggle);
  const count = useCompareStore((s) => s.ids.length);
  const [popped, setPopped] = useState(false);

  const sizeMap = {
    sm: { btn: "p-1.5", icon: 15 },
    md: { btn: "p-2", icon: 18 },
    lg: { btn: "p-2.5", icon: 22 },
  } as const;

  const canAdd = has || count < 4;

  const handleClick = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    if (!canAdd) return;
    toggle(destinationId);
    if (!has) {
      setPopped(true);
      setTimeout(() => setPopped(false), 450);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canAdd}
      title={
        has
          ? "移出对比"
          : count >= 4
            ? "最多对比 4 个目的地"
            : "加入对比"
      }
      className={cn(
        "rounded-full transition-all relative",
        sizeMap[size].btn,
        has
          ? "text-sky-900 bg-sky-50 ring-1 ring-sky-200 shadow-sm"
          : canAdd
            ? "text-slate-300 hover:text-sky-700 hover:bg-sky-50"
            : "text-slate-200 cursor-not-allowed",
        popped && has && "animate-heart-pop",
        className,
      )}
    >
      {has ? (
        <Scale size={sizeMap[size].icon} strokeWidth={2.4} />
      ) : (
        <div className="relative">
          <Plus size={sizeMap[size].icon} />
          <Scale
            size={Math.round(sizeMap[size].icon * 0.55)}
            className="absolute -bottom-0.5 -right-0.5"
          />
        </div>
      )}
    </button>
  );
}
