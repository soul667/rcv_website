import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useState, useEffect } from 'react';
import { loadAllAuthors, categorizeAuthors } from '../utils/authorLoader';
import { getTeamCarouselConfig } from '../utils/config';

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
  weight?: number;
  role?: string;
  userGroups: string[];
  social?: {
    icon: string;
    icon_pack: string;
    link: string;
  }[];
  markdownContent?: string;
}

interface TeamMembersProps {
  onMemberClick?: (member: any) => void;
}

export function TeamMembers({ onMemberClick }: TeamMembersProps) {
  const { language, t } = useLanguage();
  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const teamCarouselConfig = getTeamCarouselConfig();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 轮播图自动播放
  useEffect(() => {
    if (teamCarouselConfig.autoPlay) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % teamCarouselConfig.slides.length);
      }, teamCarouselConfig.slideDuration);
      return () => clearInterval(timer);
    }
  }, [teamCarouselConfig.autoPlay, teamCarouselConfig.slideDuration, teamCarouselConfig.slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamCarouselConfig.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamCarouselConfig.slides.length) % teamCarouselConfig.slides.length);
  };

  useEffect(() => {
    const loadAuthorsData = async () => {
      try {
        setLoading(true);
        const authorsData = await loadAllAuthors();
        setAuthors(authorsData);
      } catch (err) {
        console.error('Error loading authors:', err);
        setError('Failed to load team members');
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-white">{t('team.title')}</h2>
            <p className="text-white">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="team" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-white">{t('team.title')}</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const { faculty, phdStudents, masterStudents, researchAssociates, administrativeAssistants, others } = categorizeAuthors(authors);

  return (
    <section id="team" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Photo Carousel */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-lg">
            {/* Background Image */}
            <div className="relative h-64 lg:h-80">
              <ImageWithFallback
                src={teamCarouselConfig.slides[currentSlide].image}
                alt={teamCarouselConfig.slides[currentSlide].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
            </div>

            {/* Navigation Arrows */}
            {teamCarouselConfig.showNavigation && teamCarouselConfig.slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {teamCarouselConfig.showIndicators && teamCarouselConfig.slides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-full px-6 py-3 shadow-lg">
                  <div className="flex space-x-3">
                    {teamCarouselConfig.slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-125 shadow-lg' 
                            : 'bg-white/50 hover:bg-white/70 hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-white">{t('team.title')}</h2>
        </div>

        {/* Faculty Members */}
        {faculty.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl mb-8 text-white text-center">{t('team.faculty')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faculty.map((member, index) => (
                <Card key={member.id} className="bg-transparent border-transparent hover:bg-transparent transition-all duration-300 cursor-pointer group shadow-none">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h4 className="text-xl mb-1 text-white">
                      {language === 'zh' ? member.name : member.nameEn}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {language === 'zh' ? member.title : member.titleEn}
                    </p>
                    <div className="flex justify-center space-x-2 mb-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMemberClick?.(member)}
                      className="group-hover:bg-orange-500 group-hover:text-white transition-colors"
                    >
                      {t('team.viewProfile')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* PhD Students */}
        {phdStudents.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl mb-8 text-white text-center">{t('team.phd')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phdStudents.map((student, index) => (
                <Card key={student.id} className="bg-transparent border-transparent hover:bg-transparent transition-all duration-300 cursor-pointer group shadow-none">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <ImageWithFallback
                        src={student.image}
                        alt={student.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h4 className="text-lg mb-1 text-white">
                      {language === 'zh' ? student.name : student.nameEn}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {language === 'zh' ? student.title : student.titleEn}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMemberClick?.(student)}
                      className="group-hover:bg-orange-500 group-hover:text-white transition-colors"
                    >
                      {t('team.viewProfile')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Master Students */}
        {masterStudents.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl mb-8 text-white text-center">Master Students</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masterStudents.map((student, index) => (
                <Card key={student.id} className="bg-transparent border-transparent hover:bg-transparent transition-all duration-300 cursor-pointer group shadow-none">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <ImageWithFallback
                        src={student.image}
                        alt={student.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h4 className="text-lg mb-1 text-white">
                      {language === 'zh' ? student.name : student.nameEn}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {language === 'zh' ? student.title : student.titleEn}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMemberClick?.(student)}
                      className="group-hover:bg-orange-500 group-hover:text-white transition-colors"
                    >
                      {t('team.viewProfile')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Research Associates */}
        {researchAssociates.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl mb-8 text-white text-center">Research Associates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchAssociates.map((associate, index) => (
                <Card key={associate.id} className="bg-transparent border-transparent hover:bg-transparent transition-all duration-300 cursor-pointer group shadow-none">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <ImageWithFallback
                        src={associate.image}
                        alt={associate.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h4 className="text-lg mb-1 text-white">
                      {language === 'zh' ? associate.name : associate.nameEn}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {language === 'zh' ? associate.title : associate.titleEn}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMemberClick?.(associate)}
                      className="group-hover:bg-orange-500 group-hover:text-white transition-colors"
                    >
                      {t('team.viewProfile')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Administrative Assistants */}
        {administrativeAssistants.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl mb-8 text-white text-center">Administrative Assistants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {administrativeAssistants.map((assistant, index) => (
                <Card key={assistant.id} className="bg-transparent border-transparent hover:bg-transparent transition-all duration-300 cursor-pointer group shadow-none">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <ImageWithFallback
                        src={assistant.image}
                        alt={assistant.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h4 className="text-lg mb-1 text-white">
                      {language === 'zh' ? assistant.name : assistant.nameEn}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {language === 'zh' ? assistant.title : assistant.titleEn}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMemberClick?.(assistant)}
                      className="group-hover:bg-orange-500 group-hover:text-white transition-colors"
                    >
                      {t('team.viewProfile')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other Members */}
        {others.length > 0 && (
          <div>
            <h3 className="text-2xl mb-8 text-white text-center">Other Members</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((member, index) => (
                <Card key={member.id} className="bg-transparent border-transparent hover:bg-transparent transition-all duration-300 cursor-pointer group shadow-none">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h4 className="text-lg mb-1 text-white">
                      {language === 'zh' ? member.name : member.nameEn}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {language === 'zh' ? member.title : member.titleEn}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMemberClick?.(member)}
                      className="group-hover:bg-orange-500 group-hover:text-white transition-colors"
                    >
                      {t('team.viewProfile')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
