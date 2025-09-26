import { TeamMembers } from '../TeamMembers';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useRouter } from '../Router';

interface TeamPageProps {
  onMemberClick?: (member: any) => void;
}

export function TeamPage({ onMemberClick }: TeamPageProps) {
  const { language } = useLanguage();
  const { navigateTo } = useRouter();

  const handleMemberClick = (member: any) => {
    navigateTo('member-profile', member);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          onClick={() => navigateTo('home')}
          variant="ghost"
          className="mb-8 text-gray-300 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'zh' ? '返回主页' : 'Back to Home'}
        </Button>
      </div>
      
      {/* Use existing TeamMembers component */}
      <TeamMembers onMemberClick={handleMemberClick} />
    </div>
  );
}