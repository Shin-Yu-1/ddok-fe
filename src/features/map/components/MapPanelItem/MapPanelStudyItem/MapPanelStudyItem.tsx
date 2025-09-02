import type { StudyPanelItem } from '@/features/map/types';
import { MAP_ITEM_STATUS_LABELS, TeamStatus } from '@/features/map/types/common';

import styles from '../MapPanelItem.module.scss';

interface MapPanelStudyItemProps {
  study: StudyPanelItem;
  onItemClick: () => void;
}

const MapPanelStudyItem: React.FC<MapPanelStudyItemProps> = ({ study, onItemClick }) => {
  return (
    <div className={styles.panel__list__item} onClick={onItemClick}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__img}>
          <img src={study.bannerImageUrl} alt="Banner" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{study.title}</div>
          <div className={styles.panel__list__item__category}>스터디</div>
        </div>
      </div>
      {study.teamStatus &&
        (study.teamStatus === TeamStatus.RECRUITING ? (
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

export default MapPanelStudyItem;
