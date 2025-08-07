import React from 'react';

// View types
export type ViewType = 'landing' | '1996' | '2025' | 'admin';

// Component Props
export interface LandingPageProps {
  onYearSelect: (year: ViewType) => void;
}

export interface Windows95DesktopProps {
  onBack: () => void;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

export interface ModernSiteProps {
  onBack: () => void;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

// You can add more shared types and interfaces here as needed