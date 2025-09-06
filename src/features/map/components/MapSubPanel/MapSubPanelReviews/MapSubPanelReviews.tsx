import { useState } from 'react';

import { useGetCafeReviews } from '../../../hooks/useGetCafeReviews';
import { reviewsMockData } from '../../../mocks/reviewsMockData';
import MapReviewPagination from '../MapReviewPagination/MapReviewPagination';

import styles from './MapSubPanelReviews.module.scss';

interface MapSubPanelReviewsProps {
  cafeId: number;
}

const MapSubPanelReviews: React.FC<MapSubPanelReviewsProps> = ({ cafeId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // API로 카페 리뷰 데이터 가져오기
  const {
    data: reviewList,
    pagination,
    isLoading,
    isError,
    refetch,
  } = useGetCafeReviews({
    cafeId,
    page: currentPage,
    pageSize,
  });

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // API 데이터가 있으면 사용하고, 없으면 mockdata로 fallback
  const displayReviews = reviewList || reviewsMockData?.cafeReviews || [];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.reviews}>
        <div className={styles.reviews__loading}>리뷰를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className={styles.reviews}>
        <div className={styles.reviews__error}>
          리뷰를 불러오는 중 오류가 발생했습니다.
          <button onClick={() => refetch()} className={styles.reviews__retry}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 리뷰가 없는 경우
  if (displayReviews.length === 0) {
    return (
      <div className={styles.reviews}>
        <div className={styles.reviews__empty}>아직 리뷰가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.reviews}>
      {displayReviews.map(review => (
        <div key={review.userId} className={styles.reviews__item}>
          <div className={styles.reviews__item__profileImg}>
            <img src={review.profileImageUrl} alt="Avatar" />
          </div>
          <div className={styles.reviews__item__left}>
            <div className={styles.reviews__item__left__nickname}>{review.nickname}</div>
            <div className={styles.reviews__item__left__reviews}>
              {review.cafeReviewTag.map((tag, index) => (
                <div key={index} className={styles.reviews__item__left__reviews__tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* 페이지네이션 */}
      {pagination && (
        <MapReviewPagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default MapSubPanelReviews;
