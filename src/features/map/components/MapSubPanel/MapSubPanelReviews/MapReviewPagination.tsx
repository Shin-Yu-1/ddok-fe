import { CaretLeft, CaretRight } from '@phosphor-icons/react';

import type { Pagination } from '../../../schemas/cafeReviewSchema';

import styles from './MapReviewPagination.module.scss';

interface MapReviewPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

const MapReviewPagination: React.FC<MapReviewPaginationProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;

  // 페이지 번호 배열 생성 (최대 5개 페이지만 표시)
  const getVisiblePages = () => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(0, currentPage - half);
    const end = Math.min(totalPages - 1, start + maxVisible - 1);

    // 끝에 도달한 경우 시작점 조정
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // 페이지가 1개 이하면 페이지네이션을 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      {/* 이전 버튼 */}
      <button
        className={`${styles.pagination__button} ${
          currentPage === 0 ? styles.pagination__button__disabled : ''
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 0}
      >
        <CaretLeft size={12} weight="bold" />
      </button>

      {/* 페이지 번호들 */}
      <div className={styles.pagination__pages}>
        {visiblePages.map(page => (
          <button
            key={page}
            className={`${styles.pagination__page} ${
              page === currentPage ? styles.pagination__page__active : ''
            }`}
            onClick={() => handlePageClick(page)}
          >
            {page + 1}
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        className={`${styles.pagination__button} ${
          currentPage === totalPages - 1 ? styles.pagination__button__disabled : ''
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
      >
        <CaretRight size={12} weight="bold" />
      </button>
    </div>
  );
};

export default MapReviewPagination;
