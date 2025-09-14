import { useState, useCallback } from 'react';

interface UseAIWriteProps {
  onContentApply: (content: string) => void;
}

export const useAIWrite = ({ onContentApply }: UseAIWriteProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleContentApply = useCallback(
    (content: string) => {
      onContentApply(content);
      closeModal();
    },
    [onContentApply, closeModal]
  );

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleContentApply,
  };
};
