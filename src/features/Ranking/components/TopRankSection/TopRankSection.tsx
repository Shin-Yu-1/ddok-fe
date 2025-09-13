// import dayjs from 'dayjs';

import ProfileBar from '@/components/ProfileBar/ProfileBar';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import type { RankingUser } from '@/types/ranking';

import styles from './TopRankSection.module.scss';

interface TopRankSectionProps {
  topUser: RankingUser | null;
}

const TopRankSection = ({ topUser }: TopRankSectionProps) => {
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

  // 업데이트 시간 포맷팅 (1시간 단위)
  // const formatUpdateTime = (updatedAt: string): string => {
  //   const date = dayjs(updatedAt);
  //   const roundedDate = date.startOf('hour');
  //   return roundedDate.format('YYYY.MM.DD HH:00');
  // };

  if (!topUser) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            전체 온도 랭킹 <span className={styles.highlight}>Top 1</span>
          </h1>
        </div>
        <div className={styles.noData}>1위 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          전체 온도 랭킹
          <span className={styles.highlight}> Top 1</span>
        </div>
        {/* <div className={styles.updateTime}>업데이트 : {formatUpdateTime(topUser.updatedAt)}</div> */}

        <div className={styles.profileContainer}>
          <ProfileBar
            userId={topUser.userId}
            nickname={topUser.nickname}
            profileImageUrl={topUser.profileImageUrl}
            profileImageAlt={`${topUser.nickname} 프로필`}
            mainBadge={{
              type: mapBadgeType(topUser.mainBadge.type),
              tier: mapBadgeTier(topUser.mainBadge.tier),
            }}
            abandonBadge={topUser.abandonBadge}
            mainPosition={topUser.mainPosition}
            temperature={topUser.temperature}
            dmRequestPending={topUser.dmRequestPending}
            chatRoomId={topUser.chatRoomId}
            className={styles.profileBar}
          />
        </div>
      </div>
    </div>
  );
};

export default TopRankSection;
