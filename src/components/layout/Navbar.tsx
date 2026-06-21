import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Compass, Sparkles, Heart, Map, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const wishlist = useUserStore((state) => state.wishlist);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: '探索', icon: Compass },
    { to: '/quiz', label: '快速推荐', icon: Sparkles },
    { to: '/wishlist', label: '愿望清单', icon: Heart },
    { to: '/map', label: '足迹地图', icon: Map },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0C4A6E]/90 backdrop-blur-xl shadow-lg shadow-[#0C4A6E]/10'
          : 'bg-white/70 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className={cn(
              'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105',
              scrolled ? 'bg-[#F97316]' : 'bg-gradient-to-br from-[#0C4A6E] to-[#F97316]'
            )}>
              <Compass className={cn(
                'w-5 h-5 transition-colors',
                scrolled ? 'text-white' : 'text-white'
              )} />
            </div>
            <span className={cn(
              'text-xl font-bold tracking-tight transition-colors',
              'font-serif',
              scrolled ? 'text-white' : 'text-[#0C4A6E]'
            )}
            style={{ fontFamily: "'Fraunces', serif" }}
            >
              Wanderlust
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2',
                    scrolled
                      ? isActive
                        ? 'text-white bg-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      : isActive
                        ? 'text-[#0C4A6E] bg-[#FEF3C7]/50'
                        : 'text-[#0C4A6E]/70 hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/5'
                  )
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className={cn(
                'p-2.5 rounded-xl transition-all duration-200 hidden sm:flex items-center',
                scrolled
                  ? 'text-white/70 hover:text-white hover:bg-white/5'
                  : 'text-[#0C4A6E]/70 hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/5'
              )}
              aria-label="搜索"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/wishlist"
              className={cn(
                'relative p-2.5 rounded-xl transition-all duration-200 group',
                scrolled
                  ? 'text-white/70 hover:text-white hover:bg-white/5'
                  : 'text-[#0C4A6E]/70 hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/5'
              )}
              aria-label="愿望清单"
            >
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {wishlist.length > 99 ? '99+' : wishlist.length}
                </span>
              )}
            </Link>

            <button
              className={cn(
                'w-10 h-10 rounded-xl overflow-hidden transition-all duration-200 ring-2 ring-offset-2',
                scrolled
                  ? 'ring-white/20 hover:ring-white/40'
                  : 'ring-[#0C4A6E]/10 hover:ring-[#0C4A6E]/30'
              )}
              aria-label="用户菜单"
            >
              <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-[#0C4A6E] flex items-center justify-center text-white text-sm font-bold">
                W
              </div>
            </button>

            <button
              className={cn(
                'lg:hidden p-2.5 rounded-xl transition-all duration-200',
                scrolled
                  ? 'text-white/70 hover:text-white hover:bg-white/5'
                  : 'text-[#0C4A6E]/70 hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/5'
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="菜单"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className={cn(
          'px-4 pb-4 pt-2 space-y-1 border-t',
          scrolled
            ? 'bg-[#0C4A6E]/95 backdrop-blur-xl border-white/10'
            : 'bg-white/95 backdrop-blur-md border-[#0C4A6E]/5'
        )}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                  scrolled
                    ? isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                    : isActive
                      ? 'text-[#0C4A6E] bg-[#FEF3C7]/50'
                      : 'text-[#0C4A6E]/70 hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/5'
                )
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
