import React from 'react';

import RecruitmentTable from './RecruitmentTable';

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
  return (
    <RecruitmentTable
      pageType="create"
      positions={positions.map(position => ({ position, applied: 0, confirmed: 0 }))}
      leaderPosition={leaderPosition}
      onAddPosition={onAddPosition}
      onRemovePosition={onRemovePosition}
      onLeaderPositionChange={onLeaderPositionChange}
    />
  );
};

export default CreateRecruitmentTable;
