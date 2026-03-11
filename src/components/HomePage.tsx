import { Hero } from './Hero';
import { useLanguage } from './LanguageContext';
import { ResearchPreview } from './previews/ResearchPreview';
import { PublicationsPreview } from './previews/PublicationsPreview';
import { TeamPreview } from './previews/TeamPreview';
// import { ContactPreview } from './previews/ContactPreview';

export function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      
      {/* Lab Description Section */}
      <section className="py-16 md:py-24 bg-gray-900 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-200 mb-8 font-light text-center">
              {t('hero.description1')}
            </p>
            <div className="w-16 h-1 bg-[#CB743B] mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl leading-relaxed text-gray-300 text-center">
              {t('hero.description2')}
            </p>
          </div>
        </div>
      </section>

      {/* <ResearchPreview /> */}
      {/* <PublicationsPreview /> */}
      {/* <TeamPreview /> */}
      {/* <ContactPreview /> */}
    </>
  );
}