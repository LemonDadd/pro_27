import type { Destination } from '@/types';
import DestinationCard from '@/components/destination/DestinationCard';
import EmptyState from '@/components/common/EmptyState';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  destinations: (Destination & { matchScore?: number })[];
}

export default function DestinationGrid({ destinations }: Props) {
  if (destinations.length === 0) {
    return (
      <EmptyState
        icon={<Compass className="w-12 h-12" />}
        title="没有找到匹配的目的地"
        description="试试调整筛选条件，或者重置筛选看看全部目的地"
        action={
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-[#F97316]/25"
          >
            重置筛选
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((dest, i) => (
        <DestinationCard
          key={dest.id}
          destination={dest}
          matchScore={dest.matchScore}
          delay={i * 50}
        />
      ))}
    </div>
  );
}
