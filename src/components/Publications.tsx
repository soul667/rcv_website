import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Users, Calendar, BookOpen } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useState, useEffect } from 'react';
import { Publication, loadPublications } from '../utils/bibParser';

interface PublicationsProps {
  sectionClassName?: string;
}

export default function Publications({ sectionClassName = 'py-20 bg-slate-900' }: PublicationsProps) {
  const { t } = useLanguage();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const pubs = await loadPublications();
        setPublications(pubs);
      } catch (error) {
        console.error('Failed to load publications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return (
      <section id="publications" className={sectionClassName}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading publications...</p>
          </div>
        </div>
      </section>
    );
  }

  const recentPublications = publications.filter(pub => pub.year >= 2020);
  const journalPapers = publications.filter(pub => pub.type === "Journal");
  const conferencePapers = publications.filter(pub => pub.type === "Conference" || pub.type === "InProceedings");

  return (
    <section id="publications" className={sectionClassName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-white">{t('publications.title')}</h2>
          <p className="text-xl text-slate-300">Research Publications and Academic Contributions</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-slate-800">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-white font-bold">{publications.length}</h3>
              <p className="text-slate-300">Total Publications</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-slate-800">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-white font-bold">{recentPublications.length}</h3>
              <p className="text-slate-300">Recent (2020+)</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-slate-800">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-white font-bold">{journalPapers.length}</h3>
              <p className="text-slate-300">Journal Papers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Publications */}
        <div className="mb-16">
          <h3 className="text-2xl mb-8 text-white font-bold">{t('publications.recent')}</h3>
          <div className="space-y-6">
            {recentPublications.slice(0, 5).map((pub) => (
              <Card key={pub.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-slate-800">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl text-white pr-4 font-semibold">{pub.title}</h4>
                        <Badge variant={pub.type === 'Journal' ? 'default' : 'secondary'} className="shrink-0">
                          {pub.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-slate-300 mb-3">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{pub.authors.join(', ')}</span>
                      </div>
                      
                      <div className="flex items-center text-slate-300 mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{pub.venue}, {pub.year}</span>
                      </div>
                      
                      {pub.abstract && (
                        <p className="text-slate-300 mb-4 leading-relaxed">
                          {pub.abstract}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-slate-600">
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Paper</span>
                      </a>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>DOI</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Publications by Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Journal Papers */}
          <div>
            <h3 className="text-2xl mb-6 text-white font-bold">Journal Papers ({journalPapers.length})</h3>
            <div className="space-y-4">
              {journalPapers.map((pub) => (
                <Card key={pub.id} className="border-0 shadow hover:shadow-lg transition-shadow bg-slate-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg text-white mb-2 font-semibold leading-snug">{pub.title}</h4>
                    <p className="text-slate-300 mb-2 text-sm">{pub.authors.join(', ')}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-400 text-sm">{pub.venue}, {pub.year}</p>
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          <ExternalLink className="h-3 w-3 inline" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Conference Papers */}
          <div>
            <h3 className="text-2xl mb-6 text-white font-bold">Conference Papers ({conferencePapers.length})</h3>
            <div className="space-y-4">
              {conferencePapers.map((pub) => (
                <Card key={pub.id} className="border-0 shadow hover:shadow-lg transition-shadow bg-slate-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg text-white mb-2 font-semibold leading-snug">{pub.title}</h4>
                    <p className="text-slate-300 mb-2 text-sm">{pub.authors.join(', ')}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-400 text-sm">{pub.venue}, {pub.year}</p>
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          <ExternalLink className="h-3 w-3 inline" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {publications.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-300">No publications found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
