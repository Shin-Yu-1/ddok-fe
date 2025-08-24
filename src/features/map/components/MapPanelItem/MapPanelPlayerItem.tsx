import styles from './MapPanelItem.module.scss';

interface MapPanelPlayerItemProps {
  category: string;
  userId: number;
  nickname: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  profileImageUrl: string;
  handleSubPanelToggle: () => void;
}

const MapPanelPlayerItem: React.FC<MapPanelPlayerItemProps> = ({
  //   category,
  //   projectId,
  nickname,
  //   location: { latitude, longitude, address },
  profileImageUrl,
  handleSubPanelToggle,
}) => {
  return (
    <div className={styles.panel__list__item} onClick={handleSubPanelToggle}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__img}>
          <img src={profileImageUrl} alt="Profile" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{nickname}</div>
          <div className={styles.panel__list__item__category}>플레이어</div>
        </div>
      </div>
    </div>
  );
};

export default MapPanelPlayerItem;
