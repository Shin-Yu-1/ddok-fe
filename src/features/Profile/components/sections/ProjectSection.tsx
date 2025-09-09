// 프로젝트 이력
// 프로젝트 이력

import { forwardRef } from 'react';

import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import { useInfiniteLoad } from '../../hooks';
import { formatDateRange, getStatusText } from '../../utils';

import styles from './ProjectSection.module.scss';

interface ProjectSectionProps extends ProfileSectionProps {
  className?: string;
}

const ProjectSection = forwardRef<HTMLElement, ProjectSectionProps>(({ user, className }, ref) => {
  const initialProjects = user.projects || [];
  const {
    items: projects,
    isLoading,
    hasMore,
    loadMore,
    getShowMoreText,
  } = useInfiniteLoad(user.userId, 'projects', initialProjects);

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
      </div>

      <div>
        {projects.length > 0 ? (
          <>
            <div className={styles.projectList}>
              {projects.map(project => (
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
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoading}
                  className={styles.showMoreButton}
                >
                  {getShowMoreText()}
                </button>
              </div>
            )}
          </>
        ) : (
          <div>
            <p>참여한 프로젝트가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
});

ProjectSection.displayName = 'ProjectSection';
export default ProjectSection;
