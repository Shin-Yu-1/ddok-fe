import styles from './MapSubPanel.module.scss';

const MapSubPanel = () => {
  return (
    <div className={styles.subPanel__container}>
      {/* 서브 패널 타이틀*/}
      <div className={styles.panel__title}>숨참고 딥다이브 카페</div>
    </div>
  );
};

export default MapSubPanel;
