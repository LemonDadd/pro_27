import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

const ImageCarousel = ({
  images,
  alt,
  className,
  showControls = true,
  autoPlay = true,
  interval = 5000,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (autoPlay && !isHovered && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, interval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isHovered, images.length, interval, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (images.length === 0) {
    return (
      <div className={cn(
        'w-full aspect-[16/10] rounded-2xl bg-gradient-to-br from-[#0C4A6E]/10 to-[#F97316]/10 flex items-center justify-center',
        className
      )}>
        <span className="text-[#0C4A6E]/40 text-sm">暂无图片</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl group',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full aspect-[16/10] relative">
            <img
              src={image}
              alt={`${alt} - ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {showControls && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#0C4A6E] shadow-lg transition-all duration-300 flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0',
              'hover:scale-110 active:scale-95'
            )}
            aria-label="上一张"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <button
            onClick={goToNext}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#0C4A6E] shadow-lg transition-all duration-300 flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0',
              'hover:scale-110 active:scale-95'
            )}
            aria-label="下一张"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'rounded-full transition-all duration-300 ease-out',
              index === currentIndex
                ? 'w-8 h-2 bg-[#F97316] shadow-md shadow-[#F97316]/30'
                : 'w-2 h-2 bg-white/60 hover:bg-white/80'
            )}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
