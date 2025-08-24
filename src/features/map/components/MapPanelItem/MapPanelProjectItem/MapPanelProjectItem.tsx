import { MapItemStatusFilter } from '../../../constants/MapItemStatusFilter.enum';

import styles from './MapPanelProjectItem.module.scss';

interface MapPanelProjectItemProps {
  category: string;
  projectId: number;
  title: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  teamStatus: string;
  bannerImageUrl: string;
}

const MapPanelProjectItem: React.FC<MapPanelProjectItemProps> = ({
  //   category,
  //   projectId,
  title,
  //   location: { latitude, longitude, address },
  teamStatus,
  bannerImageUrl,
}) => {
  return (
    <div className={styles.panel__list__item}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__img}>
          <img src={bannerImageUrl} alt="Banner" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{title}</div>
          <div className={styles.panel__list__item__category}>프로젝트</div>
        </div>
      </div>
      {teamStatus &&
        (teamStatus === 'RECRUITING' ? (
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

export default MapPanelProjectItem;
