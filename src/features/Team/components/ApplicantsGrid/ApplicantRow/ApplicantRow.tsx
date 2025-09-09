import Button from '@/components/Button/Button';
import User from '@/features/Team/components/UserRow/UserRow';

import type { ApplicantType } from '../../../schemas/teamApplicantsListSchema';

import styles from './ApplicantRow.module.scss';

interface ApplicantRowProps {
  member: ApplicantType;
}

const ApplicantRow = ({ member }: ApplicantRowProps) => {
  return (
    <>
      <div className={styles.position}>{member.appliedPosition}</div>
      <User user={member.user} />
      <div className={styles.actionContainer}>
        <Button
          className={styles.action}
          backgroundColor="var(--blue-1)"
          fontSize="var(--fs-xxsmall)"
          height="28px"
          textColor="var(--white-2)"
          radius="xsm"
          fontWeightPreset="regular"
        >
          수락
        </Button>
        <Button
          className={styles.action}
          backgroundColor="var(--gray-1)"
          fontSize="var(--fs-xxsmall)"
          height="28px"
          textColor="var(--white-2)"
          radius="xsm"
          fontWeightPreset="regular"
        >
          거절
        </Button>
      </div>
    </>
  );
};

export default ApplicantRow;
