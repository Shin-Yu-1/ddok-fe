import { useEffect } from 'react';

import { X } from '@phosphor-icons/react';

import { DDOK_STORY_FULL } from '@/constants/mainContent';

import styles from './DdokStoryModal.module.scss';

interface DdokStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DdokStoryModal({ isOpen, onClose }: DdokStoryModalProps) {
  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // 모달 닫힐 때 원래 상태로 복원
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{DDOK_STORY_FULL.title}</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.storyContent}>
            {DDOK_STORY_FULL.content.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === DDOK_STORY_FULL.highlightIndex ? styles.storyHighlight : undefined
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
