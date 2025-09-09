import MemberRow from '@/features/Team/components/MemberRow/MemberRow';

import type { MemberType } from '../../schemas/teamMemberSchema';

import styles from './MembersGrid.module.scss';

interface MembersGridProps {
  members: MemberType[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

const MembersGrid = ({ members }: MembersGridProps) => {
  if (!members || members.length === 0) {
    return <div className={styles.empty}>팀원이 없습니다.</div>;
  }

  return (
    <div className={styles.membersGrid}>
      <div className={styles.gridLabel}>담당 포지션</div>
      <div className={styles.gridLabel}>멤버</div>
      <div className={styles.gridLabel}>액션</div>

      {members.map(member => (
        <MemberRow key={member.memberId} member={member} />
      ))}
    </div>
  );
};

export default MembersGrid;
