import { useCallback, useRef } from 'react';

import { useGetCafeStat } from '../../hooks/useGetCafeStat';

import styles from './MapSubPanel.module.scss';
import MapSubPanelReviews from './MapSubPanelReviews/MapSubPanelReviews';
import MapSubPanelStats from './MapSubPanelStats/MapSubPanelStats';

interface MapSubPanelProps {
  cafeId: number;
}

const MapSubPanel: React.FC<MapSubPanelProps> = ({ cafeId }) => {
  const { data: cafeStatResponse, isLoading, isError, refetch } = useGetCafeStat({ cafeId });

  // 각 컴포넌트의 refetch 함수를 저장할 ref 배열
  const refetchFunctions = useRef<(() => void)[]>([]);

  const statData = cafeStatResponse?.data;

  // 컴포넌트에서 refetch 함수를 등록하는 콜백
  const registerRefetch = useCallback((componentRefetch: () => void) => {
    // 중복 등록 방지
    if (!refetchFunctions.current.includes(componentRefetch)) {
      refetchFunctions.current.push(componentRefetch);
    }
  }, []);

  // 모든 데이터를 새로고침하는 함수 (MapSubPanelStats에서 호출)
  const refreshAllData = useCallback(() => {
    refetch(); // CafeStat 새로고침
    refetchFunctions.current.forEach(fn => fn()); // 등록된 모든 refetch 함수 실행
  }, [refetch]);

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
      <MapSubPanelStats statData={statData} cafeId={cafeId} onDataRefresh={refreshAllData} />

      {/* 리뷰 리스트 */}
      <MapSubPanelReviews cafeId={cafeId} onDataRefresh={registerRefetch} />
    </div>
  );
};

export default MapSubPanel;
