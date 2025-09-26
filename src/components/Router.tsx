import { createContext, useContext, useState, ReactNode } from 'react';

type Page = 'home' | 'research' | 'publications' | 'team' | 'contact' | 'member-profile';

interface RouterContextType {
  currentPage: Page;
  navigateTo: (page: Page, data?: any) => void;
  pageData?: any;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);

  const navigateTo = (page: Page, data?: any) => {
    setCurrentPage(page);
    setPageData(data || null);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentPage, navigateTo, pageData }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}