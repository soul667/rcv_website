import { Menu, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useRouter } from './Router';
import { Button } from './ui/button';

export function Header() {
  const [showDesktopTitle, setShowDesktopTitle] = useState(() => window.innerWidth >= 1100);
  const { language, toggleLanguage, t } = useLanguage();
  const { navigateTo, currentPage } = useRouter();
  const drawerId = 'mobile-nav-drawer';

  useEffect(() => {
    const handleResize = () => {
      setShowDesktopTitle(window.innerWidth >= 1100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { label: t('nav.home'), page: 'home' as const },
    { label: t('nav.research'), page: 'research' as const },
    { label: t('nav.publications'), page: 'publications' as const },
    { label: t('nav.team'), page: 'team' as const },
  ];

  const closeDrawer = () => {
    const el = document.getElementById(drawerId) as HTMLInputElement | null;
    if (el) el.checked = false;
  };

  const handleNavClick = (page: typeof navItems[0]['page']) => {
    navigateTo(page);
    closeDrawer();
  };

  return (
    <>
      {/* DaisyUI Drawer wrapper — only active on mobile */}
      <div className="drawer md:hidden drawer-end">
        <input id={drawerId} type="checkbox" className="drawer-toggle" />

        {/* Header bar */}
        <div className="drawer-content">
          <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo (mobile: just icon) */}
                <button onClick={() => navigateTo('home')} className="text-left group">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/assets/media/logo.png"
                      alt="RCV Logo"
                      className="h-10 w-10 object-contain filter brightness-110"
                    />
                  </div>
                </button>

                {/* Mobile Hamburger */}
                <label htmlFor={drawerId} className="btn btn-ghost btn-circle text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </label>
              </div>
            </div>
          </header>
        </div>

        {/* Drawer Side Panel */}
        <div className="drawer-side z-[100]">
          <label htmlFor={drawerId} aria-label="close sidebar" className="drawer-overlay backdrop-blur-sm bg-black/60" />
          <div className="menu min-h-full w-72 bg-black/50 backdrop-blur-2xl border-l border-white/10 text-white p-6 flex flex-col gap-1" style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.5)' }}>
            {/* Close hint / branding */}
            <div className="mb-4 pb-4 border-b border-white/10">
              <p className="text-xs text-white/40 tracking-widest uppercase">Navigation</p>
            </div>

            {/* Nav Items */}
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page)}
                className={`text-left px-4 py-3 rounded-lg transition-all duration-200 text-base ${
                  currentPage === item.page
                    ? 'text-white bg-white/10 font-medium border-l-2 border-[#CB743B] pl-3'
                    : 'text-white/60 hover:text-white hover:bg-white/5 font-normal'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Language Toggle */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <button
                onClick={() => { toggleLanguage(); closeDrawer(); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-white/8 text-white/70 hover:bg-white/15 hover:text-white transition-all duration-200 border border-white/10 text-sm"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'en' ? '中文' : 'EN'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header (hidden on mobile) */}
      <header className="hidden md:block fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button onClick={() => navigateTo('home')} className="text-left group">
              <div className="flex items-center space-x-3">
                <img src="/assets/media/logo.png" alt="EE Logo" className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110 filter brightness-110" />
                <img src="/assets/media/ee-logo.png" alt="EE Logo" className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110 filter brightness-110" onError={(e) => { e.currentTarget.src = "/assets/media/logo.png"; }} />
                {showDesktopTitle && (
                  <div className="text-white font-semibold text-lg">
                    {language === 'zh' ? '机器人与计算机视觉实验室' : 'Robotics and Computer Vision Lab'}
                  </div>
                )}
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav>
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigateTo(item.page)}
                    className={`relative px-4 py-2 transition-all duration-300 ${
                      currentPage === item.page
                        ? 'text-white rounded-full shadow-lg'
                        : 'text-gray-200 bg-transparent rounded-full hover:text-white'
                    }`}
                    style={currentPage === item.page ? { backgroundColor: 'rgb(255 255 255 / 13%)' } : undefined}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="ml-4 pl-4 border-l border-white/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="px-3 py-2 text-white hover:bg-[#5a5c60] hover:text-white transition-all duration-300 rounded-full"
                    style={{ backgroundColor: 'rgb(255 255 255 / 13%)' }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {language === 'en' ? '中文' : 'EN'}
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}


