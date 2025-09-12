import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DotsThreeVerticalIcon, PaperPlaneTiltIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import OverflowMenu from '@/components/OverflowMenu/OverflowMenu';
import Thermometer from '@/components/Thermometer/Thermometer';
import Badge from '@/features/Badge/Badge';
// import { usePostApi } from '@/hooks/usePostApi';
import type { Player } from '@/schemas/player.schema';
import { useAuthStore } from '@/stores/authStore';

import styles from './PlayerCard.module.scss';

interface PlayerCardProps {
  isLoading?: boolean;
  player?: Player;
}

const PlayerCard = ({ isLoading, player }: PlayerCardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* TODO: API 연동 시 주석 해제 */
  // const postDmRequest = usePostApi<void, void>({
  //   url: `/api/players/${player.userId}/dm-requests`,
  // });

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const sendDmRequest = useCallback(() => {
    /* TODO: API 연동 시 제거 */
    console.log(player?.nickname + ' 1:1 채팅 요청');
    closeMenu();

    /* TODO: API 연동 시 주석 해제 */
    // postDmRequest.mutate(undefined, {
    //   onSuccess: () => {
    //     alert('DM 요청이 성공적으로 전송되었습니다!');
    //     closeMenu();
    //   },
    //   onError: err => {
    //     console.error(err);
    //     alert('DM 요청 전송 중 오류가 발생했습니다.');
    //   },
    // });
  }, [player?.nickname, closeMenu]);

  const menuItems = useMemo(() => {
    const items = [
      {
        icon: <PaperPlaneTiltIcon />,
        name: '채팅 보내기',
        onClick: sendDmRequest,
      },
    ];

    return items;
  }, [sendDmRequest]);

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

  const profileClickHandle = () => {
    if (isLoggedIn && player) {
      navigate(`/profile/user/${player.userId}`);
    }
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
        className={`${styles.profileImage} ${isLoggedIn ? styles.cursor : ''}`}
        onClick={profileClickHandle}
      >
        <img src={player.profileImageUrl} alt={`${player.nickname} 프로필`} />
      </div>
      <h3
        role="button"
        className={`${styles.nickname} ${isLoggedIn ? styles.cursor : ''}`}
        onClick={profileClickHandle}
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
