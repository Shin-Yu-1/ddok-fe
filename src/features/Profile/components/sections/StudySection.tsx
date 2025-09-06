// 스터디 이력
// 스터디 이력

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import { useShowMore } from '../../hooks';
import { formatDateRange, getStatusText } from '../../utils';

import styles from './StudySection.module.scss';

interface StudySectionProps extends ProfileSectionProps {
  className?: string;
}

const StudySection = forwardRef<HTMLElement, StudySectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
    const { showAll, handleToggleShowAll, getDisplayItems, hasMoreItems, getShowMoreText } =
      useShowMore(3);

    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('studies');
      }
    };

    const studies = user.studies || [];
    const displayedStudies = getDisplayItems(studies);
    const hasMore = hasMoreItems(studies);

    return (
      <section
        ref={ref}
        className={clsx(styles.studySection, className)}
        aria-labelledby="study-title"
      >
        <div className={styles.header}>
          <h2 id="study-title" className={styles.title}>
            스터디
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="스터디 이력 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div>
          {studies.length > 0 ? (
            <>
              <div className={styles.studyList}>
                {displayedStudies.map(study => (
                  <div key={study.id} className={styles.studyItem}>
                    <div className={styles.studyIcon}>📚</div>

                    <div className={styles.studyInfo}>
                      <h3 className={styles.studyTitle}>{study.title}</h3>
                      <p className={styles.studyDate}>
                        {formatDateRange(study.startDate, study.endDate)}
                      </p>
                    </div>

                    <div className={styles.studyStatus}>
                      <span className={clsx(styles.statusBadge, styles[`status-${study.status}`])}>
                        {getStatusText(study.status, 'study')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className={styles.showMoreContainer}>
                  <button
                    type="button"
                    onClick={handleToggleShowAll}
                    className={styles.showMoreButton}
                  >
                    {getShowMoreText(showAll, 'study')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>
              <p>참여한 스터디가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    );
  }
);

StudySection.displayName = 'StudySection';
export default StudySection;
