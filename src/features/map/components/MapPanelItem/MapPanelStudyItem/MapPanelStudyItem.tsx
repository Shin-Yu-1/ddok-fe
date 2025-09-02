import type { Study } from '@/features/map/types';

import { MapItemStatusFilter } from '../../../constants/MapItemStatusFilter.enum';
import styles from '../MapPanelItem.module.scss';

interface MapPanelStudyItemProps {
  study: Study;
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
        (study.teamStatus === 'RECRUITING' ? (
          <div
            className={`${styles.panel__list__item__status} ${styles.panel__list__item__status__recruiting}`}
          >
            {MapItemStatusFilter.RECRUITING}
          </div>
        ) : (
          <div
            className={`${styles.panel__list__item__status} ${styles.panel__list__item__status__ongoing}`}
          >
            {MapItemStatusFilter.ONGOING}
          </div>
        ))}
    </div>
  );
};

export default MapPanelStudyItem;
