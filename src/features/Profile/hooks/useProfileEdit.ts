import { useNavigate } from 'react-router-dom';

import type { ProfileSectionType } from '@/types/user';

import { useProfileModals, type ModalType } from './useProfileModals';

export const useProfileEdit = () => {
  const navigate = useNavigate();
  const { openModal, closeModal, isModalOpen } = useProfileModals();

  const handleEdit = (sectionType: ProfileSectionType) => {
    console.log(`편집 요청: ${sectionType} 섹션`);

    // 섹션 타입을 모달 타입으로 매핑
    const modalMapping: Record<ProfileSectionType, ModalType | null> = {
      userInfo: null, // 별도 처리
      location: 'location',
      position: 'position',
      traits: 'traits',
      time: 'time',
      portfolio: 'portfolio',
      techStack: 'techStack',
      projects: null, // 읽기 전용
      studies: null, // 읽기 전용
    };

    const modalType = modalMapping[sectionType];
    if (modalType) {
      openModal(modalType);
    } else {
      console.log(`${sectionType} 섹션은 아직 모달이 구현되지 않음`);
    }
  };

  const handleEditPersonalInfo = () => {
    console.log('개인정보 수정 페이지로 이동');
    navigate('/profile/my/edit');
  };

  const handleEditIntroduction = () => {
    console.log('자기소개 수정 모달 열기');
    openModal('introduction');
  };

  return {
    handleEdit,
    handleEditPersonalInfo,
    handleEditIntroduction,

    // 모달 상태 관리
    openModal,
    closeModal,
    isModalOpen,
  };
};
