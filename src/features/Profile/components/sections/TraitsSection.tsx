// 성향 태그들
// 성향 태그들

import { forwardRef } from 'react';

import { LockIcon, PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import styles from './TraitsSection.module.scss';

interface TraitsSectionProps extends ProfileSectionProps {
  className?: string;
}

const TraitsSection = forwardRef<HTMLElement, TraitsSectionProps>(
  ({ user, isEditable = false, onEdit, isPrivate = false, className }, ref) => {
    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('traits');
      }
    };

    const traits = user.traits || [];

    return (
      <section
        ref={ref}
        className={clsx(styles.traitsSection, className)}
        aria-labelledby="traits-title"
      >
        <div className={styles.header}>
          <h2 id="traits-title" className={styles.title}>
            나 이런 사람이야 !
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="성향 정보 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div>
          {traits.length > 0 ? (
            <div className={styles.traitList}>
              {traits.map((trait, index) => (
                <span key={index} className={styles.traitTag}>
                  {trait}
                </span>
              ))}
            </div>
          ) : (
            <div>
              <p>등록된 성향이 없습니다.</p>
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

TraitsSection.displayName = 'TraitsSection';
export default TraitsSection;
