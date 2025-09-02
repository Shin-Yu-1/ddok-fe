import type { Player } from '@/features/map/types';

import styles from '../MapPanelItem.module.scss';

interface MapPanelPlayerItemProps {
  //   category: string;
  //   userId: number;
  //   nickname: string;
  //   location: {
  //     latitude: number;
  //     longitude: number;
  //     address: string;
  //   };
  //   profileImageUrl: string;
  player: Player;
  onItemClick: () => void;
}

const MapPanelPlayerItem: React.FC<MapPanelPlayerItemProps> = ({
  //   category,
  //   projectId,
  //   nickname,
  //   location: { latitude, longitude, address },
  //   profileImageUrl,
  player,
  onItemClick,
}) => {
  return (
    <div className={styles.panel__list__item} onClick={onItemClick}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__img}>
          <img src={player.profileImageUrl} alt="Profile" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{player.nickname}</div>
          <div className={styles.panel__list__item__category}>플레이어</div>
        </div>
      </div>
    </div>
  );
};

export default MapPanelPlayerItem;
