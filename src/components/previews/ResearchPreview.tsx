import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../LanguageContext';
import { useRouter } from '../Router';
import { ArrowRight } from 'lucide-react';

const researchPreview = {
  titleKey: "research.slam.title",
  descriptionKey: "research.slam.description",
  image: "https://images.unsplash.com/photo-1559052057-738e8a04dc3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHZpc2lvbiUyMFNMQU0lMjByZXNlYXJjaHxlbnwxfHx8fDE3NTgzNDQ5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  keywords: {
    zh: ["视觉SLAM", "激光雷达SLAM", "深度学习"],
    en: ["Visual SLAM", "LiDAR SLAM", "Deep Learning"]
  }
};

export function ResearchPreview() {
  const { language, t } = useLanguage();
  const { navigateTo } = useRouter();

  return (
    <section id="research" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl mb-4 text-white">{t('research.title')}</h2>
          <p className="text-xl text-gray-300">
            {language === 'zh' ? '探索前沿技术，推动科学发展' : 'Exploring cutting-edge technologies, driving scientific advancement'}
          </p>
        </div>

        {/* Featured Research Area */}
        <div className="overflow-hidden bg-gray-700 rounded-lg border border-gray-600 mb-12 card-hover">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="lg:w-2/5">
              <ImageWithFallback
                src={researchPreview.image}
                alt={t(researchPreview.titleKey)}
                className="w-full h-64 lg:h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl mb-6 text-white">
                {t(researchPreview.titleKey)}
              </h3>
              <div className="relative">
                <p className="text-gray-300 leading-relaxed mb-6 line-clamp-4">
                  {t(researchPreview.descriptionKey)}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-700 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-6">
                {researchPreview.keywords[language].map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View All Research Button */}
        <div className="text-center">
          <button
            onClick={() => navigateTo('research')}
            className="btn-primary inline-flex items-center"
          >
            {language === 'zh' ? '查看所有研究领域' : 'View All Research Areas'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}