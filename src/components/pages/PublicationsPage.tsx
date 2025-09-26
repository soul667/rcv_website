import Publications from '../Publications.tsx';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useRouter } from '../Router';

export function PublicationsPage() {
  const { language } = useLanguage();
  const { navigateTo } = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          onClick={() => navigateTo('home')}
          variant="ghost"
          className="mb-8 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'zh' ? '返回主页' : 'Back to Home'}
        </Button>
      </div>
      
      {/* Use existing Publications component */}
      <Publications />
    </div>
  );
}
