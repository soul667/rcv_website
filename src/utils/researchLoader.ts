import { parse as parseTOML } from 'smol-toml';

interface ResearchArea {
  meta: {
    title: string;
    title_zh: string;
    weight: number;
    image: string;
    color: string;
  };
  description: {
    en: string;
    zh: string;
  };
  keywords: {
    en: string;
    zh: string;
  }[];
  members: {
    name: string;
    slug: string;
    topic: string;
    topic_zh: string;
  }[];
  folderPath: string; // Keep for internal tracking if needed
}

// Load all research areas
export async function loadResearchAreas(): Promise<ResearchArea[]> {
  const researchAreas: ResearchArea[] = [];
  
  const researchFolders = [
    'simultaneous localization and mapping',
    'semantic scene understanding', 
    'human-robot interaction',
    'perception with the polarization camera'
  ];

  for (const folder of researchFolders) {
    try {
      const response = await fetch(`/content/research/${encodeURIComponent(folder)}/index.toml`);
      if (!response.ok) {
        console.warn(`Failed to load research area TOML: ${folder}`);
        continue;
      }
      
      const content = await response.text();
      const data = parseTOML(content) as any;
      
      const researchArea: ResearchArea = {
        ...data,
        folderPath: folder
      };
      
      researchAreas.push(researchArea);
    } catch (error) {
      console.error(`Error loading research area TOML ${folder}:`, error);
    }
  }

  // Sort by weight defined in meta
  return researchAreas.sort((a, b) => (a.meta?.weight || 0) - (b.meta?.weight || 0));
}

export type { ResearchArea };
