import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { SectionType, SidebarState, SubSectionType } from '../types/sidebar';

export const useSidebarState = create<SidebarState>()(
  persist(
    (set, get) => ({
      // 현재 활성화 된 섹션 (기본은 닫힌 상태)
      activeSection: null,

      expandedButton: null,

      activeSubSection: null,

      // 직접 섹션 설정
      setActiveSection: (section: SectionType | null) => {
        set({ activeSection: section });
      },

      // 같은 섹션 재 클릭 시 닫기
      toggleSection: (section: SectionType) => {
        const { activeSection, expandedButton } = get();

        if (activeSection === section) {
          set({ activeSection: null, expandedButton: null, activeSubSection: null });
        } else {
          set({
            activeSection: section,
            expandedButton: section === 'chat' && expandedButton === 'chat' ? 'chat' : null,
            activeSubSection: null,
          });
        }
      },

      // 버튼 확장 토글 (채팅 버튼의 드롭다운)
      toggleButtonExpansion: (button: SectionType) => {
        const currentExpanded = get().expandedButton;

        if (currentExpanded === button) {
          // 같은 버튼 클릭 → 확장 닫기
          set({
            expandedButton: null,
            activeSubSection: null,
          });
        } else {
          // 다른 버튼 클릭 또는 확장되지 않은 상태 → 확장 열기
          set({
            expandedButton: button,
            activeSubSection: null,
          });
        }
      },

      // 하위 섹션 설정
      setActiveSubSection: (subSection: SubSectionType | null) => {
        set({ activeSubSection: subSection });
      },
    }),
    {
      name: 'sidebar-state',
      partialize: state => ({
        activeSection: state.activeSection,
        expandedButton: state.expandedButton,
        activeSubSection: state.activeSubSection,
      }),
    }
  )
);
