import type { UserType } from '../../schemas/teamMemberSchema';

import styles from './UserRow.module.scss';

export interface UserProps {
  user: UserType;
}

const User = ({ user }: UserProps) => {
  return (
    <div className={styles.user}>
      <div className={styles.user__item}>
        <div className={styles.user__item__left}>
          <img
            className={styles.user__item__left__img}
            src="/src/assets/images/avatar.png"
            alt="Banner"
          />
          <div className={styles.user__item__left__nickname}>{user.nickname}</div>
          <div className={styles.user__item__left__badges}>배지 리스트 표시</div>
        </div>
        <div className={styles.user__item__right}>
          <div className={styles.user__item__right__position}>{user.mainPosition}</div>
          <div className={styles.user__item__right__temperature}>{user.temperature}℃</div>
        </div>
      </div>
    </div>
  );
};

export default User;
