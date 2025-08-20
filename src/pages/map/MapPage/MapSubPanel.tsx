import styles from './MapSubPanel.module.scss';

interface MapSubPanelProps {
  isOpen: boolean;
}

const MapSubPanel: React.FC<MapSubPanelProps> = ({ isOpen }) => {
  return (
    <div className={styles.subPanel__container}>
      <div className={styles.subPanel__title}>지도 목록</div>
      <div className={styles.subPanel__searchSection}>
        <div className={styles.subPanel__searchBar}>검색 바</div>
        <div className={styles.subPanel__filter}>
          필터 (프로젝트 / 스터디 / 플레이어 / 추천장소)
        </div>
        <div className={styles.subPanel__detailFilter}>세부 필터(RECRUITING / ONGOING)</div>
      </div>
      <div className={styles.subPanel__list}>목록</div>
      <div className={styles.subPanel__status}>현재 상태 : {isOpen ? 'OPENED' : 'CLOSED'}</div>
    </div>
  );
};

export default MapSubPanel;
