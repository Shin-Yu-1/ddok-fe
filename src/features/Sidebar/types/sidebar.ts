export type SectionType = 'notification' | 'chat' | 'map';
export type SubSectionType = 'personal-chat' | 'group-chat';

export interface SubButtonConfig {
  id: SubSectionType;
  label: string;
  icon: React.ReactNode;
}

export interface ButtonConfig {
  id: SectionType;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  subButtons?: SubButtonConfig[];
}

export interface SidebarState {
  activeSection: SectionType | null;
  expandedButton: SectionType | null;
  activeSubSection: SubSectionType | null;
  setActiveSection: (section: SectionType | null) => void;
  toggleSection: (section: SectionType) => void;
  setExpandedButton: (button: SectionType | null) => void;
  toggleButtonExpansion: (button: SectionType) => void;
  setActiveSubSection: (subSection: SubSectionType | null) => void;
}

export interface SideSectionProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}
