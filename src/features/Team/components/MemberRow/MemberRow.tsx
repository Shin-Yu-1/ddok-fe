import Button from '@/components/Button/Button';
import UserRow from '@/features/Team/components/UserRow/UserRow';

import type { MemberType } from '../../schemas/teamMemberSchema';

import styles from './MemberRow.module.scss';

interface MemberRowProps {
  member: MemberType;
}

const MemberRow = ({ member }: MemberRowProps) => {
  return (
    <>
      <div className={styles.position}>{member.decidedPosition}</div>
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
