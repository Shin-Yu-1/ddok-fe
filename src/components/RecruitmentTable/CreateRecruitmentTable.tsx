import React from 'react';

import RecruitmentTable from './RecruitmentTable';
import type { RecruitmentPosition } from './RecruitmentTable';

interface CreateRecruitmentTableProps {
  /** 선택된 포지션들 */
  positions: string[];
  /** 리더 포지션 */
  leaderPosition: string;
  /** 포지션 추가 핸들러 */
  onAddPosition: (position: string) => void;
  /** 포지션 삭제 핸들러 */
  onRemovePosition: (position: string) => void;
  /** 리더 포지션 변경 핸들러 */
  onLeaderPositionChange: (position: string) => void;
}

/**
 * Create 페이지에서 사용하는 모집 현황 테이블
 * - 포지션 추가/삭제 가능
 * - 리더 포지션 선택 가능
 * - 선택된 리더 포지션은 삭제 불가
 */
const CreateRecruitmentTable: React.FC<CreateRecruitmentTableProps> = ({
  positions,
  leaderPosition,
  onAddPosition,
  onRemovePosition,
  onLeaderPositionChange,
}) => {
  // 포지션 목록을 RecruitmentPosition 형태로 변환
  const recruitmentPositions: RecruitmentPosition[] = positions.map(position => ({
    position,
    applied: 0,
    confirmed: leaderPosition === position ? 1 : 0, // 리더 포지션인 경우 확정 1명
  }));

  return (
    <RecruitmentTable
      pageType="create"
      positions={recruitmentPositions}
      leaderPosition={leaderPosition}
      onAddPosition={onAddPosition}
      onRemovePosition={onRemovePosition}
      onLeaderPositionChange={onLeaderPositionChange}
    />
  );
};

export default CreateRecruitmentTable;
