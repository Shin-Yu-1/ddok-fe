import type { CafePanelItem } from '@/features/map/schemas/mapItemSchema';

import styles from '../MapPanelItem.module.scss';

interface MapPanelCafeItemProps {
  cafe: CafePanelItem;
  onItemClick: () => void;
}

const MapPanelCafeItem: React.FC<MapPanelCafeItemProps> = ({ cafe, onItemClick }) => {
  return (
    <div className={styles.panel__list__item} onClick={onItemClick}>
      <div className={styles.panel__list__item__user}>
        <div className={styles.panel__list__item__img}>
          <img src={cafe.bannerImageUrl} alt="Banner" />
        </div>
        <div className={styles.panel__list__item__info}>
          <div className={styles.panel__list__item__title}>{cafe.title}</div>
          <div className={styles.panel__list__item__category}>카페</div>
        </div>
      </div>
    </div>
  );
};

export default MapPanelCafeItem;
