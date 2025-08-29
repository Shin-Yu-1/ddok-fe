import React from 'react';

import RecruitmentTable from './RecruitmentTable';
import type { RecruitmentPosition } from './RecruitmentTable';

interface DetailRecruitmentTableProps {
  /** API에서 받아온 포지션 정보들 */
  positions: Array<{
    position: string;
    applied: number;
    confirmed: number;
    isApplied: boolean;
    isApproved: boolean;
    isAvailable: boolean;
  }>;
  /** 지원하기 핸들러 */
  onApply: (position: string) => void;
  /** 현재 사용자가 확정된 포지션 */
  confirmedPosition?: string;
}

/**
 * Detail 페이지에서 사용하는 모집 현황 테이블
 * - 포지션 지원 가능
 * - 지원한 포지션은 "지원 취소" 표시
 * - 확정된 포지션은 "확정" 표시
 * - 모집 마감된 포지션은 "지원 불가" 표시
 */
const DetailRecruitmentTable: React.FC<DetailRecruitmentTableProps> = ({
  positions,
  onApply,
  confirmedPosition,
}) => {
  // API 데이터를 RecruitmentPosition 형태로 변환
  const recruitmentPositions: RecruitmentPosition[] = positions.map(pos => ({
    position: pos.position,
    applied: pos.applied,
    confirmed: pos.confirmed,
    isApplied: pos.isApplied,
    isApproved: pos.isApproved,
    isAvailable: pos.isAvailable,
  }));

  return (
    <RecruitmentTable
      pageType="detail"
      positions={recruitmentPositions}
      onApply={onApply}
      confirmedPosition={confirmedPosition}
    />
  );
};

export default DetailRecruitmentTable;
