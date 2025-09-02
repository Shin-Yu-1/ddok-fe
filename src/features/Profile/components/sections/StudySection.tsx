// 스터디 이력
// 스터디 이력

import { forwardRef, useState } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps, ParticipationHistory } from '@/types/user';

import styles from './StudySection.module.scss';

interface StudySectionProps extends ProfileSectionProps {
  className?: string;
}

const StudySection = forwardRef<HTMLElement, StudySectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
    const [showAll, setShowAll] = useState(false);

    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('studies');
      }
    };

    const handleToggleShowAll = () => {
      setShowAll(!showAll);
    };

    if (!user.participationHistory) {
      return null;
    }

    // 스터디만 필터링
    const studies = user.participationHistory.filter(item => item.type === 'study');

    if (studies.length === 0) {
      return null;
    }

    // 처음에는 4개만 표시, "Show more study" 클릭시 전체 표시
    const displayedStudies = showAll ? studies : studies.slice(0, 4);
    const hasMoreItems = studies.length > 4;

    const getStatusText = (status: ParticipationHistory['status']) => {
      switch (status) {
        case 'ongoing':
          return '스터디 진행 중';
        case 'completed':
          return '스터디 종료';
        default:
          return '스터디 종료';
      }
    };

    const formatDateRange = (startDate: string, endDate?: string) => {
      return endDate ? `${startDate} - ${endDate}` : `${startDate} -`;
    };

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
                    {getStatusText(study.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMoreItems && (
            <div className={styles.showMoreContainer}>
              <button type="button" onClick={handleToggleShowAll} className={styles.showMoreButton}>
                {showAll ? 'Show less study ▲' : 'Show more study ▼'}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }
);

StudySection.displayName = 'StudySection';
export default StudySection;
