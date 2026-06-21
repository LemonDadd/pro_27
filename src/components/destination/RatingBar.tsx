import { cn } from '@/lib/utils';

interface RatingBarProps {
  label: string;
  value: number;
  color?: string;
  inverse?: boolean;
}

const getDefaultColor = (label: string): string => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('language') || lowerLabel.includes('语言') || lowerLabel.includes('friendly')) {
    return 'blue';
  }
  if (lowerLabel.includes('safety') || lowerLabel.includes('安全')) {
    return 'green';
  }
  if (lowerLabel.includes('price') || lowerLabel.includes('价格') || lowerLabel.includes('index') || lowerLabel.includes('消费')) {
    return 'orange';
  }
  return 'blue';
};

const colorMap: Record<string, { bar: string; bg: string; text: string }> = {
  blue: {
    bar: 'bg-[#0C4A6E]',
    bg: 'bg-[#0C4A6E]/10',
    text: 'text-[#0C4A6E]',
  },
  green: {
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
  },
  orange: {
    bar: 'bg-[#F97316]',
    bg: 'bg-[#F97316]/10',
    text: 'text-[#F97316]',
  },
};

const RatingBar = ({ label, value, color, inverse }: RatingBarProps) => {
  const colorType = color || getDefaultColor(label);
  const isInverse = inverse ?? colorType === 'orange';
  const colors = colorMap[colorType] || colorMap.blue;

  const clampedValue = Math.max(0, Math.min(10, value));
  const percentage = (clampedValue / 10) * 100;
  const displayPercentage = isInverse ? 100 - percentage : percentage;
  const displayValue = isInverse ? (10 - clampedValue).toFixed(1) : clampedValue.toFixed(1);

  const labelText = isInverse
    ? label.includes('价格') || label.includes('消费') || label.toLowerCase().includes('price')
      ? `${label} (越低越便宜)`
      : label
    : label;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#0C4A6E]/80">
          {labelText}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={cn('text-sm font-bold tabular-nums', colors.text)}>
            {displayValue}
          </span>
          <span className="text-xs text-[#0C4A6E]/40 font-medium">/ 10</span>
        </div>
      </div>
      <div className="relative h-2.5 rounded-full overflow-hidden">
        <div className={cn('absolute inset-0 rounded-full', colors.bg)} />
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out',
            colors.bar
          )}
          style={{ width: `${displayPercentage}%` }}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full opacity-40 blur-sm transition-all duration-700 ease-out',
            colors.bar
          )}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default RatingBar;
