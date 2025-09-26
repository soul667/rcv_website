import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.research': 'Research',
    'nav.publications': 'Publications',
    'nav.team': 'Team',
    'nav.contact': 'Contact',
    'nav.light': 'Light',
    'nav.dark': 'Dark',
    
    // Hero Section
    'hero.title': 'Welcome to Robotics and Computer Vision Lab',
    'hero.subtitle': 'RCV Lab',
    'hero.description1': 'The Robotics and Computer Vision Lab (RCV Lab) is committed to cutting-edge research in the field of robotics. The laboratory focuses on the development and application of key technologies such as Simultaneous Localization and Mapping (SLAM), semantic scene understanding, and human-robot interaction.',
    'hero.description2': 'Our research covers multiple aspects of robot autonomous navigation, environmental perception, intelligent decision-making, etc., aiming to promote the widespread application of robot technology in the real world.',
    
    // Research Section
    'research.title': 'Research Areas',
    'research.slam.title': 'Simultaneous Localization And Mapping (SLAM)',
    'research.slam.description': 'SLAM is a technique for acquiring 3D structure of unknown environments and sensor motion. This technique has been widely proposed for achieving autonomous control of robots in robotics. SLAM requires cyclic between simultaneous related mapping and localization tasks, involving fusion of deep learning and traditional methods. We focus on Visual SLAM (V-SLAM) and LiDAR SLAM research, committed to improving the accuracy of object detection, semantic segmentation and advanced environmental information.',
    'research.ssl.title': 'Semantic Scene Understanding',
    'research.ssl.description': 'In robotics, Semantic Scene Understanding (SSU) refers to the interpretation and understanding of visual scenes involving inter-class correlations. It involves identifying high-level semantic information such as object categories, spatial relationships between objects, semantic mapping, grasping, etc. Within this group, we focus on SSU algorithms that solve problems like scene graph generation, visual localization, point cloud understanding.',
    'research.hri.title': 'Human-robot Interaction',
    'research.hri.description': 'We are committed to developing robots that can interact naturally with humans. The goal is to create robotic systems that can understand human intentions, predict human behavior and respond appropriately. We focus on developing robots with these capabilities for human-robot collaboration applications.',
    
    // Team Section
    'team.title': 'Lab Members',
    'team.faculty': 'Faculty Members',
    'team.phd': 'Ph.D Students',
    'team.viewProfile': 'View Profile',
    'team.backToTeam': 'Back to Team',
    
    // Publications Section
    'publications.title': 'Publications',
    'publications.recent': 'Recent Publications',
    
    // Contact Section
    'contact.title': 'Contact Us',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.website': 'Website',
    'contact.mapLocation': 'Map Location',
    
    // Footer
    'footer.description': 'Committed to cutting-edge research in robotics and computer vision, promoting the application of artificial intelligence technology in the real world.',
    'footer.quickLinks': 'Quick Links',
    'footer.researchAreas': 'Research Areas',
    'footer.copyright': '© 2024 Robotics and Computer Vision Lab. All rights reserved.',
    
    // Member Details
    'member.aboutMe': 'About Me',
    'member.research': 'Research',
    'member.publications': 'Publications',
    'member.contact': 'Contact',
  },
  zh: {
    // Navigation
    'nav.home': '主页',
    'nav.research': '研究',
    'nav.publications': '发表',
    'nav.team': '团队',
    'nav.contact': '联系',
    'nav.light': '明亮',
    'nav.dark': '深色',
    
    // Hero Section
    'hero.title': '欢迎来到机器人与计算机视觉实验室',
    'hero.subtitle': '机器人与计算机视觉实验室',
    'hero.description1': '机器人与计算机视觉实验室（RCV Lab）致力于在机器人领域进行前沿研究。实验室专注于同步定位与地图构建（SLAM）、语义场景理解、人机交互等关键技术的开发与应用。',
    'hero.description2': '我们的研究涵盖了机器人自主导航、环境感知、智能决策等多个方面，旨在推动机器人技术在现实世界中的广泛应用。',
    
    // Research Section
    'research.title': '研究领域',
    'research.slam.title': '同步定位与地图构建 (SLAM)',
    'research.slam.description': 'SLAM是一种用于获取未知环境三维结构和传感器运动的技术。该技术被广泛提出用于实现机器人在机器人技术中的自主控制。SLAM需要从同时进行的相关映射和定位任务之间的循环，涉及深度学习和传统方法的融合。我们专注于视觉SLAM（V-SLAM）和激光雷达SLAM的研究，致力于提高目标检测、语义分割和高级环境信息的准确性。',
    'research.ssl.title': '语义场景理解',
    'research.ssl.description': '在机器人学中，语义场景理解（SSU）指的是对视觉场景的解释和理解，涉及到类间相关性。它涉及识别高级语义信息，如对象类别、对象之间的空间关系、语义映射、抓取等。在这个组内，我们专注于解决场景图生成、视觉定位、点云理解等问题的SSU算法。',
    'research.hri.title': '人机交互',
    'research.hri.description': '我们致力于开发能够与人类进行自然交互的机器人。目标是创建能够理解人类意图、预测人类行为并做出适当反应的机器人系统。我们专注于开发具有这些能力的机器人，用于人机协作应用。',
    
    // Team Section
    'team.title': '实验室成员',
    'team.faculty': '教师成员',
    'team.phd': '博士研究生',
    'team.viewProfile': '查看详情',
    'team.backToTeam': '返回团队',
    
    // Publications Section
    'publications.title': '发表论文',
    'publications.recent': '最新发表',
    
    // Contact Section
    'contact.title': '联系我们',
    'contact.address': '地址',
    'contact.phone': '电话',
    'contact.email': '邮箱',
    'contact.website': '网站',
    'contact.mapLocation': '地图位置',
    
    // Footer
    'footer.description': '致力于机器人技术和计算机视觉领域的前沿研究，推动人工智能技术在现实世界中的应用。',
    'footer.quickLinks': '快速链接',
    'footer.researchAreas': '研究领域',
    'footer.copyright': '© 2024 机器人与计算机视觉实验室. 保留所有权利.',
    
    // Member Details
    'member.aboutMe': '个人简介',
    'member.research': '研究方向',
    'member.publications': '发表论文',
    'member.contact': '联系方式',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}