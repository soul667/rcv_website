import { Hero } from './Hero';
import { useLanguage } from './LanguageContext';
import { ResearchPreview } from './previews/ResearchPreview';
import { PublicationsPreview } from './previews/PublicationsPreview';
import { TeamPreview } from './previews/TeamPreview';
// import { ContactPreview } from './previews/ContactPreview';

export function HomePage() {
  const { t, language } = useLanguage();

  return (
    <>
      <Hero />
      
      {/* Lab Description Section */}
      <section
        data-testid="home-intro"
        className="bg-gray-900 border-b border-white/5 py-16 md:py-24"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl transition-all duration-300 hover:bg-white/8 md:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
              <div className="flex flex-col items-start gap-5">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-[#CB743B]" />
                  {t('hero.subtitle')}
                </div>
                <div className="w-16 h-1 rounded-full bg-[#CB743B]" />
                <p className="max-w-[18rem] text-sm leading-relaxed text-gray-400">
                  {language === 'zh'
                    ? '保留全部介绍内容，仅通过更清晰的阅读层级与留白来改善首页观感。'
                    : 'The full introduction remains intact, now presented with clearer hierarchy, spacing, and readability.'}
                </p>
              </div>

              <div className="space-y-8">
                <p
                  data-testid="home-intro-paragraph-1"
                  className="max-w-4xl text-left text-xl md:text-2xl leading-relaxed text-gray-100 font-light"
                >
                  {t('hero.description1')}
                </p>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
                  <p
                    data-testid="home-intro-paragraph-2"
                    className="max-w-3xl text-left text-lg md:text-xl leading-relaxed text-gray-300"
                  >
                    {t('hero.description2')}
                  </p>
                </div>
              </div>
            </div>
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
