import { cn } from "@/lib/utils";

interface RingProgressBaseProps {
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  gradientId?: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  transition?: string;
  children?: React.ReactNode;
}

interface RingProgressValueProps extends RingProgressBaseProps {
  mode?: "value";
  value: number;
  max?: number;
  inverse?: boolean;
  label?: string;
  inverseHint?: boolean;
  valueColor?: string;
}

interface RingProgressPercentProps extends RingProgressBaseProps {
  mode: "percent";
  percent: number;
  percentColor?: string;
  percentLabel?: string;
  percentFontFamily?: string;
}

type RingProgressProps = RingProgressValueProps | RingProgressPercentProps;

export default function RingProgress(props: RingProgressProps) {
  const {
    size = 128,
    strokeWidth = 8,
    trackColor = "#E2E8F0",
    className,
    transition = "stroke-dashoffset 1s ease-out",
    children,
  } = props;

  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let displayPercent: number;
  let gradient: { id: string; from?: string; to?: string } | null = null;

  if (props.mode === "percent") {
    displayPercent = Math.max(0, Math.min(100, props.percent));
    if (props.gradientFrom && props.gradientTo) {
      gradient = {
        id: props.gradientId || `ring-gradient-${Math.random().toString(36).slice(2, 8)}`,
        from: props.gradientFrom,
        to: props.gradientTo,
      };
    }
  } else {
    const { value, max = 10, inverse = false } = props;
    const displayValue = inverse ? max - value : value;
    displayPercent = (displayValue / max) * 100;
  }

  const dashOffset = circumference - (displayPercent / 100) * circumference;
  const stroke = gradient ? `url(#${gradient.id})` : (props.mode === "percent" ? props.progressColor || "#F97316" : (props as RingProgressValueProps).progressColor || "#F97316");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition }}
          />
          {gradient && (
            <defs>
              <linearGradient id={gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradient.from} />
                <stop offset="100%" stopColor={gradient.to} />
              </linearGradient>
            </defs>
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children ?? (
            props.mode === "percent" ? (
              <div className="text-center">
                <div
                  className="font-bold tabular-nums"
                  style={{
                    fontSize: size * 0.22,
                    color: props.percentColor || "#F97316",
                    fontFamily: props.percentFontFamily,
                  }}
                >
                  {props.percent}%
                </div>
                {props.percentLabel && (
                  <div className="text-xs text-slate-400 font-medium">
                    {props.percentLabel}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: (props as RingProgressValueProps).valueColor || "#0C4A6E" }}
                >
                  {(props.inverse ? (props.max || 10) - props.value : props.value).toFixed(1)}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  / {props.max || 10}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {props.mode === "value" && props.label && (
        <div className="mt-3 text-sm font-semibold text-[#0C4A6E] text-center">
          {props.label}
        </div>
      )}
      {props.mode === "value" && props.inverseHint && (
        <div className="text-xs text-slate-400 mt-0.5">数值越低越好</div>
      )}
    </div>
  );
}
