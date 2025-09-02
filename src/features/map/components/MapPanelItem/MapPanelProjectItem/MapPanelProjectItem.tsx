import type { Project } from '@/features/map/types';

import { MAP_ITEM_STATUS_LABELS } from '../../../constants/mapItemLabels';
import styles from '../MapPanelItem.module.scss';

interface MapPanelProjectItemProps {
  project: Project;
  onItemClick: () => void;
}

const MapPanelProjectItem: React.FC<MapPanelProjectItemProps> = ({ project, onItemClick }) => {
  return (
    <div className={styles.panel__list__item} onClick={onItemClick}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__img}>
          <img src={project.bannerImageUrl} alt="Banner" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{project.title}</div>
          <div className={styles.panel__list__item__category}>프로젝트</div>
        </div>
      </div>
      {project.teamStatus &&
        (project.teamStatus === 'RECRUITING' ? (
          <div
            className={`${styles.panel__list__item__status} ${styles.panel__list__item__status__recruiting}`}
          >
            {MAP_ITEM_STATUS_LABELS.RECRUITING}
          </div>
        ) : (
          <div
            className={`${styles.panel__list__item__status} ${styles.panel__list__item__status__ongoing}`}
          >
            {MAP_ITEM_STATUS_LABELS.ONGOING}
          </div>
        ))}
    </div>
  );
};

export default MapPanelProjectItem;
