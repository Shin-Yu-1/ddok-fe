import type { SectionType, SubSectionType } from '../types/sidebar';

import { useSidebarState } from './useSidebarState';

export const useSidebarHandlers = () => {
  const {
    activeSection,
    setActiveSection,
    toggleSection,
    expandedButton,
    activeSubSection,
    setExpandedButton,
    toggleButtonExpansion,
    setActiveSubSection,
  } = useSidebarState();

  const handleButtonClick = (sectionId: SectionType) => {
    if (sectionId === 'chat') {
      if (activeSection === 'chat') {
        // 채팅 섹션이 이미 열려있으면 모든 것 닫기
        setActiveSection(null);
        setExpandedButton(null);
        setActiveSubSection(null);
      } else {
        // 채팅 섹션이 닫혀있으면 드롭다운만 열기
        toggleButtonExpansion(sectionId);
      }
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
