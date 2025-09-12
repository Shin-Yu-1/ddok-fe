import { useState } from 'react';

import Button from '@/components/Button/Button';
import { useAuthStore } from '@/stores/authStore';

import type { CafeStat } from '../../../schemas/cafeStatSchema';
import CafeReviewModal from '../../CafeReviewModal/CafeReviewModal';

import styles from './MapSubPanelStats.module.scss';

interface MapSubPanelStatsProps {
  statData: CafeStat;
  cafeId: number;
  onDataRefresh: () => void;
}

const MapSubPanelStats: React.FC<MapSubPanelStatsProps> = ({ statData, cafeId, onDataRefresh }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();

  const handleReviewButtonClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    onDataRefresh();
  };

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filledStars = Math.round(rating);
      const isFilled = index < filledStars;

      return isFilled ? (
        // 꽉 찬 별
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path>
        </svg>
      ) : (
        // 빈 별
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"></path>
        </svg>
      );
    });
  };

  return (
    <div className={styles.stats}>
      {/* 타이틀 */}
      <div className={styles.stats__header}>
        <div className={styles.stats__header__title}>방문자 후기</div>
        <Button
          fontSize="var(--fs-xxxsmall)"
          backgroundColor="var(--blue-1)"
          textColor="var(--white-3)"
          height="25px"
          onClick={handleReviewButtonClick}
        >
          후기 작성
        </Button>
      </div>

      {/* 통계 요약 정보 */}
      <div className={styles.stats__summary}>
        {/* 별점 */}
        <div className={styles.stats__summary__rating}>
          <div className={styles.stats__summary__rating__count}>{statData.totalRating}</div>
          <div className={styles.stats__summary__rating__stars}>
            {renderStars(statData.totalRating)}
          </div>
        </div>
        <div className={styles.stats__summary__reviewCount}>후기 {statData.reviewCount}건</div>
      </div>

      {/* 통계 그래프 */}
      <div className={styles.stats__chart}>
        {statData.cafeReviewTag.map(tag => (
          <div key={tag.tagName} className={styles.stats__chart__tag}>
            <div className={styles.stats__chart__tag__name}>{tag.tagName}</div>
            <div className={styles.stats__chart__tag__count}>{tag.tagCount}건</div>
          </div>
        ))}
      </div>

      {/* 후기 작성 모달 */}
      <CafeReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        cafeId={cafeId}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default MapSubPanelStats;
