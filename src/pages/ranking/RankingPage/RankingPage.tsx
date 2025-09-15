import dayjs from 'dayjs';

import MyRankingSection from '@/features/Ranking/components/MyRankingSection/MyRankingSection';
import RegionalRankingSection from '@/features/Ranking/components/RegionalRankingSection/RegionalRankingSection';
import Top10RankingSection from '@/features/Ranking/components/Top10RankingSection/Top10RankingSection';
import TopRankSection from '@/features/Ranking/components/TopRankSection/TopRankSection';
import { useRanking } from '@/features/Ranking/hooks/useRanking';
import { useAuthStore } from '@/stores/authStore';

import styles from './RankingPage.module.scss';

const RankingPage = () => {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const { topUser, top10Users, regionalUsers, myRanking, loading, error, refetch } =
    useRanking(isLoggedIn);

  // 업데이트 시간 포맷팅 (1시간 단위)
  const formatUpdateTime = (updatedAt: string): string => {
    const date = dayjs(updatedAt);
    const roundedDate = date.startOf('hour');
    return roundedDate.format('YYYY.MM.DD HH:00');
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>랭킹 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.error}>오류: {error}</div>
          <button className={styles.retryButton} onClick={handleRefresh}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 전체 온도 랭킹 Top 1 - 전체 너비 차지 */}
      <TopRankSection topUser={topUser} />

      <div className={styles.contentWrapper}>
        {/* 똑DDOK 온도 랭킹 타이틀 */}
        <div className={styles.mainTitleSection}>
          <h2 className={styles.mainTitle}>똑DDOK 온도 랭킹</h2>
          {topUser && (
            <div className={styles.subText}>업데이트 : {formatUpdateTime(topUser.updatedAt)}</div>
          )}
        </div>

        {/* 내 온도 정보 - 로그인한 경우만 표시 */}
        {isLoggedIn && <MyRankingSection myRanking={myRanking} />}

        {/* 전체 온도 랭킹 Top 10 */}
        <Top10RankingSection top10Users={top10Users} />

        {/* 지역별 Top 1 */}
        <RegionalRankingSection regionalUsers={regionalUsers} />
      </div>
    </div>
  );
};

export default RankingPage;
