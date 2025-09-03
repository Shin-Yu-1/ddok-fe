// 기술스택
// 기술스택

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import { useShowMore } from '../../hooks';

import styles from './TechStackSection.module.scss';

interface TechStackSectionProps extends ProfileSectionProps {
  className?: string;
}

const TechStackSection = forwardRef<HTMLElement, TechStackSectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
    const { showAll, handleToggleShowAll, getDisplayItems, hasMoreItems, getShowMoreText } =
      useShowMore(8);

    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('techStack');
      }
    };

    if (!user.techStacks || user.techStacks.length === 0) {
      return null;
    }

    // 처음에는 8개만 표시, "Show more tools" 클릭시 전체 표시
    const displayedTechStacks = getDisplayItems(user.techStacks);
    const hasMore = hasMoreItems(user.techStacks);

    return (
      <section
        ref={ref}
        className={clsx(styles.techStackSection, className)}
        aria-labelledby="tech-stack-title"
      >
        <div className={styles.header}>
          <h2 id="tech-stack-title" className={styles.title}>
            기술 스택
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="기술 스택 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div>
          <div className={styles.techStackGrid}>
            {displayedTechStacks.map(tech => (
              <div key={tech.id} className={styles.techStackItem}>
                <span className={styles.techName}>{tech.name}</span>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className={styles.showMoreContainer}>
              <button type="button" onClick={handleToggleShowAll} className={styles.showMoreButton}>
                {getShowMoreText(showAll, 'tools')}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }
);

TechStackSection.displayName = 'TechStackSection';
export default TechStackSection;
