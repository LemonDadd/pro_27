import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/destination/HeroSection';
import FilterPanel from '@/components/filters/FilterPanel';
import SortControls from '@/components/destination/SortControls';
import DestinationGrid from '@/components/destination/DestinationGrid';
import WorldMap from '@/components/map/WorldMap';
import { useFilterStore } from '@/store/useFilterStore';
import destinations from '@/data/destinations';
import { filterAndSortDestinations } from '@/utils/matchScore';

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const filters = useFilterStore();
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery);

  const filteredDestinations = useMemo(() => {
    return filterAndSortDestinations(destinations, filters);
  }, [filters]);

  const handleRandomClick = () => {
    const shuffled = [...destinations].sort(() => Math.random() - 0.5);
    const randomThree = shuffled.slice(0, 3);
    const names = randomThree.map((d) => d.name).join('、');
    const searchStr = randomThree.map((d) => d.name).join(' ');
    setSearchQuery(searchStr);
    alert(`🎲 为你随机推荐 3 个目的地：\n\n${names}\n\n已自动填入搜索框！`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <HeroSection
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        onRandomClick={handleRandomClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <SortControls
              total={filteredDestinations.length}
              viewMode={viewMode}
              onToggleView={setViewMode}
            />

            {viewMode === 'grid' ? (
              <DestinationGrid destinations={filteredDestinations} />
            ) : (
              <WorldMap destinations={filteredDestinations} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
