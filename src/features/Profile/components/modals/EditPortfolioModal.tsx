import { useState, useEffect } from 'react';

import { PlusIcon, TrashSimpleIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import BaseModal from '@/components/Modal/BaseModal';
import { DDtoast } from '@/features/toast';
import type { CompleteProfileInfo, PortfolioItem } from '@/types/user';

import { useProfileMutations } from '../../hooks/useProfileMutations';

import styles from './EditPortfolioModal.module.scss';

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CompleteProfileInfo;
}

const EditPortfolioModal = ({ isOpen, onClose, user }: EditPortfolioModalProps) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { updatePortfolio, isUpdating } = useProfileMutations({
    userId: user.userId,
    onSuccess: () => {
      console.log('포트폴리오 수정 성공! 모달 닫기 및 새로고침');
      DDtoast({
        mode: 'custom',
        type: 'success',
        userMessage: '포트폴리오 수정에 성공했습니다.',
      });
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    onError: error => {
      console.error('포트폴리오 수정 실패:', error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '포트폴리오 수정에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen) {
      const initialPortfolio =
        user.portfolio && user.portfolio.length > 0
          ? [...user.portfolio]
          : [{ linkTitle: '', link: '' }]; // 빈 항목 하나는 기본으로 제공 (피그마랑 다르게 제작했어욤)

      setPortfolioItems(initialPortfolio);
      setHasChanges(false);
    }
  }, [isOpen, user.portfolio]);

  // 내용 변경 감지
  useEffect(() => {
    const initialPortfolio = user.portfolio || [];

    // 비어있지 않은 항목만 비교
    const currentValidItems = portfolioItems.filter(
      item => item.linkTitle.trim() && item.link.trim()
    );

    const hasChanged =
      currentValidItems.length !== initialPortfolio.length ||
      currentValidItems.some(
        (item, index) =>
          !initialPortfolio[index] ||
          item.linkTitle !== initialPortfolio[index].linkTitle ||
          item.link !== initialPortfolio[index].link
      ) ||
      initialPortfolio.some(
        (item, index) =>
          !currentValidItems[index] ||
          item.linkTitle !== currentValidItems[index].linkTitle ||
          item.link !== currentValidItems[index].link
      );

    setHasChanges(hasChanged);
  }, [portfolioItems, user.portfolio]);

  const handleSubmit = async () => {
    if (!hasChanges || isUpdating) return;

    // 비어있지 않은 항목만 전송
    const validItems = portfolioItems.filter(item => item.linkTitle.trim() && item.link.trim());

    try {
      await updatePortfolio.mutateAsync(validItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm('변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?');
      if (!confirmed) return;
    }
    onClose();
  };

  const handleItemChange = (index: number, field: 'linkTitle' | 'link', value: string) => {
    setPortfolioItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addNewItem = () => {
    setPortfolioItems(prev => [...prev, { linkTitle: '', link: '' }]);
  };

  const removeItem = (index: number) => {
    if (portfolioItems.length === 1) {
      // 마지막 항목이면 비우기만 함
      setPortfolioItems([{ linkTitle: '', link: '' }]);
    } else {
      setPortfolioItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true; // 빈 값은 유효함
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasValidationErrors = portfolioItems.some(
    item =>
      (item.linkTitle.trim() && !item.link.trim()) ||
      (!item.linkTitle.trim() && item.link.trim()) ||
      (item.link.trim() && !isValidUrl(item.link))
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="포트폴리오를 입력해주세요"
      subtitle="자신이 소개하고 싶은 포토폴리오 주소를 추가해주세요!"
      footer={null}
      disableBackdropClose={hasChanges}
      disableEscapeClose={hasChanges}
    >
      <div className={styles.content}>
        <div className={styles.portfolioList}>
          {portfolioItems.map((item, index) => (
            <div key={index} className={styles.portfolioItem}>
              <div className={styles.inputGroup}>
                <span className={styles.titleText}>제목을 입력해주세요</span>
                <Input
                  type="text"
                  placeholder="예) [ GitHub 링크 ]"
                  value={item.linkTitle}
                  onChange={e => handleItemChange(index, 'linkTitle', e.target.value)}
                  disabled={isUpdating}
                  width="100%"
                  height="37px"
                  border="1px solid var(--gray-3)"
                  focusBorder="1px solid var(--yellow-1)"
                />
                <span className={styles.titleText}>링크를 입력해주세요</span>
                <Input
                  type="url"
                  placeholder="예) https://example.com"
                  value={item.link}
                  onChange={e => handleItemChange(index, 'link', e.target.value)}
                  disabled={isUpdating}
                  width="100%"
                  height="37px"
                  border="1px solid var(--gray-3)"
                  focusBorder="1px solid var(--yellow-1)"
                  style={{
                    borderColor:
                      item.link.trim() && !isValidUrl(item.link) ? 'var(--red-1)' : undefined,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={isUpdating}
                className={styles.removeButton}
                aria-label="포트폴리오 항목 삭제"
              >
                <TrashSimpleIcon size={16} weight="bold" />
              </button>

              {item.link.trim() && !isValidUrl(item.link) && (
                <div className={styles.errorMessage}>올바른 URL 형식을 입력해주세요.</div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addNewItem}
          disabled={isUpdating || portfolioItems.length >= 5}
          className={styles.addButton}
        >
          <PlusIcon size={16} weight="bold" />
          포트폴리오 추가
        </button>

        {portfolioItems.length >= 5 && (
          <div className={styles.limitMessage}>최대 5개까지 추가할 수 있습니다.</div>
        )}

        {/* 버튼 추가 */}
        <div className={styles.buttonContainer}>
          <Button
            variant={hasChanges ? 'secondary' : 'ghost'}
            onClick={handleSubmit}
            disabled={!hasChanges || hasValidationErrors || isUpdating}
            isLoading={isUpdating}
            fullWidth={true}
            radius="xsm"
            height={48}
          >
            {isUpdating ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditPortfolioModal;
