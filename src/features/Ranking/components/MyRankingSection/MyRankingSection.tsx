import ProfileBar from '@/components/ProfileBar/ProfileBar';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import type { MyRankingUser } from '@/types/ranking';

import styles from './MyRankingSection.module.scss';

interface MyRankingSectionProps {
  myRanking: MyRankingUser | null;
}

const MyRankingSection = ({ myRanking }: MyRankingSectionProps) => {
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

  if (!myRanking) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>당신의 현재 온도는?</div>
      <div className={styles.content}>
        <ProfileBar
          userId={myRanking.userId}
          nickname={myRanking.nickname}
          profileImageUrl={myRanking.profileImageUrl}
          profileImageAlt={`${myRanking.nickname} 프로필`}
          mainBadge={{
            type: mapBadgeType(myRanking.mainBadge.type),
            tier: mapBadgeTier(myRanking.mainBadge.tier),
          }}
          abandonBadge={myRanking.abandonBadge}
          mainPosition={myRanking.mainPosition}
          temperature={myRanking.temperature}
          className={styles.profileBar}
        />
      </div>
    </div>
  );
};

export default MyRankingSection;
