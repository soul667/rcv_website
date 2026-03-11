import { useLanguage } from './LanguageContext';
import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  const { t, language } = useLanguage();

  const emailAddress = 'yantc@mail.sustech.edu.cn';
  const address = language === 'zh' 
    ? '南方科技大学 电子与电气工程系'
    : 'Dept. of EEE, SUSTech, Shenzhen';

  return (
    <div className="bg-[#0a0f18] mt-auto border-t border-white/5 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center gap-6">
        
        {/* Contact Info (Centered) */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 text-sm tracking-wide text-gray-300 font-light">
          <a href={`mailto:${emailAddress}`} className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
            <Mail className="w-4 h-4 text-white" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>{emailAddress}</span>
          </a>
          
          <a href="https://maps.google.com/?q=Southern+University+of+Science+and+Technology" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
            <MapPin className="w-4 h-4 text-white" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>{address}</span>
          </a>
        </div>
      </div>
      
      {/* Bottom Copyright */}
      <div className="text-center mt-8">
         <p className="text-xs tracking-[0.05em] text-gray-400 font-light uppercase">
           {t('footer.copyright')}
         </p>
      </div>
    </div>
  );
}
