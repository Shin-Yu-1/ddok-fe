import styles from './MapPanelCafeItem.module.scss';

interface MapPanelCafeItemProps {
  category: string;
  cafeId: number;
  title: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  bannerImageUrl: string;
  onItemClick: () => void;
}

const MapPanelCafeItem: React.FC<MapPanelCafeItemProps> = ({
  //   category,
  //   cafeId,
  title,
  //   location: { latitude, longitude, address },
  bannerImageUrl,
  onItemClick,
}) => {
  return (
    <div className={styles.panel__list__item} onClick={onItemClick}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__img}>
          <img src={bannerImageUrl} alt="Banner" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{title}</div>
          <div className={styles.panel__list__item__category}>카페</div>
        </div>
      </div>
    </div>
  );
};

export default MapPanelCafeItem;
