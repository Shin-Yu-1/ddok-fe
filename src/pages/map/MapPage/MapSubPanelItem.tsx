import { MapItemStatusFilter } from './MapItemStatusFilter';
import styles from './MapSubPanelItem.module.scss';

interface MapSubPanelItemProps {
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
}

const MapSubPanelItem: React.FC<MapSubPanelItemProps> = ({
  nickname,
  title,
  category,
  status,
  image,
}) => {
  return (
    <div className={styles.subPanel__list__item}>
      <div className={styles.subPanel__list__item__user}>
        <div className={styles.subPanel__list__item__avatar}>
          <img src={image} alt="Avatar" />
        </div>
        <div className={styles.subPanel__list__item__info}>
          <div className={styles.subPanel__list__item__title}>{title ? title : nickname}</div>
          <div className={styles.subPanel__list__item__category}>{category}</div>
        </div>
      </div>
      {status &&
        (status === 'RECRUITING' ? (
          <div
            className={`${styles.subPanel__list__item__status} ${styles.subPanel__list__item__status__recruiting}`}
          >
            {MapItemStatusFilter.RECRUITING}
          </div>
        ) : (
          <div
            className={`${styles.subPanel__list__item__status} ${styles.subPanel__list__item__status__ongoing}`}
          >
            {MapItemStatusFilter.ONGOING}
          </div>
        ))}
    </div>
  );
};

export default MapSubPanelItem;
