import { Link } from 'react-router-dom';
import { Compass, Sparkles, Heart, Map, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: '探索',
      links: [
        { label: '热门目的地', to: '/' },
        { label: '小众秘境', to: '/' },
        { label: '季节推荐', to: '/' },
        { label: '主题旅行', to: '/' },
      ],
    },
    {
      title: '快速推荐',
      links: [
        { label: '旅行问卷', to: '/quiz' },
        { label: 'AI 智能匹配', to: '/quiz' },
        { label: '预算规划', to: '/' },
        { label: '行程定制', to: '/' },
      ],
    },
    {
      title: '愿望清单',
      links: [
        { label: '我的收藏', to: '/wishlist' },
        { label: '想去的地方', to: '/wishlist' },
        { label: '旅行灵感', to: '/' },
        { label: '分类浏览', to: '/' },
      ],
    },
    {
      title: '足迹地图',
      links: [
        { label: '我的足迹', to: '/map' },
        { label: '打卡记录', to: '/map' },
        { label: '世界地图', to: '/map' },
        { label: '旅行统计', to: '/' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Youtube, label: 'Youtube', href: '#' },
  ];

  const icons = [Compass, Sparkles, Heart, Map];

  return (
    <footer className="bg-[#0C4A6E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-11 h-11 rounded-2xl bg-[#F97316] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Wanderlust
                </span>
              </Link>

              <p className="mt-6 text-white/60 text-sm leading-relaxed max-w-sm">
                发现世界的美好，记录每一次心动的旅程。从繁华都市到宁静小镇，从热带海滩到雪山之巅，让我们一起探索地球上最美的角落。
              </p>

              <div className="mt-8">
                <h4
                  className="text-sm font-semibold text-white/90 mb-4"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  关注我们
                </h4>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#F97316] flex items-center justify-center transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {columns.map((column, idx) => (
              <div key={column.title}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    {(() => {
                      const IconComponent = icons[idx];
                      return <IconComponent className="w-4 h-4 text-[#F97316]" />;
                    })()}
                  </div>
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {column.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-white/60 hover:text-[#F97316] transition-colors duration-200 inline-flex items-center gap-1 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[#F97316] transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-[#F97316]/20 to-[#0C4A6E]/20 border border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h4
                  className="text-lg font-semibold text-white flex items-center gap-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  <Sparkles className="w-5 h-5 text-[#F97316]" />
                  加入我们的社区
                </h4>
                <p className="mt-2 text-sm text-white/60 max-w-md">
                  分享你的旅行故事，与志同道合的旅行者一起探索世界。成为社区贡献者，让更多人发现隐藏的美景。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#F97316]/25">
                  成为贡献者
                </button>
                <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all duration-200 border border-white/10">
                  了解更多
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} Wanderlust. 保留所有权利。
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              隐私政策
            </Link>
            <Link to="/" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              使用条款
            </Link>
            <Link to="/" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
