import { MapItemStatusFilter } from '../../constants/MapItemStatusFilter.enum';

import styles from './MapPanelItem.module.scss';

interface MapPanelItemProps {
  category: string;
  title?: string;
  nickname?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  image: string;
  status?: string;
  handleSubPanelToggle: () => void;
}

const MapPanelItem: React.FC<MapPanelItemProps> = ({
  category,
  title,
  nickname,
  status,
  image,
  handleSubPanelToggle,
}) => {
  return (
    <div className={styles.panel__list__item} onClick={handleSubPanelToggle}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__avatar}>
          <img src={image} alt="Avatar" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{title ? title : nickname}</div>
          <div className={styles.panel__list__item__category}>{category}</div>
        </div>
      </div>
      {status &&
        (status === 'RECRUITING' ? (
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

export default MapPanelItem;
