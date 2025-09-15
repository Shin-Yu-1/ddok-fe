import { useState, useEffect } from 'react';

import { useGetCafeReviews } from '../../../hooks/useGetCafeReviews';
import MapReviewPagination from '../MapReviewPagination/MapReviewPagination';

import styles from './MapSubPanelReviews.module.scss';

interface MapSubPanelReviewsProps {
  cafeId: number;
  onDataRefresh?: (refetchFn: () => void) => void;
}

const MapSubPanelReviews: React.FC<MapSubPanelReviewsProps> = ({ cafeId, onDataRefresh }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: reviewList,
    pagination,
    isLoading,
    isError,
    refetch,
  } = useGetCafeReviews({
    cafeId,
    page: currentPage,
    pageSize: 20,
  });

  // onDataRefresh가 변경될 때 refetch 함수를 설정
  useEffect(() => {
    if (onDataRefresh) {
      onDataRefresh(() => {
        refetch();
      });
    }
  }, [onDataRefresh, refetch]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const displayReviews = reviewList || [];

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.reviews}>
        <div className={styles.reviews__loading}>리뷰를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className={styles.reviews}>
        <div className={styles.reviews__error}>리뷰를 불러오는 중 오류가 발생했습니다.</div>
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
            <div className={styles.reviews__item__left__stars}>
              {review.rating} {renderStars(review.rating)}
            </div>
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
      {pagination && (
        <MapReviewPagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default MapSubPanelReviews;
