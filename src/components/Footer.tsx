import { useLanguage } from './LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-white/10 bg-gray-800/95 py-6 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-400">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
