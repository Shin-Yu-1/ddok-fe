import { useState } from 'react';

export type ModalType = 'introduction' | 'position' | 'traits' | 'time' | 'portfolio' | 'techStack';

interface ModalState {
  [key: string]: boolean;
}

export const useProfileModals = () => {
  const [openModals, setOpenModals] = useState<ModalState>({
    introduction: false,
    position: false,
    traits: false,
    time: false,
    portfolio: false,
    techStack: false,
  });

  const openModal = (modalType: ModalType) => {
    setOpenModals(prev => ({
      ...prev,
      [modalType]: true,
    }));
  };

  const closeModal = (modalType: ModalType) => {
    setOpenModals(prev => ({
      ...prev,
      [modalType]: false,
    }));
  };

  const closeAllModals = () => {
    setOpenModals({
      introduction: false,
      position: false,
      traits: false,
      time: false,
      portfolio: false,
      techStack: false,
    });
  };

  const isModalOpen = (modalType: ModalType): boolean => {
    return openModals[modalType] || false;
  };

  return {
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
  };
};
