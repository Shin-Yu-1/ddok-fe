import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DotsThreeVerticalIcon, PaperPlaneTiltIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import OverflowMenu from '@/components/OverflowMenu/OverflowMenu';
import Thermometer from '@/components/Thermometer/Thermometer';
import Badge from '@/features/Badge/Badge';
import { useChatRequest } from '@/features/Profile/hooks/useChatRequest';
import type { Player } from '@/schemas/player.schema';
import { useAuthStore } from '@/stores/authStore';
import type { CompleteProfileInfo } from '@/types/user';

import styles from './PlayerCard.module.scss';

interface PlayerCardProps {
  isLoading?: boolean;
  player?: Player;
}

// Player를 CompleteProfileInfo로 변환하는 헬퍼 함수
const convertPlayerToProfileInfo = (player: Player): CompleteProfileInfo => {
  return {
    userId: player.userId,
    nickname: player.nickname,
    profileImage: player.profileImageUrl,
    ageGroup: '', // Player에서는 제공하지 않음
    introduction: '', // Player에서는 제공하지 않음
    isMine: player.isMine,
    isProfilePublic: true, // 기본값
    chatRoomId: player.chatRoomId,
    dmRequestPending: player.dmRequestPending,
    temperature: player.temperature,
    temperatureLevel: 'warm' as const, // 기본값, 실제로는 온도에 따라 계산 필요
    badges: [], // Player에서는 mainBadge만 있음
    abandonBadge: player.abandonBadge,
    mainPosition: player.mainPosition,
    subPositions: [],
    traits: [],
    activeHours: { start: '', end: '' },
    portfolio: [],
    location: {
      address: player.address,
      latitude: 0,
      longitude: 0,
    },
  };
};

const PlayerCard = ({ isLoading, player }: PlayerCardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Player를 CompleteProfileInfo로 변환
  const profileInfo = useMemo(() => {
    return player ? convertPlayerToProfileInfo(player) : null;
  }, [player]);

  // 채팅 요청 훅 사용
  const { handleChatRequest, getChatButtonText, getChatButtonDisabled } =
    useChatRequest(profileInfo);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const sendDmRequest = useCallback(() => {
    handleChatRequest();
    closeMenu();
  }, [handleChatRequest, closeMenu]);

  const menuItems = useMemo(() => {
    const isDisabled = getChatButtonDisabled();
    const items = [
      {
        icon: <PaperPlaneTiltIcon />,
        name: getChatButtonText(),
        onClick: isDisabled ? undefined : sendDmRequest, // 비활성화 상태일 때는 클릭 이벤트 자체를 제거
      },
    ];

    return items;
  }, [getChatButtonText, getChatButtonDisabled, sendDmRequest]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  if (isLoading || !player) {
    return (
      <div className={styles.skeletonCard}>
        <div className={styles.skeletonTemperatureWrapper}>
          <div className={styles.skeletonThermometer}></div>
          <div className={styles.skeletonTemperature}></div>
          <div className={styles.skeletonButton}></div>
        </div>
        <div className={styles.skeletonProfileImage}></div>
        <div className={styles.skeletonNickname}></div>
        <div className={styles.skeletonBadgeWrapper}>
          <div className={styles.skeletonBadge}></div>
          <div className={styles.skeletonBadge}></div>
        </div>
        <div className={styles.skeletonPlayerInfo}>
          <div className={styles.skeletonDetails}></div>
          <div className={styles.skeletonDetails}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.playerCard}>
      <div className={`${styles.playerTemperatureWrapper} ${isLoggedIn ? '' : styles.center}`}>
        <Thermometer temperature={player.temperature} />
        <span className={styles.temperature}>{player.temperature}℃</span>
        {isLoggedIn && (
          <Button
            size="sm"
            textColor={'var(--gray-1)'}
            backgroundColor="none"
            padding="0%"
            onClick={openMenu}
          >
            <DotsThreeVerticalIcon className={styles.buttonIcon} />
          </Button>
        )}

        {isMenuOpen && (
          <div className={styles.overflowMenuContainer}>
            <OverflowMenu ref={menuRef} menuItems={menuItems} />
          </div>
        )}
      </div>
      <div
        className={styles.profileImage}
        onClick={() => {
          navigate(`/profile/user/${player.userId}`);
        }}
      >
        <img src={player.profileImageUrl} alt={`${player.nickname} 프로필`} />
      </div>
      <h3
        role="button"
        className={styles.nickname}
        onClick={() => {
          navigate(`/profile/user/${player.userId}`);
        }}
      >
        {player.nickname}
      </h3>
      <div className={styles.line}>
        <div className={styles.badgeWrapper}>
          {player.mainBadge && <Badge heightSize={16} mainBadge={player?.mainBadge} />}
          {player.abandonBadge && <Badge heightSize={16} abandonBadge={player?.abandonBadge} />}
        </div>
      </div>
      <div className={styles.playerInfo}>
        <p className={styles.details}>{player.address}</p>
        <p className={styles.details}>{player.mainPosition}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
