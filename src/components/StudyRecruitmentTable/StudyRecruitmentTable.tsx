import React from 'react';

import styles from './StudyRecruitmentTable.module.scss';

export interface StudyRecruitmentTableProps {
  // 지원 인원 수
  appliedCount: number;
  // 확정 인원 수 (리더 포함)
  confirmedCount: number;
  // 총 모집 인원
  capacity: number;
  // 현재 사용자의 지원 상태
  isApplied: boolean;
  // 현재 사용자의 승인 상태
  isApproved: boolean;
  // 현재 사용자가 스터디 리더인지
  isMine: boolean;
  // 지원하기/취소 핸들러
  onApply?: () => void;
}

const StudyRecruitmentTable: React.FC<StudyRecruitmentTableProps> = ({
  appliedCount,
  confirmedCount,
  capacity,
  isApplied,
  isApproved,
  isMine,
  onApply,
}) => {
  // 액션 버튼 렌더링
  const renderActionButton = () => {
    // 본인 스터디인 경우 또는 승인된 상태
    if (isMine || isApproved) {
      return <button className={`${styles.actionButton} ${styles.confirmed}`}>확정</button>;
    }

    // 지원한 상태
    if (isApplied) {
      return (
        <button className={`${styles.actionButton} ${styles.cancel}`} onClick={onApply}>
          지원 취소
        </button>
      );
    }

    // 정원 초과 체크
    if (confirmedCount >= capacity) {
      return (
        <button className={`${styles.actionButton} ${styles.disabled}`} disabled>
          정원 초과
        </button>
      );
    }

    // 지원 가능한 상태
    return (
      <button className={`${styles.actionButton} ${styles.selectable}`} onClick={onApply}>
        지원하기
      </button>
    );
  };

  return (
    <div className={styles.container}>
      {/* 테이블 */}
      <div className={styles.table}>
        {/* 헤더 */}
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>지원 인원</div>
          <div className={styles.headerCell}>확정 인원</div>
          <div className={styles.headerCell}>비고</div>
        </div>

        {/* 바디 */}
        <div className={styles.tableBody}>
          <div className={styles.tableRow}>
            {/* 지원 인원 */}
            <div className={styles.bodyCell}>
              <span className={styles.count}>{appliedCount}명</span>
            </div>

            {/* 확정 인원 */}
            <div className={styles.bodyCell}>
              <span className={styles.count}>
                {confirmedCount}명 / {capacity}명
              </span>
            </div>

            {/* 액션 버튼 */}
            <div className={styles.bodyCell}>{renderActionButton()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRecruitmentTable;
