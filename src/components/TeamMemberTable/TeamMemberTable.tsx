import ProfileBar from '@/components/ProfileBar/ProfileBar';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';

import styles from './TeamMemberTable.module.scss';

interface TeamMember {
  userId: number;
  nickname: string;
  profileImageUrl?: string | null;
  mainPosition?: string | null;
  mainBadge?: {
    type: string;
    tier: string;
  } | null;
  abandonBadge?: {
    isGranted: boolean;
    count: number;
  } | null;
  temperature: number | null;
  decidedPosition: string;
  isMine: boolean;
  chatRoomId: number | null;
  dmRequestPending: boolean;
}

interface TeamMemberTableProps {
  /** 프로젝트 리더 */
  leader: TeamMember;
  /** 팀원들 */
  participants: TeamMember[];
  /** 테이블 제목 */
  title?: string;
  /** 외부 스타일 클래스 */
  className?: string;
  /** 스터디 모드 여부 - true면 스터디장/스터디원으로 표시 */
  isStudyMode?: boolean;
}

// Badge 타입 매핑
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

const TeamMemberTable = ({
  leader,
  participants,
  className,
  isStudyMode = false,
}: TeamMemberTableProps) => {
  // 스터디 모드일 경우 다른 로직 적용
  if (isStudyMode) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        <div className={styles.table}>
          {/* 테이블 헤더 */}
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>역할</div>
            <div className={styles.headerCell}>멤버</div>
          </div>

          {/* 테이블 바디 */}
          <div className={styles.tableBody}>
            {/* 스터디장 행 */}
            <div className={styles.tableRow}>
              <div className={styles.positionCell}>
                <span className={styles.leaderButton}>스터디장</span>
              </div>
              <div className={styles.memberCell}>
                <div className={styles.membersContainer}>
                  <div className={styles.memberItem}>
                    <ProfileBar
                      userId={leader.userId}
                      nickname={leader.nickname}
                      profileImageUrl={leader.profileImageUrl || undefined}
                      profileImageAlt={`${leader.nickname} 프로필`}
                      mainBadge={
                        leader.mainBadge
                          ? {
                              type: mapBadgeType(leader.mainBadge.type),
                              tier: mapBadgeTier(leader.mainBadge.tier),
                            }
                          : undefined
                      }
                      abandonBadge={
                        leader.abandonBadge?.isGranted
                          ? {
                              isGranted: true,
                              count: leader.abandonBadge.count,
                            }
                          : undefined
                      }
                      mainPosition={leader.mainPosition || '스터디장'}
                      temperature={leader.temperature ?? 36.5}
                      dmRequestPending={leader.dmRequestPending}
                      chatRoomId={leader.chatRoomId}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 스터디원 행 (참여자들이 있을 때만) */}
            {participants.length > 0 && (
              <div className={styles.tableRow}>
                <div className={styles.positionCell}>
                  <span className={styles.positionTag}>스터디원</span>
                </div>
                <div className={styles.memberCell}>
                  <div className={styles.membersContainer}>
                    {participants.map(member => (
                      <div key={member.userId} className={styles.memberItem}>
                        <ProfileBar
                          userId={member.userId}
                          nickname={member.nickname}
                          profileImageUrl={member.profileImageUrl || undefined}
                          profileImageAlt={`${member.nickname} 프로필`}
                          mainBadge={
                            member.mainBadge
                              ? {
                                  type: mapBadgeType(member.mainBadge.type),
                                  tier: mapBadgeTier(member.mainBadge.tier),
                                }
                              : undefined
                          }
                          abandonBadge={
                            member.abandonBadge?.isGranted
                              ? {
                                  isGranted: true,
                                  count: member.abandonBadge.count,
                                }
                              : undefined
                          }
                          mainPosition={member.mainPosition || '스터디원'}
                          temperature={member.temperature ?? 36.5}
                          dmRequestPending={member.dmRequestPending}
                          chatRoomId={member.chatRoomId}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 기존 프로젝트 모드 로직
  const allMembers = [leader, ...participants];

  // 포지션별로 그룹화
  const membersByPosition = allMembers.reduce(
    (acc, member) => {
      const position = member.decidedPosition;
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(member);
      return acc;
    },
    {} as Record<string, TeamMember[]>
  );

  // 포지션 순서 정렬 (리더의 포지션을 첫 번째로)
  const positionOrder = Object.keys(membersByPosition).sort((a, b) => {
    if (membersByPosition[a].some(m => m.userId === leader.userId)) return -1;
    if (membersByPosition[b].some(m => m.userId === leader.userId)) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.table}>
        {/* 테이블 헤더 */}
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>담당 포지션</div>
          <div className={styles.headerCell}>팀 멤버</div>
        </div>

        {/* 테이블 바디 */}
        <div className={styles.tableBody}>
          {positionOrder.map(position => (
            <div key={position} className={styles.tableRow}>
              {/* 포지션 셀 */}
              <div className={styles.positionCell}>
                {/* 리더인 경우 팀장 버튼을 먼저 표시 */}
                {membersByPosition[position].some(m => m.userId === leader.userId) && (
                  <span className={styles.leaderButton}>팀장</span>
                )}
                <span className={styles.positionTag}>{position}</span>
              </div>

              {/* 멤버 셀 */}
              <div className={styles.memberCell}>
                <div className={styles.membersContainer}>
                  {membersByPosition[position].map(member => (
                    <div key={member.userId} className={styles.memberItem}>
                      <ProfileBar
                        userId={member.userId}
                        nickname={member.nickname}
                        profileImageUrl={member.profileImageUrl || undefined}
                        profileImageAlt={`${member.nickname} 프로필`}
                        mainBadge={
                          member.mainBadge
                            ? {
                                type: mapBadgeType(member.mainBadge.type),
                                tier: mapBadgeTier(member.mainBadge.tier),
                              }
                            : undefined
                        }
                        abandonBadge={
                          member.abandonBadge?.isGranted
                            ? {
                                isGranted: true,
                                count: member.abandonBadge.count,
                              }
                            : undefined
                        }
                        mainPosition={member.mainPosition || position}
                        temperature={member.temperature ?? 36.5}
                        dmRequestPending={member.dmRequestPending}
                        chatRoomId={member.chatRoomId}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberTable;
