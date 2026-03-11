import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageContext';
import { getHeroConfig } from '../utils/config';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useLanguage();
  const heroConfig = getHeroConfig();
  const sectionRef = useRef<HTMLElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (heroConfig.autoPlay) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroConfig.slides.length);
      }, heroConfig.slideDuration);
      return () => clearInterval(timer);
    }
  }, [heroConfig.autoPlay, heroConfig.slideDuration, heroConfig.slides.length]);

  // 滚轮事件处理
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // 只在向下滚动且不在滚动过程中时触发
      if (event.deltaY > 0 && !isScrolling) {
        event.preventDefault();
        scrollToNextSection();
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleWheel, { passive: false });
      return () => section.removeEventListener('wheel', handleWheel);
    }
  }, [isScrolling]);

  const scrollToNextSection = () => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    const researchSection = document.getElementById('research');
    if (researchSection) {
      researchSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // 重置滚动状态
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroConfig.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroConfig.slides.length) % heroConfig.slides.length);
  };

  return (
    <section ref={sectionRef} id="home" className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={heroConfig.slides[currentSlide].image}
          alt={heroConfig.slides[currentSlide].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl mb-6 font-bold text-white" style={{ 
            textShadow: '2px 2px 8px rgba(0,0,0,0.9), 4px 4px 16px rgba(0,0,0,0.7), 0px 0px 20px rgba(0,0,0,0.8)' 
          }}>
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-50" style={{ 
            textShadow: '1px 1px 6px rgba(0,0,0,0.8), 2px 2px 12px rgba(0,0,0,0.6)' 
          }}>
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroConfig.showNavigation && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {heroConfig.showIndicators && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-full px-6 py-3 shadow-lg">
            <div className="flex space-x-3">
              {heroConfig.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={scrollToNextSection}
          className="group flex flex-col items-center text-white hover:text-gray-300 transition-all duration-300"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-full p-3 shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-300">
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </div>
          <span className="text-sm mt-2 opacity-70 group-hover:opacity-100 transition-opacity">
            {language === 'zh' ? '向下滚动' : 'Scroll Down'}
          </span>
        </button>
      </div>
    </section>
  );
}