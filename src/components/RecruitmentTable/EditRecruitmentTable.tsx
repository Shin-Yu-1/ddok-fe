import React from 'react';

import RecruitmentTable from './RecruitmentTable';
import type { RecruitmentPosition } from './RecruitmentTable';

interface EditRecruitmentTableProps {
  /** API에서 받아온 포지션 정보들 */
  positions: Array<{
    position: string;
    applied: number;
    confirmed: number;
  }>;
  /** 리더 포지션 */
  leaderPosition: string;
  /** 포지션 추가 핸들러 */
  onAddPosition: (position: string) => void;
  /** 포지션 삭제 핸들러 */
  onRemovePosition: (position: string) => void;
}

/**
 * Edit 페이지에서 사용하는 모집 현황 테이블
 * - 포지션 추가 가능
 * - 지원자가 0명인 포지션만 삭제 가능
 * - 리더 포지션은 "확정" 상태로 표시
 * - 나머지 포지션은 "지원 불가" 상태로 표시
 */
const EditRecruitmentTable: React.FC<EditRecruitmentTableProps> = ({
  positions,
  leaderPosition,
  onAddPosition,
  onRemovePosition,
}) => {
  // API 데이터를 RecruitmentPosition 형태로 변환
  const recruitmentPositions: RecruitmentPosition[] = positions.map(pos => ({
    position: pos.position,
    applied: pos.applied,
    confirmed: pos.confirmed,
    // Edit 페이지에서는 모든 포지션이 지원 불가 상태
    isApplied: false,
    isApproved: false,
    isAvailable: false,
  }));

  return (
    <RecruitmentTable
      pageType="edit"
      positions={recruitmentPositions}
      leaderPosition={leaderPosition}
      onAddPosition={onAddPosition}
      onRemovePosition={onRemovePosition}
      confirmedPosition={leaderPosition}
    />
  );
};

export default EditRecruitmentTable;
