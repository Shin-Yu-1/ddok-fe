export type SectionType = 'notification' | 'chat' | 'friend' | 'map';

export interface ButtonConfig {
  id: SectionType;
  label: string;
  icon: React.ReactNode;
}

export interface SidebarState {
  activeSection: SectionType | null;
  setActiveSection: (section: SectionType | null) => void;
  toggleSection: (section: SectionType) => void;
}

export interface SideSectionProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}
