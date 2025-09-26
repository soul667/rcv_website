import { LanguageProvider } from './components/LanguageContext';
import { ThemeProvider } from './components/ThemeContext';
import { RouterProvider, useRouter } from './components/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ResearchPage } from './components/pages/ResearchPage';
import { PublicationsPage } from './components/pages/PublicationsPage';
import { TeamPage } from './components/pages/TeamPage';
import { Contact } from './components/Contact';
import { MemberProfile } from './components/MemberProfile';

function AppContent() {
  const { currentPage, pageData } = useRouter();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'research':
        return <ResearchPage />;
      case 'publications':
        return <PublicationsPage />;
      case 'team':
        return <TeamPage />;
      case 'contact':
        return <Contact />;
      case 'member-profile':
        return <MemberProfile member={pageData} onBack={() => {}} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}