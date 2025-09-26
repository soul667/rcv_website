import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ArrowRight, Users, Mail } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useRouter } from '../Router';
import { useState, useEffect } from 'react';
import { loadAllAuthors, categorizeAuthors } from '../../utils/authorLoader';

interface AuthorData {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  email?: string;
  image: string;
  bio: string;
  bioEn: string;
  research: string[];
  researchEn: string[];
  publications: {
    title: string;
    authors: string;
    venue: string;
    year: number;
    link?: string;
  }[];
  userGroups: string[];
  weight?: number;
  role?: string;
}

export function TeamPreview() {
  const { language, t } = useLanguage();
  const { navigateTo } = useRouter();
  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthorsData = async () => {
      try {
        setLoading(true);
        const authorsData = await loadAllAuthors();
        setAuthors(authorsData);
      } catch (err) {
        console.error('Error loading authors:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthorsData();
  }, []);

  if (loading) {
    return (
      <section id="team" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-white">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  const categorizedAuthors = categorizeAuthors(authors);
  
  // 获取预览成员：教职员工 + 部分学生
  const previewMembers = [
    ...categorizedAuthors.faculty.slice(0, 2), // 最多2个教职员工
    ...categorizedAuthors.phdStudents.slice(0, 2), // 最多2个博士生
    ...categorizedAuthors.masterStudents.slice(0, 2) // 最多2个硕士生
  ].slice(0, 6); // 总共最多6个成员

  const handleMemberClick = (member: AuthorData) => {
    navigateTo('member-profile', member);
  };

  return (
    <section id="team" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-white">{t('team.title')}</h2>
          <p className="text-xl text-slate-300">
            {language === 'zh' ? '由经验丰富的研究人员和充满活力的学生组成的多元化团队' : 'A diverse team of experienced researchers and dynamic students'}
          </p>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-slate-800">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-white font-bold">{authors.length}</h3>
              <p className="text-slate-300">
                {language === 'zh' ? '团队成员' : 'Team Members'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-slate-800">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-white font-bold">{categorizedAuthors.faculty.length}</h3>
              <p className="text-slate-300">
                {language === 'zh' ? '教职员工' : 'Faculty'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-slate-800">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl mb-2 text-white font-bold">{categorizedAuthors.phdStudents.length + categorizedAuthors.masterStudents.length}</h3>
              <p className="text-slate-300">
                {language === 'zh' ? '学生' : 'Students'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Team Members */}
        <div className="mb-12">
          <h3 className="text-2xl mb-8 text-white font-bold text-center">
            {language === 'zh' ? '团队成员' : 'Meet Our Team'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewMembers.map((member) => (
              <Card 
                key={member.id} 
                className="border-0 shadow-lg bg-slate-800 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-slate-700"
                onClick={() => handleMemberClick(member)}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <ImageWithFallback
                      src={member.image}
                      alt={language === 'zh' ? member.name : member.nameEn}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-slate-600"
                    />
                  </div>
                  
                  <h4 className="text-lg text-white mb-2 font-semibold">
                    {language === 'zh' ? member.name : member.nameEn}
                  </h4>
                  
                  <p className="text-slate-300 mb-4 text-sm">
                    {language === 'zh' ? member.title : member.titleEn}
                  </p>
                  
                  {/* Research Interests Preview */}
                  {member.research && member.research.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(language === 'zh' ? member.research : member.researchEn)
                          .slice(0, 2)
                          .map((interest, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {member.email && (
                    <div className="flex justify-center">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-slate-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Team Button */}
        <div className="text-center">
          <button
            onClick={() => navigateTo('team')}
            className="btn-primary inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {language === 'zh' ? '查看完整团队' : 'View Full Team'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {authors.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-300">
              {language === 'zh' ? '暂无团队数据' : 'No team members found.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}