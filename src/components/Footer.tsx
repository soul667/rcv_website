import { Bot } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function Footer() {
  const { language, t } = useLanguage();
  return (
    <footer className="bg-gray-800 py-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Bot className="h-8 w-8 text-blue-400" />
              <div>
                <div className="gradient-text">
                  {language === 'zh' ? '机器人与计算机视觉实验室' : 'Robotics and Computer Vision Lab'}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'zh' ? 'Robotics and Computer Vision Lab' : 'RCV Lab'}
                </div>
              </div>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#research" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('nav.research')}
                </a>
              </li>
              <li>
                <a href="#publications" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('nav.publications')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Research Areas */}
          <div>
            <h3 className="text-lg mb-4 text-white">{t('footer.researchAreas')}</h3>
            <ul className="space-y-3">
              <li className="rounded-lg p-2 bg-gray-700 border border-gray-600">
                <span className="text-gray-300">SLAM</span>
              </li>
              <li className="rounded-lg p-2 bg-gray-700 border border-gray-600">
                <span className="text-gray-300">
                  {language === 'zh' ? '语义场景理解' : 'Semantic Scene Understanding'}
                </span>
              </li>
              <li className="rounded-lg p-2 bg-gray-700 border border-gray-600">
                <span className="text-gray-300">
                  {language === 'zh' ? '人机交互' : 'Human-Robot Interaction'}
                </span>
              </li>
              <li className="rounded-lg p-2 bg-gray-700 border border-gray-600">
                <span className="text-gray-300">
                  {language === 'zh' ? '计算机视觉' : 'Computer Vision'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}