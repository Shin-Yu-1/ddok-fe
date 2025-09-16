import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';

import ApplicantRow from '@/features/Team/components/ApplicantsGrid/ApplicantRow/ApplicantRow';
import { useGetTeamApplicants } from '@/features/Team/hooks/useGetTeamApplicants';

import styles from './ApplicantsGrid.module.scss';

interface ApplicantsGridProps {
  teamType: string;
  teamId: number;
  amILeader: boolean;
  page?: number;
  size?: number;
  teamStatus?: string;
  onPageChange?: (page: number) => void;
}

const ApplicantsGrid = ({
  teamType,
  teamId,
  amILeader,
  page = 0,
  size = 5,
  teamStatus,
  onPageChange,
}: ApplicantsGridProps) => {
  const { data, isLoading, isError, error } = useGetTeamApplicants({
    teamId,
    page,
    size,
  });

  if (isLoading) {
    return <div className={styles.loading}>참여 희망자를 불러오는 중...</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>참여 희망자를 불러오는데 실패했습니다: {error?.message}</div>
    );
  }

  if (!data?.data?.items || data.data.items.length === 0) {
    return <div className={styles.empty}>참여 희망자가 없습니다.</div>;
  }

  // 페이지네이션 관련 함수
  const { pagination } = data.data;
  const { currentPage, totalPages } = pagination;

  // 페이지 번호 배열
  const getVisiblePages = () => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(0, currentPage - half);
    const end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 0 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1 && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    if (onPageChange) {
      onPageChange(pageNum);
    }
  };

  return (
    <>
      <div className={`${styles.applicantsGrid} ${teamType === 'STUDY' ? styles.study : ''}`}>
        {teamType === 'PROJECT' && <div className={styles.gridLabel}>지원 포지션</div>}
        <div className={styles.gridLabel}>멤버</div>
        <div className={styles.gridLabel}>액션</div>

        {data.data.items.map(applicant => (
          <ApplicantRow
            teamType={teamType}
            key={applicant.applicantId}
            member={applicant}
            teamId={teamId}
            amILeader={amILeader}
            teamStatus={teamStatus}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {onPageChange && totalPages > 1 && (
        <div className={styles.pagination}>
          {/* 이전 버튼 */}
          <button
            className={`${styles.pagination__button} ${
              currentPage === 0 ? styles.pagination__button__disabled : ''
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 0}
          >
            <CaretLeftIcon size={16} weight="bold" />
          </button>

          {/* 페이지 번호 */}
          <div className={styles.pagination__pages}>
            {visiblePages.map(pageNum => (
              <button
                key={pageNum}
                className={`${styles.pagination__page} ${
                  pageNum === currentPage ? styles.pagination__page__active : ''
                }`}
                onClick={() => handlePageClick(pageNum)}
              >
                {pageNum + 1}
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
            <CaretRightIcon size={16} weight="bold" />
          </button>
        </div>
      )}
    </>
  );
};

export default ApplicantsGrid;
