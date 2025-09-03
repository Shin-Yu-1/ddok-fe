// 프로젝트 이력
// 프로젝트 이력

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import { useShowMore } from '../../hooks';
import { formatDateRange, getStatusText } from '../../utils';

import styles from './ProjectSection.module.scss';

interface ProjectSectionProps extends ProfileSectionProps {
  className?: string;
}

const ProjectSection = forwardRef<HTMLElement, ProjectSectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
    const { showAll, handleToggleShowAll, getDisplayItems, hasMoreItems, getShowMoreText } =
      useShowMore(3);

    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('projects');
      }
    };

    if (!user.participationHistory) {
      return null;
    }

    // 프로젝트만 필터링
    const projects = user.participationHistory.filter(item => item.type === 'project');

    if (projects.length === 0) {
      return null;
    }

    // 처음에는 3개만 표시, "Show more project" 클릭시 전체 표시
    const displayedProjects = getDisplayItems(projects);
    const hasMore = hasMoreItems(projects);

    return (
      <section
        ref={ref}
        className={clsx(styles.projectSection, className)}
        aria-labelledby="project-title"
      >
        <div className={styles.header}>
          <h2 id="project-title" className={styles.title}>
            프로젝트
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="프로젝트 이력 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div>
          <div className={styles.projectList}>
            {displayedProjects.map(project => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectIcon}>📋</div>

                <div className={styles.projectInfo}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDate}>
                    {formatDateRange(project.startDate, project.endDate)}
                  </p>
                </div>

                <div className={styles.projectStatus}>
                  <span className={clsx(styles.statusBadge, styles[`status-${project.status}`])}>
                    {getStatusText(project.status, 'project')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className={styles.showMoreContainer}>
              <button type="button" onClick={handleToggleShowAll} className={styles.showMoreButton}>
                {getShowMoreText(showAll, 'project')}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }
);

ProjectSection.displayName = 'ProjectSection';
export default ProjectSection;
