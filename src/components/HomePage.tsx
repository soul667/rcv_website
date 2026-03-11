import { Hero } from './Hero';
import { useLanguage } from './LanguageContext';
import { ResearchPreview } from './previews/ResearchPreview';
import { PublicationsPreview } from './previews/PublicationsPreview';
import { TeamPreview } from './previews/TeamPreview';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import homeZh from '../../assets/docs/home_zh.md?raw';
import homeEn from '../../assets/docs/home_en.md?raw';
// import { ContactPreview } from './previews/ContactPreview';

export function HomePage() {
  const { t, language } = useLanguage();
  const mdContent = language === 'zh' ? homeZh : homeEn;

  return (
    <>
      <Hero />
      
      {/* Lab Description Section */}
      <section
        id="intro"
        data-testid="home-intro"
        className="border-b border-white/5 w-full"
        style={{ paddingTop: '50px', paddingBottom: '2rem', backgroundColor: '#1c1c1f' }}
      >
        <style>{`
          .markdown-custom-wrapper .markdown-body {
            background-color: transparent !important;
            padding: 0 !important;
            font-family: inherit !important;
          }
          .markdown-custom-wrapper p {
            font-size: 1.125rem;
            line-height: 1.7777778;
            color: rgba(209,213,219,0.9);
            margin-bottom: 2rem;
            text-align: justify;
          }
          .markdown-custom-wrapper ul {
            list-style-type: disc;
            padding-left: 2rem;
            margin-bottom: 2.5rem;
            font-size: 1.125rem;
            color: rgba(209,213,219,0.9);
          }
          .markdown-custom-wrapper ul li {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
        `}</style>
        
        <div className="max-w-6xl mx-auto px-6 pt-4 pb-8 md:pt-6 md:pb-12 markdown-custom-wrapper">
          <div className="w-full">
            <div className="max-w-none">
              <div className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {mdContent}
                </ReactMarkdown>
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
