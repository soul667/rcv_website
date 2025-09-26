import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageContext';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const researchAreas = [
  {
    titleKey: "research.slam.title",
    descriptionKey: "research.slam.description",
    image: "https://images.unsplash.com/photo-1559052057-738e8a04dc3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHZpc2lvbiUyMFNMQU0lMjByZXNlYXJjaHxlbnwxfHx8fDE3NTgzNDQ5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    keywords: {
      zh: ["视觉SLAM", "激光雷达SLAM", "深度学习", "传感器融合", "实时定位"],
      en: ["Visual SLAM", "LiDAR SLAM", "Deep Learning", "Sensor Fusion", "Real-time Localization"]
    }
  },
  {
    titleKey: "research.ssl.title",
    descriptionKey: "research.ssl.description", 
    image: "https://images.unsplash.com/photo-1559052057-738e8a04dc3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHZpc2lvbiUyMFNMQU0lMjByZXNlYXJjaHxlbnwxfHx8fDE3NTgzNDQ5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    keywords: {
      zh: ["场景图生成", "语义映射", "目标检测", "空间关系理解", "点云分析"],
      en: ["Scene Graph Generation", "Semantic Mapping", "Object Detection", "Spatial Relationship Understanding", "Point Cloud Analysis"]
    }
  },
  {
    titleKey: "research.hri.title",
    descriptionKey: "research.hri.description",
    image: "https://images.unsplash.com/photo-1682159672286-40790338349b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMHJvYm90JTIwaW50ZXJhY3Rpb258ZW58MXx8fHwxNzU4MzQ0OTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    keywords: {
      zh: ["意图理解", "行为预测", "自然语言处理", "手势识别", "协作机器人"],
      en: ["Intent Understanding", "Behavior Prediction", "Natural Language Processing", "Gesture Recognition", "Collaborative Robots"]
    }
  }
];

export function Research() {
  const { language, t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <section id="research" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-slate-800">{t('research.title')}</h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {researchAreas.map((area, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                  <Card className="overflow-hidden border-0 shadow-lg h-full">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Image */}
                        <div className="lg:w-2/5">
                          <ImageWithFallback
                            src={area.image}
                            alt={t(area.titleKey)}
                            className="w-full h-64 lg:h-96 object-cover"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                          <h3 className="text-2xl lg:text-3xl mb-6 text-slate-800 font-bold">
                            {t(area.titleKey)}
                          </h3>
                          <p className="text-slate-700 leading-relaxed mb-6 text-lg">
                            {t(area.descriptionKey)}
                          </p>
                          
                          {/* Keywords */}
                          <div className="flex flex-wrap gap-2">
                            {area.keywords[language].map((keyword, keyIndex) => (
                              <span
                                key={keyIndex}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 bg-white/90 backdrop-blur-sm border border-gray-200 text-slate-700 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 bg-white/90 backdrop-blur-sm border border-gray-200 text-slate-700 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className="backdrop-blur-sm bg-white/80 rounded-full px-4 py-2 shadow-lg">
              <div className="flex space-x-2">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === selectedIndex 
                        ? 'bg-blue-600 scale-125 shadow-md' 
                        : 'bg-slate-300 hover:bg-slate-400 hover:scale-110'
                    }`}
                    onClick={() => scrollTo(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
