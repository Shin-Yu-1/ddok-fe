import styles from './MapSubPanel.module.scss';

interface MapSubPanelProps {
  isOpen: boolean;
}

const MapSubPanel: React.FC<MapSubPanelProps> = ({ isOpen }) => {
  return (
    <div className={styles.subPanel__container}>
      {/* 패널 타이틀*/}
      <div className={styles.panel__title}>숨참고 딥다이브 카페</div>

      {/* 패널 상태 표시 (임시) */}
      <div className={styles.subPanel__openStatus}>
        서브 패널 상태 : {isOpen ? 'OPENED' : 'CLOSED'}
      </div>
    </div>
  );
};

export default MapSubPanel;
