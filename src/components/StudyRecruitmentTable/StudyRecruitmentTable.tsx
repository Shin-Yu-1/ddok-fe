import React from 'react';

import { useAuthStore } from '@/stores/authStore';

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
  // 스터디 상태 ('RECRUITING' | 'ONGOING' | 'CLOSED')
  status: 'RECRUITING' | 'ONGOING' | 'CLOSED';
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
  status,
  onApply,
}) => {
  // 로그인 상태 확인
  const { isLoggedIn } = useAuthStore();

  // 지원하기 핸들러 (로그인 체크 포함)
  const handleApplyWithLoginCheck = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    onApply?.();
  };

  // 스터디 상태별 메시지 반환
  const getStatusMessage = () => {
    switch (status) {
      case 'ONGOING':
        return '진행 중';
      case 'CLOSED':
        return '종료됨';
      default:
        return null;
    }
  };

  // 액션 버튼 렌더링
  const renderActionButton = () => {
    // 본인 스터디인 경우 또는 승인된 상태
    if (isMine || isApproved) {
      return <button className={`${styles.actionButton} ${styles.confirmed}`}>확정</button>;
    }

    // 모집중이 아닌 경우
    if (status !== 'RECRUITING') {
      const message = getStatusMessage();
      return (
        <button className={`${styles.actionButton} ${styles.disabled}`} disabled>
          {message}
        </button>
      );
    }

    // 지원한 상태 (모집중일 때만)
    if (isApplied) {
      return (
        <button
          className={`${styles.actionButton} ${styles.cancel}`}
          onClick={handleApplyWithLoginCheck}
        >
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

    // 지원 가능한 상태 (모집중이고 로그인 여부와 관계없이 버튼은 보이지만 클릭 시 체크)
    return (
      <button
        className={`${styles.actionButton} ${styles.selectable}`}
        onClick={handleApplyWithLoginCheck}
      >
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
          <div className={styles.headerCell}>지원 신청하기</div>
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
