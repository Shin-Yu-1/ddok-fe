import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DotsThreeVerticalIcon, PaperPlaneTiltIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import OverflowMenu from '@/components/OverflowMenu/OverflowMenu';
import Thermometer from '@/components/Thermometer/Thermometer';
import Badge from '@/features/Badge/Badge';
// import { usePostApi } from '@/hooks/usePostApi';
import type { Player } from '@/schemas/player.schema';

import styles from './PlayerCard.module.scss';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* TODO: API 연동 시 주석 해제 */
  // const postDmRequest = usePostApi<void, void>({
  //   url: `/api/players/${player.userId}/dm-requests`,
  // });

  const sendDmRequest = () => {
    /* TODO: API 연동 시 제거 */
    console.log(player.nickname + ' 1:1 채팅 요청');
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
  };

  const menuItems = useMemo(() => {
    const items = [
      {
        icon: <PaperPlaneTiltIcon />,
        name: '채팅 보내기',
        onClick: sendDmRequest,
      },
    ];

    return items;
  }, []);

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
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.playerCard}>
      <div className={styles.playerTemperatureWrapper}>
        <Thermometer temperature={player.temperature} />
        <span className={styles.temperature}>{player.temperature}℃</span>
        <Button
          size="sm"
          textColor={'var(--gray-1)'}
          backgroundColor="none"
          padding="0%"
          onClick={openMenu}
        >
          <DotsThreeVerticalIcon className={styles.buttonIcon} />
        </Button>

        {isMenuOpen && (
          <div className={styles.overflowMenuContainer}>
            <OverflowMenu ref={menuRef} menuItems={menuItems} />
          </div>
        )}
      </div>
      <div className={styles.profileImage}>
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
          {player.mainBadge.map(badge => (
            <Badge key={`${badge.type}${badge.tier}`} heightSize={16} mainBadge={badge} />
          ))}
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
