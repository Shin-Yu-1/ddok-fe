// 프로젝트 이력
// 프로젝트 이력

import { forwardRef } from 'react';

import { ShoppingBagOpenIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import type { ProfileSectionProps } from '@/types/user';

import { useInfiniteLoad } from '../../hooks';
import { formatDateRange, getStatusText } from '../../utils';

import styles from './ProjectSection.module.scss';

interface ProjectSectionProps extends ProfileSectionProps {
  className?: string;
}

const ProjectSection = forwardRef<HTMLElement, ProjectSectionProps>(({ user, className }, ref) => {
  const navigate = useNavigate();
  const initialProjects = user.projects || [];
  const {
    items: projects,
    isLoading,
    hasMore,
    loadMore,
    getShowMoreText,
  } = useInfiniteLoad(user.userId, 'projects', initialProjects, user.projectsTotalItems);

  const handleProjectClick = (projectId: number, teamId: number) => {
    if (user.isMine) {
      // 본인 프로필: 팀관리 페이지로 이동
      navigate(`/team/${teamId}/setting`);
    } else {
      // 타인 프로필: 프로젝트 모집 공고 페이지로 이동
      navigate(`/detail/project/${projectId}`);
    }
  };

  const getAriaLabel = (title: string) => {
    return user.isMine
      ? `${title} 프로젝트 팀 관리 페이지로 이동`
      : `${title} 프로젝트 모집 공고 보기`;
  };

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
                <button
                  key={project.id}
                  type="button"
                  className={styles.projectItem}
                  onClick={() => handleProjectClick(project.id, project.teamId)}
                  aria-label={getAriaLabel(project.title)}
                >
                  <div className={styles.projectIcon}>
                    <ShoppingBagOpenIcon size={21} weight="regular" />
                  </div>

                  <div className={styles.projectInfo}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDate}>
                      {formatDateRange(project.startDate, project.endDate ?? undefined)}
                    </p>
                  </div>

                  <div className={styles.projectStatus}>
                    <span className={clsx(styles.statusBadge, styles[`status-${project.status}`])}>
                      {getStatusText(project.status, 'project')}
                    </span>
                  </div>
                </button>
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
