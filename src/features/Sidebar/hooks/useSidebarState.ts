import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { SectionType, SidebarState } from '../types/sidebar';

export const useSidebarState = create<SidebarState>()(
  persist(
    (set, get) => ({
      // 현재 활성화 된 섹션 (기본은 닫힌 상태)
      activeSection: null,

      // 직접 섹션 설정
      setActiveSection: (section: SectionType | null) => {
        set({ activeSection: section });
      },

      // 같은 섹션 재 클릭 시 닫기
      toggleSection: (section: SectionType) => {
        const currentSection = get().activeSection;

        if (currentSection === section) {
          set({ activeSection: null });
        } else {
          set({ activeSection: section });
        }
      },
    }),
    {
      name: 'sidebar-state',
      partialize: state => ({
        // 페이지 새로고침 해도 열린 상태 유지
        activeSection: state.activeSection,
      }),
    }
  )
);
