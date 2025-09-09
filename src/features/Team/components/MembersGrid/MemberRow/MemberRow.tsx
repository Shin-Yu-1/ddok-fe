import Button from '@/components/Button/Button';
import UserRow from '@/features/Team/components/UserRow/UserRow';
import type { MemberType } from '@/features/Team/schemas/teamMemberSchema';

import styles from './MemberRow.module.scss';

interface MemberRowProps {
  member: MemberType;
}

const MemberRow = ({ member }: MemberRowProps) => {
  return (
    <>
      <div className={styles.positionContainer}>
        {member.role === 'LEADER' ? <div className={styles.leader}>팀장</div> : null}
        <div className={styles.position}>{member.decidedPosition}</div>
      </div>
      <UserRow user={member.user} />
      <div className={styles.actionContainer}>
        <Button
          className={styles.action}
          backgroundColor="var(--gray-1)"
          fontSize="var(--fs-xxsmall)"
          height="28px"
          textColor="var(--white-2)"
          radius="xsm"
          fontWeightPreset="regular"
        >
          추방
        </Button>
      </div>
    </>
  );
};

export default MemberRow;
