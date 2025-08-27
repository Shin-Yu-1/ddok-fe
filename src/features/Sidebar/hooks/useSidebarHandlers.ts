import type { SectionType } from '../types/sidebar';

import { useSidebarState } from './useSidebarState';

export const useSidebarHandlers = () => {
  const { activeSection, setActiveSection, toggleSection } = useSidebarState();

  const handleButtonClick = (sectionId: SectionType) => {
    toggleSection(sectionId);
  };

  const openSection = (sectionId: SectionType) => {
    setActiveSection(sectionId);
  };

  const closeAllSections = () => {
    setActiveSection(null);
  };

  const isSectionOpen = (sectionId: SectionType): boolean => {
    return activeSection === sectionId;
  };

  const isAnySectionOpen = (): boolean => {
    return activeSection !== null;
  };

  return {
    // 기본 핸들러
    handleButtonClick,

    openSection,
    closeAllSections,

    // 상태 확인용
    isSectionOpen,
    isAnySectionOpen,

    // 현재 상태
    activeSection,
  };
};
