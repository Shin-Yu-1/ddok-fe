import styles from './PostCapacityDisplay.module.scss';

interface PostCapacityDisplayProps {
  capacity: number;
  applicantCount: number;
  confirmedCount: number;
}

const PostCapacityDisplay = ({
  capacity,
  applicantCount,
  confirmedCount,
}: PostCapacityDisplayProps) => {
  const getStatusColor = () => {
    const ratio = confirmedCount / capacity;
    if (ratio >= 1) return 'full';
    if (ratio >= 0.7) return 'almost';
    return 'recruiting';
  };

  // 도넛 차트용 계산
  const confirmedRatio = Math.min((confirmedCount / capacity) * 100, 100);
  const circumference = 2 * Math.PI * 35; // 반지름 35인 원의 둘레

  const confirmedOffset = circumference - (confirmedRatio / 100) * circumference;

  return (
    <div className={styles.container}>
      {/* 차트와 정보 */}
      <div className={styles.mainContent}>
        {/* 도넛 차트 */}
        <div className={styles.chartContainer}>
          <svg className={styles.chart} viewBox="0 0 80 80">
            {/* 배경 원 */}
            <circle cx="40" cy="40" r="35" fill="none" stroke="var(--gray-4)" strokeWidth="6" />

            {/* 확정 인원 */}
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={`var(--${getStatusColor() === 'recruiting' ? 'green' : getStatusColor() === 'almost' ? 'yellow' : 'red'}-1)`}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={confirmedOffset}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              className={styles.confirmedCircle}
            />
          </svg>

          {/* 중앙 텍스트 */}
          <div className={styles.chartCenter}>
            <div className={styles.centerNumber}>{confirmedCount}</div>
            <div className={styles.centerTotal}>/{capacity}</div>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className={styles.statsContainer}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>확정 인원</span>
            <span className={styles.statValue}>{confirmedCount}명</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>지원자 수</span>
            <span className={styles.statValue}>{applicantCount}명</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>팀 구성 진행률</span>
            <span className={styles.statValue}>
              {Math.round((confirmedCount / capacity) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCapacityDisplay;
