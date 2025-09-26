import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, Users, Calendar, BookOpen } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useRouter } from '../Router';

const featuredPublications = [
  {
    id: 1,
    title: "Deep Learning Approaches for Visual SLAM in Dynamic Environments",
    authors: ["Hong Zhang", "Li Wei", "Wang Ming"],
    venue: "IEEE Transactions on Robotics",
    year: 2024,
    type: "Journal"
  },
  {
    id: 2,
    title: "Semantic Scene Understanding for Autonomous Navigation",
    authors: ["Hong Zhang", "Chen Xiao"],
    venue: "International Conference on Computer Vision (ICCV)",
    year: 2024,
    type: "Conference"
  },
  {
    id: 3,
    title: "Interactive Learning for Service Robots",
    authors: ["Li Wei", "Zhao Li"],
    venue: "IEEE International Conference on Robotics and Automation (ICRA)",
    year: 2024,
    type: "Conference"
  }
];

export function PublicationsPreview() {
  const { language, t } = useLanguage();
  const { navigateTo } = useRouter();

  return (
    <section id="publications" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-slate-800">{t('publications.title')}</h2>
          <p className="text-xl text-slate-600">
            {language === 'zh' ? '最新学术成果和研究贡献' : 'Latest academic achievements and research contributions'}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-slate-800">25+</h3>
              <p className="text-slate-600">
                {language === 'zh' ? '发表论文' : 'Publications'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-slate-800">8</h3>
              <p className="text-slate-600">
                {language === 'zh' ? '近期发表 (2023-2024)' : 'Recent (2023-2024)'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-slate-800">12</h3>
              <p className="text-slate-600">
                {language === 'zh' ? '期刊论文' : 'Journal Papers'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Publications Preview */}
        <div className="mb-12">
          <h3 className="text-2xl mb-8 text-slate-800">
            {language === 'zh' ? '近期精选论文' : 'Featured Recent Publications'}
          </h3>
          <div className="space-y-6 relative">
            {featuredPublications.map((pub, index) => (
              <Card key={pub.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg text-slate-800 pr-4">{pub.title}</h4>
                        <Badge variant={pub.type === 'Journal' ? 'default' : 'secondary'}>
                          {pub.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-slate-600 mb-2">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{pub.authors.join(', ')}</span>
                      </div>
                      
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{pub.venue}, {pub.year}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* View All Publications Button */}
        <div className="text-center">
          <Button
            onClick={() => navigateTo('publications')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            {language === 'zh' ? '查看所有发表论文' : 'View All Publications'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}