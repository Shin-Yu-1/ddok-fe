// 기술스택
// 기술스택

import { forwardRef, useState } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import styles from './TechStackSection.module.scss';

interface TechStackSectionProps extends ProfileSectionProps {
  className?: string;
}

const TechStackSection = forwardRef<HTMLElement, TechStackSectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
    const [showAll, setShowAll] = useState(false);

    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('techStack');
      }
    };

    const handleToggleShowAll = () => {
      setShowAll(!showAll);
    };

    if (!user.techStacks || user.techStacks.length === 0) {
      return null;
    }

    // 처음에는 8개만 표시, "Show more tools" 클릭시 전체 표시
    const displayedTechStacks = showAll ? user.techStacks : user.techStacks.slice(0, 8);
    const hasMoreItems = user.techStacks.length > 8;

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

          {hasMoreItems && (
            <div className={styles.showMoreContainer}>
              <button type="button" onClick={handleToggleShowAll} className={styles.showMoreButton}>
                {showAll ? 'Show less tools ▲' : 'Show more tools ▼'}
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
