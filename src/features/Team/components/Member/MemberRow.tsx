import Button from '@/components/Button/Button';
import User from '@/features/Team/components/User/User';

import styles from './MemberRow.module.scss';

const MemberRow = () => {
  return (
    <>
      <div className={styles.position}>포지션</div>
      <User />
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
