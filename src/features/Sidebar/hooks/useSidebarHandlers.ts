import type { SectionType, SubSectionType } from '../types/sidebar';

import { useSidebarState } from './useSidebarState';

export const useSidebarHandlers = () => {
  const {
    activeSection,
    setActiveSection,
    toggleSection,
    expandedButton,
    activeSubSection,
    toggleButtonExpansion,
    setActiveSubSection,
  } = useSidebarState();

  const handleButtonClick = (sectionId: SectionType) => {
    if (sectionId === 'chat') {
      // 채팅 버튼 → 드롭다운 열기 (섹션은 안 염)
      toggleButtonExpansion(sectionId);
    } else {
      // 다른 버튼들은 기존 동작
      toggleSection(sectionId);
    }
  };

  const handleSubButtonClick = (subSectionId: SubSectionType) => {
    setActiveSection('chat');
    setActiveSubSection(subSectionId);
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

  const isButtonExpanded = (buttonId: SectionType): boolean => {
    return expandedButton === buttonId;
  };

  const isSubSectionActive = (subSectionId: SubSectionType): boolean => {
    return activeSubSection === subSectionId;
  };

  const isAnySectionOpen = (): boolean => {
    return activeSection !== null;
  };

  return {
    // 기본 핸들러
    handleButtonClick,
    handleSubButtonClick,

    openSection,
    closeAllSections,

    // 상태 확인용
    isSectionOpen,
    isButtonExpanded,
    isSubSectionActive,
    isAnySectionOpen,

    // 현재 상태
    activeSection,
    expandedButton,
    activeSubSection,
  };
};
