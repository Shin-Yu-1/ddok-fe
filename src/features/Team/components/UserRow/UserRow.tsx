import { DotsThreeVertical } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Thermometer from '@/components/Thermometer/Thermometer';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Badge';

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
          <div className={styles.user__item__left__badge}>
            <Badge
              className={styles.mainBadge}
              mainBadge={{
                type: user.mainBadge.type as BadgeType,
                tier: user.mainBadge.tier as BadgeTier,
              }}
              widthSize="13px"
            />
          </div>
        </div>

        <div className={styles.user__item__right}>
          <div className={styles.user__item__right__position}>{user.mainPosition}</div>
          <div className={styles.user__item__right__temperature}>
            <Thermometer temperature={user.temperature} />
            {user.temperature}℃
          </div>
          <Button width="12" padding="0">
            <DotsThreeVertical size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default User;
