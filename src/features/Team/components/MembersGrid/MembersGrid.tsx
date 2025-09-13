import type { MemberType } from '../../schemas/teamMemberSchema';

import MemberRow from './MemberRow/MemberRow';
import styles from './MembersGrid.module.scss';

interface MembersGridProps {
  teamType: string;
  members: MemberType[];
  amILeader: boolean;
  teamId: number;
  teamStatus?: string; // 팀 상태 추가
}

const MembersGrid = ({ teamType, members, amILeader, teamId, teamStatus }: MembersGridProps) => {
  if (!members || members.length === 0) {
    return <div className={styles.empty}>팀원이 없습니다.</div>;
  }

  return (
    <div className={styles.membersGrid}>
      <div className={styles.gridLabel}>담당 포지션</div>
      <div className={styles.gridLabel}>멤버</div>
      <div className={styles.gridLabel}>액션</div>

      {members.map(member => (
        <MemberRow
          teamType={teamType}
          key={member.memberId}
          member={member}
          amILeader={amILeader}
          teamId={teamId}
          teamStatus={teamStatus}
        />
      ))}
    </div>
  );
};

export default MembersGrid;
