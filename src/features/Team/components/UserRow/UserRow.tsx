import { useState, useRef, useEffect } from 'react';

import { DotsThreeVerticalIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Thermometer from '@/components/Thermometer/Thermometer';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Badge';
import { useAuthStore } from '@/stores/authStore';

import type { UserType } from '../../schemas/teamMemberSchema';

import styles from './UserRow.module.scss';

export interface UserProps {
  user: UserType;
}

const User = ({ user }: UserProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuthStore();

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDMRequest = () => {
    // TODO: DM 요청 로직 구현
    console.log(`DM 요청 보내기: ${user.nickname}`);
    setIsDropdownOpen(false);
  };

  const handleDMSend = () => {
    // TODO: DM 보내기 로직 구현 (기존 채팅방으로 이동)
    console.log(`DM 보내기: ${user.nickname}, chatRoomId: ${user.chatRoomId}`);
    setIsDropdownOpen(false);
  };

  // 현재 사용자와 같은 사용자인지 확인
  const isCurrentUser = currentUser?.id === user.userId;

  // DM 상태에 따른 버튼 텍스트와 핸들러 결정
  const dmButtonText = user.chatRoomId ? 'DM 보내기' : 'DM 요청 보내기';
  const dmButtonHandler = user.chatRoomId ? handleDMSend : handleDMRequest;

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.user}>
      <div className={styles.user__item}>
        <div className={styles.user__item__left}>
          <img className={styles.user__item__left__img} src={user.profileImageUrl} alt="Avatar" />
          <div className={styles.user__item__left__nickname}>{user.nickname}</div>
          <div className={styles.user__item__left__badges}>
            {user.mainBadge && (
              <Badge
                className={styles.badge}
                mainBadge={{
                  type: user.mainBadge.type as BadgeType,
                  tier: user.mainBadge.tier as BadgeTier,
                }}
                widthSize="13px"
              />
            )}
            {user.abandonBadge && (
              <Badge
                className={styles.badge}
                abandonBadge={
                  user.abandonBadge && {
                    isGranted: user.abandonBadge.isGranted,
                    count: user.abandonBadge.count,
                  }
                }
                widthSize="13px"
              />
            )}
          </div>
        </div>

        <div className={styles.user__item__right}>
          <div className={styles.user__item__right__position}>{user.mainPosition}</div>
          <div className={styles.user__item__right__temperature}>
            <Thermometer temperature={user.temperature} />
            {user.temperature}℃
          </div>
          {!isCurrentUser && (
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <Button width="12" padding="0" onClick={handleDropdownToggle}>
                <DotsThreeVerticalIcon size={20} />
              </Button>
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <button className={styles.dropdownItem} onClick={dmButtonHandler}>
                    {dmButtonText}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
