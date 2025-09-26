interface ResearchFrontMatter {
  title: string;
  weight: number;
  date: string;
  draft: boolean;
  featured: boolean;
  image?: {
    filename: string;
    focal_point: string;
    preview_only: boolean;
  };
}

interface ResearchArea {
  id: string;
  title: string;
  weight: number;
  introduction: string;
  details: string;
  image: string;
  folderPath: string;
}

// Parse front matter from markdown content
function parseFrontMatter(content: string): { frontMatter: ResearchFrontMatter; body: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format: no front matter found');
  }

  const frontMatterText = match[1];
  const body = match[2];

  // Simple YAML parser for front matter
  const frontMatter: any = {};
  const lines = frontMatterText.split('\n');
  let currentKey = '';
  let indentLevel = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const indent = line.length - line.trimStart().length;
    
    if (trimmedLine.includes(':')) {
      const [key, ...valueParts] = trimmedLine.split(':');
      const value = valueParts.join(':').trim();
      
      if (indent === 0) {
        // Top level key
        currentKey = key.trim();
        if (value) {
          // Simple value
          frontMatter[currentKey] = parseValue(value);
        } else {
          // Object or array
          frontMatter[currentKey] = {};
        }
      } else {
        // Nested key
        if (frontMatter[currentKey] && typeof frontMatter[currentKey] === 'object') {
          frontMatter[currentKey][key.trim()] = parseValue(value);
        }
      }
    }
  }

  return { frontMatter: frontMatter as ResearchFrontMatter, body };
}

function parseValue(value: string): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value)) && value !== '') return Number(value);
  return value;
}

// Extract introduction and details from markdown body
function parseMarkdownBody(body: string): { introduction: string; details: string } {
  // Extract introduction (everything after **Introduction**: until **Details**:)
  const introMatch = body.match(/\*\*Introduction\*\*:\s*([\s\S]*?)(?=\*\*Details\*\*:|$)/);
  let introduction = introMatch ? introMatch[1].trim() : '';

  // Extract details (everything after **Details**:)
  const detailsMatch = body.match(/\*\*Details\*\*:\s*([\s\S]*?)$/);
  let details = detailsMatch ? detailsMatch[1].trim() : '';

  // Convert markdown links to HTML links
  introduction = convertMarkdownLinks(introduction);
  details = convertMarkdownLinks(details);

  return { introduction, details };
}

// Convert markdown links to simple styled links
function convertMarkdownLinks(text: string): string {
  // Convert [text](/path) to simple but attractive tags
  let result = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="inline-block px-4 py-2 mx-1 my-1 text-sm font-medium bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors duration-200 cursor-pointer">$1</span>');
  
  // Convert **bold** to <strong>
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  
  // Convert <br> tags to actual line breaks
  result = result.replace(/<br\s*\/?>/gi, '<br />');
  
  // Convert line breaks to <br> tags for proper HTML rendering
  result = result.replace(/\n\n/g, '<br /><br />');
  result = result.replace(/\n/g, ' ');
  
  // Clean up extra commas and spaces around tags
  result = result.replace(/,\s*</g, ' <');
  result = result.replace(/>\s*,/g, '> ');
  
  return result;
}

// Get image path for research area
function getResearchImage(folderPath: string, filename: string): string {
  if (!filename) {
    // Return a default placeholder image if no filename
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop';
  }
  
  // Map folder paths to their actual image file extensions
  const imageMap: { [key: string]: string } = {
    'simultaneous localization and mapping': 'featured.gif',
    'semantic scene understanding': 'featured.png',
    'human-robot interaction': 'featured.gif',
    'perception with the polarization camera': 'featured.png'
  };
  
  // Use the mapped filename or fallback to the original filename
  const actualFilename = imageMap[folderPath] || `${filename}.png`;
  
  return `/content/research/${folderPath}/${actualFilename}`;
}

// Load all research areas
export async function loadResearchAreas(): Promise<ResearchArea[]> {
  const researchAreas: ResearchArea[] = [];
  
  // Define research folders (based on the attached folder structure)
  const researchFolders = [
    'simultaneous localization and mapping',
    'semantic scene understanding', 
    'human-robot interaction',
    'perception with the polarization camera'
  ];

  for (const folder of researchFolders) {
    try {
      const response = await fetch(`/content/research/${folder}/index.md`);
      if (!response.ok) {
        console.warn(`Failed to load research area: ${folder}`);
        continue;
      }
      
      const content = await response.text();
      const { frontMatter, body } = parseFrontMatter(content);
      const { introduction, details } = parseMarkdownBody(body);
      
      const researchArea: ResearchArea = {
        id: folder.replace(/\s+/g, '-').toLowerCase(),
        title: frontMatter.title,
        weight: frontMatter.weight || 0,
        introduction,
        details,
        image: getResearchImage(folder, frontMatter.image?.filename || 'featured'),
        folderPath: folder
      };
      
      researchAreas.push(researchArea);
    } catch (error) {
      console.error(`Error loading research area ${folder}:`, error);
    }
  }

  // Sort by weight
  return researchAreas.sort((a, b) => a.weight - b.weight);
}

export type { ResearchArea };
