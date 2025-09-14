import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import Thermometer from '@/components/Thermometer/Thermometer';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Badge';
import { useChatRequest } from '@/features/Profile/hooks/useChatRequest';
import { useAuthStore } from '@/stores/authStore';
import type { CompleteProfileInfo } from '@/types/user';

import type { UserType } from '../../schemas/teamMemberSchema';

import styles from './UserRow.module.scss';

export interface UserProps {
  user: UserType;
}

// UserType을 CompleteProfileInfo로 변환하는 헬퍼 함수
const convertUserToProfileInfo = (user: UserType): CompleteProfileInfo => {
  return {
    userId: user.userId,
    nickname: user.nickname,
    profileImage: user.profileImageUrl,
    ageGroup: '', // UserType에서는 제공하지 않음
    introduction: '', // UserType에서는 제공하지 않음
    isMine: false, // 팀 멤버는 기본적으로 다른 사용자
    isProfilePublic: true, // 기본값
    chatRoomId: user.chatRoomId,
    dmRequestPending: user.dmRequestPending,
    temperature: user.temperature,
    temperatureLevel: 'warm' as const, // 기본값, 실제로는 온도에 따라 계산 필요
    badges: [], // UserType에서는 mainBadge만 있음
    abandonBadge: user.abandonBadge || { isGranted: false, count: 0 },
    mainPosition: user.mainPosition,
    subPositions: [],
    traits: [],
    activeHours: { start: '', end: '' },
    portfolio: [],
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
  };
};

const User = ({ user }: UserProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  // UserType을 CompleteProfileInfo로 변환
  const profileInfo = useMemo(() => {
    return convertUserToProfileInfo(user);
  }, [user]);

  // 채팅 요청 훅 사용
  const { handleChatRequest, getChatButtonText, getChatButtonDisabled } =
    useChatRequest(profileInfo);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDmAction = useCallback(() => {
    handleChatRequest();
    setIsDropdownOpen(false);
  }, [handleChatRequest]);

  // 현재 사용자와 같은 사용자인지 확인
  const isCurrentUser = currentUser?.id === user.userId;

  // 프로필 페이지로 이동하는 핸들러
  const handleProfileClick = useCallback(() => {
    if (isCurrentUser) {
      navigate('/profile/my');
    } else {
      navigate(`/profile/user/${user.userId}`);
    }
  }, [isCurrentUser, navigate, user.userId]);

  // DM 상태에 따른 버튼 텍스트와 비활성화 상태
  const dmButtonText = getChatButtonText();
  const isDmButtonDisabled = getChatButtonDisabled();

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
          <img
            className={styles.user__item__left__img}
            src={user.profileImageUrl}
            alt="Avatar"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />
          <div
            className={styles.user__item__left__nickname}
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            {user.nickname}
          </div>
          <div className={styles.user__item__left__badges}>
            {user.mainBadge && (
              <Badge
                className={styles.badge}
                mainBadge={{
                  type: user.mainBadge.type as BadgeType,
                  tier: user.mainBadge.tier as BadgeTier,
                }}
                widthSize="20px"
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
                widthSize="20px"
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
                  <button
                    className={styles.dropdownItem}
                    onClick={isDmButtonDisabled ? undefined : handleDmAction}
                    disabled={isDmButtonDisabled}
                    style={{
                      opacity: isDmButtonDisabled ? 0.5 : 1,
                      cursor: isDmButtonDisabled ? 'not-allowed' : 'pointer',
                    }}
                  >
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
