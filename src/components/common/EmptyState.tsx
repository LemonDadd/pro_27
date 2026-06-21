import React from 'react';
import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/20 to-[#0C4A6E]/20 rounded-3xl blur-2xl scale-150" />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FEF3C7] via-white to-[#FEF3C7] shadow-xl shadow-[#0C4A6E]/10 flex items-center justify-center border border-[#0C4A6E]/5">
          {icon ? (
            <div className="text-[#F97316]">{icon}</div>
          ) : (
            <Compass className="w-12 h-12 text-[#0C4A6E]/40" strokeWidth={1.5} />
          )}
        </div>
      </div>

      <h3
        className={cn(
          'text-xl font-bold text-[#0C4A6E] mb-3 max-w-sm',
          'font-serif'
        )}
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {title}
      </h3>

      {description && (
        <p className="text-sm text-[#0C4A6E]/60 leading-relaxed max-w-md mb-8">
          {description}
        </p>
      )}

      {action && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
