import { Card, CardContent } from './ui/card';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useRouter } from './Router';
import { BackButton } from './BackButton';

interface ContactProps {
  isStandalonePage?: boolean;
}

export function Contact({ isStandalonePage = false }: ContactProps) {
  const { language, t } = useLanguage();
  const { navigateTo, currentPage } = useRouter();

  const isContactPage = currentPage === 'contact';
  const sectionBg = isContactPage ? "py-20 bg-slate-50 min-h-screen pt-32" : "py-20 bg-slate-50";
  
  return (
    <section id="contact" className={sectionBg}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isContactPage && (
          <BackButton onClick={() => navigateTo('home')} theme="light" />
        )}
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-slate-800">{t('contact.title')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg mb-2 text-slate-800">{t('contact.address')}</h3>
                    <p className="text-slate-600">
                      {language === 'zh' ? (
                        <>
                          中国深圳市南山区<br />
                          南方科技大学<br />
                          电子与电气工程系
                        </>
                      ) : (
                        <>
                          Department of Electronic and Electrical Engineering<br />
                          Southern University of Science and Technology<br />
                          Nanshan District, Shenzhen, China
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg mb-2 text-slate-800">{t('contact.phone')}</h3>
                    <p className="text-slate-600">+86 755 8801 0000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg mb-2 text-slate-800">{t('contact.email')}</h3>
                    <p className="text-slate-600">rcvlab@sustech.edu.cn</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Globe className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg mb-2 text-slate-800">{t('contact.website')}</h3>
                    <p className="text-slate-600">www.rcvlab.sustech.edu.cn</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="bg-slate-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center text-slate-600">
              <MapPin className="h-12 w-12 mx-auto mb-4" />
              <p>{t('contact.mapLocation')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}