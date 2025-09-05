import Button from '@/components/Button/Button';
import User from '@/features/Team/components/User/User';

import styles from './ParticipantRow.module.scss';

const ParticipantRow = () => {
  return (
    <>
      <div className={styles.position}>팀장</div>
      <User />
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

export default ParticipantRow;
