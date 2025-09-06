import { useGetCafeStat } from '../../hooks/useGetCafeStat';
import { reviewsMockData } from '../../mocks/reviewsMockData';

import styles from './MapSubPanel.module.scss';
import MapSubPanelReviews from './MapSubPanelReviews/MapSubPanelReviews';
import MapSubPanelStats from './MapSubPanelStats/MapSubPanelStats';

interface MapSubPanelProps {
  cafeId: number;
}

const MapSubPanel: React.FC<MapSubPanelProps> = ({ cafeId }) => {
  const { data: cafeStatResponse, isLoading, isError } = useGetCafeStat({ cafeId });

  const statData = cafeStatResponse?.data;

  const reviewList = reviewsMockData?.cafeReviews;

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.subPanel__container}>
        <div className={styles.subPanel__loading}>로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError || !statData) {
    return (
      <div className={styles.subPanel__container}>
        <div className={styles.subPanel__error}>데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.subPanel__container}>
      {/* 서브 패널 헤더*/}
      <div className={styles.subPanel__header}>
        <div className={styles.subPanel__header__title}>{statData.title}</div>
        <div className={styles.subPanel__header__category}>추천 장소</div>
      </div>

      {/* 리뷰 통계 */}
      <MapSubPanelStats statData={statData} />

      {/* 리뷰 리스트 */}
      <MapSubPanelReviews reviewList={reviewList} />
    </div>
  );
};

export default MapSubPanel;
