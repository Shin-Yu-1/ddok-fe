import Thermometer from '@/components/Thermometer/Thermometer';
import type { PlayerPanelItem } from '@/features/map/schemas/mapItemSchema';

import styles from '../MapPanelItem.module.scss';

interface MapPanelPlayerItemProps {
  player: PlayerPanelItem;
  onItemClick: () => void;
}

const MapPanelPlayerItem: React.FC<MapPanelPlayerItemProps> = ({ player, onItemClick }) => {
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
      <div className={styles.panel__list__item__temperature}>
        <Thermometer temperature={player.temperature} width={15} />
        {player.temperature}℃
      </div>
    </div>
  );
};

export default MapPanelPlayerItem;
