import { useState } from 'react';

import { XIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';

import { usePostCafeReview } from '../../hooks/usePostCafeReview';

import styles from './CafeReviewModal.module.scss';

interface CafeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeId: number;
  onReviewSubmitted: () => void; // 후기 작성 완료 후 호출될 콜백
}

// 후기 옵션 텍스트 목록
const REVIEW_OPTIONS = [
  '시간 제한이 있어요',
  '오래 머무르기 좋아요',
  '직원이 친절해요',
  '직원이 불친절해요',
  '콘센트가 있어요',
  '콘센트가 없어요',
  '조명이 밝아요',
  '조명이 어두워요',
  '혼자 공부하기 좋아요',
  '함께 공부하기 좋아요',
  '조용해요',
  '소음이 심해요',
  '대화하기 좋아요',
  '별도의 방(단체 공간)이 있어요',
  '많은 인원이 사용 가능해요',
  '디저트가 맛있어요',
  '디저트가 맛없어요',
  '디저트 종류가 다양해요',
  '커피 전문점이에요',
  '커피가 맛있어요',
  '커피가 맛없어요',
  '가성비가 좋아요',
  '가성비가 나빠요',
  '매장이 깔끔해요',
  '매장이 더러워요',
  '화장실 깨끗해요',
  '화장실 더러워요',
  '화장실에 비데가 있어요!',
  '예약을 해야 이용이 가능해요',
  '접근이 편리해요',
  '접근 불편해요',
  '사진 찍기 좋아요',
  '프린트가 가능해요',
  '커피가 무제한이에요',
  '커피 잔수가 제한적이에요',
];

const CafeReviewModal: React.FC<CafeReviewModalProps> = ({
  isOpen,
  onClose,
  cafeId,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const postReviewMutation = usePostCafeReview({ cafeId });

  if (!isOpen) return null;

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 5) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (rating === 0 || selectedTags.length === 0) {
      alert('별점과 후기 옵션을 선택해주세요.');
      return;
    }

    postReviewMutation.mutate(
      {
        rating,
        cafeReviewTag: selectedTags,
      },
      {
        onSuccess: () => {
          alert('후기가 성공적으로 작성되었습니다!');
          onReviewSubmitted();
          handleClose();
        },
        onError: error => {
          console.error('후기 작성 오류:', error);
          alert('후기 작성에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleClose = () => {
    setRating(0);
    setSelectedTags([]);
    onClose();
  };

  // 별점 렌더링
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;

      return (
        <button
          key={index}
          type="button"
          className={styles.star}
          onClick={() => handleStarClick(starValue)}
        >
          <svg width="32" height="32" fill={isFilled ? '#FFD700' : '#E0E0E0'} viewBox="0 0 256 256">
            <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
          </svg>
        </button>
      );
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>후기 작성</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <XIcon size={24} weight="light" />
          </button>
        </div>

        <div className={styles.content}>
          {/* 별점 섹션 */}
          <div className={styles.ratingSection}>
            <h3 className={styles.sectionTitle}>별점을 선택해주세요</h3>
            <div className={styles.stars}>{renderStars()}</div>
          </div>

          {/* 후기 옵션 섹션 */}
          <div className={styles.tagsSection}>
            <h3 className={styles.sectionTitle}>
              후기 옵션을 선택해주세요 ({selectedTags.length}/5)
            </h3>
            <p className={styles.tagInstruction}>최소 1개, 최대 5개까지 선택할 수 있습니다</p>
            <div className={styles.tags}>
              {REVIEW_OPTIONS.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.tag} ${
                    selectedTags.includes(option) ? styles.selected : ''
                  }`}
                  onClick={() => handleTagToggle(option)}
                  disabled={!selectedTags.includes(option) && selectedTags.length >= 5}
                >
                  {index + 1}. {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || selectedTags.length === 0 || postReviewMutation.isPending}
            backgroundColor="var(--blue-1)"
            textColor="var(--white-3)"
            width="100%"
            height="45px"
            radius="sm"
          >
            {postReviewMutation.isPending ? '작성 중...' : '후기 제출하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CafeReviewModal;
