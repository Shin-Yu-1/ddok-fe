import ProfileBar from '@/components/ProfileBar/ProfileBar';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import type { RankingUser } from '@/types/ranking';

import styles from './Top10RankingSection.module.scss';

interface Top10RankingSectionProps {
  top10Users: RankingUser[];
}

const Top10RankingSection = ({ top10Users }: Top10RankingSectionProps) => {
  // Badge 타입 매핑 함수
  const mapBadgeType = (type: string): BadgeType => {
    switch (type.toLowerCase()) {
      case 'login':
        return BadgeType.LOGIN;
      case 'complete':
        return BadgeType.COMPLETE;
      case 'leader_complete':
        return BadgeType.LEADER_COMPLETE;
      case 'abandon':
        return BadgeType.ABANDON;
      default:
        return BadgeType.LOGIN;
    }
  };

  const mapBadgeTier = (tier: string): BadgeTier => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return BadgeTier.BRONZE;
      case 'silver':
        return BadgeTier.SILVER;
      case 'gold':
        return BadgeTier.GOLD;
      default:
        return BadgeTier.BRONZE;
    }
  };

  if (!top10Users || top10Users.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.sectionTitle}>전체 온도 랭킹 Top 10</h3>
        <div className={styles.noData}>랭킹 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>전체 온도 랭킹 Top 10</h3>
      <div className={styles.rankingTable}>
        {top10Users.map((user, index) => (
          <div key={user.userId} className={styles.rankingRow}>
            <div className={styles.rankCell}>
              <span
                className={`${styles.rankNumber} ${index === 0 ? styles.gold : index === 1 ? styles.silver : index === 2 ? styles.bronze : ''}`}
              >
                {index + 1}
              </span>
            </div>
            <div className={styles.profileCell}>
              <ProfileBar
                userId={user.userId}
                nickname={user.nickname}
                profileImageUrl={user.profileImageUrl}
                profileImageAlt={`${user.nickname} 프로필`}
                mainBadge={
                  user.mainBadge
                    ? {
                        type: mapBadgeType(user.mainBadge.type),
                        tier: mapBadgeTier(user.mainBadge.tier),
                      }
                    : undefined
                }
                abandonBadge={user.abandonBadge}
                mainPosition={user.mainPosition}
                temperature={user.temperature}
                dmRequestPending={user.dmRequestPending}
                chatRoomId={user.chatRoomId}
                className={styles.profileBar}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top10RankingSection;
