import React, { useState, useMemo } from 'react';

import { Prohibit, TrashSimple, CaretDown } from '@phosphor-icons/react';
import { Select } from 'radix-ui';

import { POSITIONS } from '@/constants/positions';

import styles from './RecruitmentTable.module.scss';

export type RecruitmentPosition = {
  position: string;
  applied: number;
  confirmed: number;
  isApplied?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
};

export interface RecruitmentTableProps {
  /** 페이지 타입 */
  pageType: 'create' | 'detail' | 'edit';
  /** 포지션 목록 */
  positions: RecruitmentPosition[];
  /** 리더 포지션 (Create/Edit 전용) */
  leaderPosition?: string;
  /** 포지션 추가 핸들러 */
  onAddPosition?: (position: string) => void;
  /** 포지션 삭제 핸들러 */
  onRemovePosition?: (position: string) => void;
  /** 지원하기 핸들러 (Detail 전용) */
  onApply?: (position: string) => void;
  /** 리더 포지션 변경 핸들러 (Create/Edit 전용) */
  onLeaderPositionChange?: (position: string) => void;
  /** 현재 사용자가 확정된 포지션 (Detail 전용) */
  confirmedPosition?: string;
}

const RecruitmentTable: React.FC<RecruitmentTableProps> = ({
  pageType,
  positions,
  leaderPosition,
  onAddPosition,
  onRemovePosition,
  onApply,
  onLeaderPositionChange,
  confirmedPosition,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');

  // 드롭다운에서 선택 가능한 포지션 목록
  const availablePositions = useMemo(() => {
    const existingPositions = positions.map(p => p.position);
    return POSITIONS.filter(pos => !existingPositions.includes(pos.name));
  }, [positions]);

  // 포지션 추가
  const handleAddPosition = (positionName: string) => {
    if (positionName && onAddPosition) {
      onAddPosition(positionName);
      // 드롭다운 값 초기화하여 placeholder 유지
      setDropdownValue('');
      setDropdownOpen(false);
    }
  };

  // 포지션 삭제
  const handleRemovePosition = (position: string) => {
    onRemovePosition?.(position);
  };

  // 삭제 가능 여부 확인
  const canRemovePosition = (position: RecruitmentPosition): boolean => {
    if (pageType === 'create') {
      return leaderPosition !== position.position;
    }
    if (pageType === 'edit') {
      return position.applied === 0 && leaderPosition !== position.position;
    }
    return false;
  };

  // 리더 포지션 선택
  const handleLeaderPositionSelect = (position: string) => {
    onLeaderPositionChange?.(position);
  };

  // 액션 버튼 렌더링
  const renderActionButton = (position: RecruitmentPosition) => {
    if (pageType === 'create') {
      const isSelected = leaderPosition === position.position;
      return (
        <button
          className={`${styles.actionButton} ${isSelected ? styles.cancel : styles.selectable}`}
          onClick={() => handleLeaderPositionSelect(position.position)}
        >
          {isSelected ? '선택 취소' : '선택하기'}
        </button>
      );
    }

    if (pageType === 'detail') {
      const isConfirmed = confirmedPosition === position.position;
      const isApplied = position.isApplied;
      const isAvailable = position.isAvailable;
      const hasConfirmedPosition = !!confirmedPosition; // 확정된 포지션이 있는지 확인

      // 확정된 포지션
      if (isConfirmed) {
        return <button className={`${styles.actionButton} ${styles.confirmed}`}>확정</button>;
      }

      // 확정된 포지션이 있는 경우, 나머지 포지션들은 모두 지원 불가
      if (hasConfirmedPosition) {
        return (
          <button className={`${styles.actionButton} ${styles.disabled}`} disabled>
            지원 불가
          </button>
        );
      }

      // 지원한 포지션 (취소 가능)
      if (isApplied) {
        return (
          <button
            className={`${styles.actionButton} ${styles.cancel}`}
            onClick={() => onApply?.(position.position)}
          >
            지원 취소
          </button>
        );
      }

      // 지원 불가능한 포지션
      if (!isAvailable) {
        return (
          <button className={`${styles.actionButton} ${styles.disabled}`} disabled>
            지원 불가
          </button>
        );
      }

      // 지원 가능한 포지션
      return (
        <button
          className={`${styles.actionButton} ${styles.selectable}`}
          onClick={() => onApply?.(position.position)}
        >
          지원하기
        </button>
      );
    }

    if (pageType === 'edit') {
      const isLeaderPos = leaderPosition === position.position;

      if (isLeaderPos) {
        return <button className={`${styles.actionButton} ${styles.confirmed}`}>확정</button>;
      }

      return (
        <button className={`${styles.actionButton} ${styles.disabled}`} disabled>
          지원 불가
        </button>
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      {/* 테이블 */}
      <div className={styles.table}>
        {/* 헤더 */}
        <div className={styles.tableHeader} data-page-type={pageType}>
          <div className={styles.headerCell}>모집 포지션</div>
          {(pageType === 'detail' || pageType === 'edit') && (
            <div className={styles.headerCell}>지원 인원</div>
          )}
          {(pageType === 'detail' || pageType === 'edit') && (
            <div className={styles.headerCell}>확정 인원</div>
          )}
          <div className={styles.headerCell}>본인 포지션 선택</div>
          {/* detail 페이지에서는 삭제 컬럼 헤더도 숨김 */}
          {pageType !== 'detail' && <div className={styles.headerCell}>삭제</div>}
        </div>

        {/* 바디 */}
        <div className={styles.tableBody}>
          {positions.map(position => (
            <div key={position.position} className={styles.tableRow} data-page-type={pageType}>
              {/* 포지션명 */}
              <div className={styles.bodyCell}>
                <span className={styles.positionTag}>{position.position}</span>
              </div>

              {/* 지원 인원 */}
              {(pageType === 'detail' || pageType === 'edit') && (
                <div className={styles.bodyCell}>
                  <span className={styles.count}>{position.applied}명</span>
                </div>
              )}

              {/* 확정 인원 */}
              {(pageType === 'detail' || pageType === 'edit') && (
                <div className={styles.bodyCell}>
                  <span className={styles.count}>{position.confirmed}명</span>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className={styles.bodyCell}>{renderActionButton(position)}</div>

              {/* 삭제 버튼 - detail 페이지에서는 표시하지 않음 */}
              {pageType !== 'detail' && (
                <div className={styles.bodyCell}>
                  {canRemovePosition(position) ? (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemovePosition(position.position)}
                    >
                      <TrashSimple size={16} weight="regular" />
                    </button>
                  ) : (
                    <button className={styles.deleteButton} disabled>
                      <Prohibit size={16} weight="regular" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 포지션 등록하기 드롭다운 */}
      {(pageType === 'create' || pageType === 'edit') && availablePositions.length > 0 && (
        <div className={styles.dropdownContainer}>
          <Select.Root
            value={dropdownValue}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            onValueChange={handleAddPosition}
          >
            <Select.Trigger className={styles.dropdownTrigger}>
              <Select.Value placeholder="포지션 등록하기" />
              <Select.Icon>
                <CaretDown size={16} weight="regular" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className={styles.dropdownContent}>
                <Select.Viewport className={styles.dropdownViewport}>
                  {availablePositions.map(position => (
                    <Select.Item
                      key={position.id}
                      value={position.name}
                      className={styles.dropdownItem}
                    >
                      <Select.ItemText>{position.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      )}
    </div>
  );
};

export default RecruitmentTable;
