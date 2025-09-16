// 포지션 정보
// 포지션 정보

import { forwardRef } from 'react';

import { LockIcon, PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import styles from './PositionSection.module.scss';

interface PositionSectionProps extends ProfileSectionProps {
  className?: string;
}

const PositionSection = forwardRef<HTMLElement, PositionSectionProps>(
  ({ user, isEditable = false, onEdit, isPrivate = false, className }, ref) => {
    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('position');
      }
    };

    return (
      <section
        ref={ref}
        className={clsx(styles.positionSection, className)}
        aria-labelledby="position-title"
      >
        <div className={styles.header}>
          <h2 id="position-title" className={styles.title}>
            포지션
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="포지션 정보 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div className={styles.content}>
          {/* 대표 포지션 */}
          <div className={styles.positionRow}>
            <div className={styles.positionLabel}>대표 포지션</div>
            <div className={styles.positionValue}>
              <span className={styles.mainPositionTag}>{user.mainPosition}</span>
            </div>
          </div>

          {/* 관심 포지션 */}
          {user.subPositions && user.subPositions.length > 0 && (
            <div className={styles.positionRow}>
              <div className={styles.positionLabel}>관심 포지션</div>
              <div className={styles.positionValue}>
                <div className={styles.subPositionTags}>
                  {user.subPositions.map((position, index) => (
                    <span key={index} className={styles.subPositionTag}>
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 비공개 메시지 */}
        {isPrivate && (
          <div className={styles.privateMessage}>
            <LockIcon size={16} weight="regular" />
            <span>프로필 비공개 중입니다. 다른 사용자에게는 보이지 않습니다.</span>
          </div>
        )}
      </section>
    );
  }
);

PositionSection.displayName = 'PositionSection';
export default PositionSection;
