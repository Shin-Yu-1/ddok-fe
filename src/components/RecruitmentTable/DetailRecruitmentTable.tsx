import React from 'react';

import RecruitmentTable from './RecruitmentTable';
import type { RecruitmentPosition } from './RecruitmentTable';

interface DetailRecruitmentTableProps {
  positions: Array<{
    position: string;
    applied: number;
    confirmed: number;
    isApplied: boolean;
    isApproved: boolean;
    isAvailable: boolean;
  }>;
  onApply: (position: string) => void;
  confirmedPosition?: string;
}

const DetailRecruitmentTable: React.FC<DetailRecruitmentTableProps> = ({
  positions,
  onApply,
  confirmedPosition,
}) => {
  const recruitmentPositions: RecruitmentPosition[] = positions.map(pos => ({
    position: pos.position,
    applied: pos.applied,
    confirmed: pos.confirmed,
    isApplied: pos.isApplied,
    isApproved: pos.isApproved,
    isAvailable: pos.isAvailable,
  }));

  const handleApplyOrCancel = (position: string) => {
    const positionData = positions.find(p => p.position === position);

    if (positionData?.isApplied) {
      console.log(`지원 취소: ${position}`);
    } else {
      console.log(`지원하기: ${position}`);
    }

    onApply(position);
  };

  return (
    <RecruitmentTable
      pageType="detail"
      positions={recruitmentPositions}
      onApply={handleApplyOrCancel}
      confirmedPosition={confirmedPosition}
    />
  );
};

export default DetailRecruitmentTable;
