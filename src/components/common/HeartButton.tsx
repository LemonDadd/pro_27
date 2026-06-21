import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeartButtonProps {
  active: boolean;
  onChange?: (e?: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: {
    button: 'p-1.5',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'p-2.5',
    icon: 'w-5 h-5',
  },
  lg: {
    button: 'p-3.5',
    icon: 'w-7 h-7',
  },
};

const HeartButton = ({ active, onChange, size = 'md', className }: HeartButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const sizes = sizeMap[size];

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    onChange?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-full transition-all duration-200 ease-out relative',
        sizes.button,
        active
          ? 'bg-rose-50 hover:bg-rose-100'
          : 'bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-md',
        isAnimating && 'scale-110',
        className
      )}
      aria-label={active ? '取消收藏' : '收藏'}
    >
      <Heart
        className={cn(
          sizes.icon,
          'transition-all duration-300 ease-out',
          isAnimating && active && 'scale-125',
          active
            ? 'text-rose-500 fill-rose-500 drop-shadow-sm'
            : 'text-gray-400 fill-none hover:text-rose-400'
        )}
        strokeWidth={active ? 2 : 2}
      />
      {active && isAnimating && (
        <>
          <span className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping" />
          <span className="absolute inset-0 rounded-full bg-rose-300/20 animate-pulse" />
        </>
      )}
    </button>
  );
};

export default HeartButton;
