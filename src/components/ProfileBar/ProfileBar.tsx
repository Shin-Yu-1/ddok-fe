import { useState, useRef, useEffect } from 'react';

import { DotsThreeVerticalIcon, ChatCircleIcon, PaperPlaneTiltIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import OverflowMenu from '@/components/OverflowMenu/OverflowMenu';
import Thermometer from '@/components/Thermometer/Thermometer';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Badge';
import { useAuthStore } from '@/stores/authStore';

import styles from './ProfileBar.module.scss';

interface ProfileBarProps {
  // 해당 사용자의 ID
  userId: number;
  // 닉네임
  nickname?: string;
  // 프로필 이미지 URL
  profileImageUrl?: string;
  // 프로필 이미지 alt 텍스트
  profileImageAlt?: string;
  // 메인 배지 정보
  mainBadge?: { type: BadgeType; tier: BadgeTier };
  // 탈주 배지 정보
  abandonBadge?: { isGranted: boolean; count: number };
  // 메인 포지션 텍스트
  mainPosition?: string;
  // 온도 (0-100)
  temperature: number;
  // DM 요청 상태
  dmRequestPending?: boolean;
  // 사용자 정의 DM 요청 보내기 핸들러
  onSendDmRequest?: (userId: number) => void;
  // 사용자 정의 DM 하기 핸들러
  onSendDm?: (userId: number) => void;
  // 채팅방 ID (DM이 가능한 경우)
  chatRoomId?: number | null;
  // 외부 스타일 클래스
  className?: string;
}

const ProfileBar = ({
  userId,
  nickname,
  profileImageUrl,
  profileImageAlt = '프로필 이미지',
  mainBadge,
  abandonBadge,
  mainPosition,
  temperature,
  dmRequestPending,
  onSendDmRequest,
  onSendDm,
  chatRoomId,
  className,
}: ProfileBarProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  // 기본 DM 요청 핸들러
  const handleDefaultSendDmRequest = () => {
    console.log('DM 요청 보내기:', userId);
    // TODO: 실제 DM 요청 API 호출
  };

  // 기본 DM 하기 핸들러
  const handleDefaultSendDm = () => {
    console.log('DM 하기:', userId);
    if (chatRoomId) {
      navigate(`/chat/${chatRoomId}`);
    } else {
      navigate(`/chat/user/${userId}`);
    }
  };

  // 프로필 클릭 핸들러
  const handleProfileClick = () => {
    if (currentUser && currentUser.id === userId) {
      navigate('/profile/my');
    } else {
      navigate(`/profile/user/${userId}`);
    }
  };

  // 메뉴 버튼 클릭 핸들러
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // 본인 프로필인지 확인
  const isOwnProfile = currentUser && currentUser.id === userId;

  // 메뉴 아이템 구성
  const menuItems = isOwnProfile
    ? []
    : [
        {
          icon: dmRequestPending ? <ChatCircleIcon size={16} /> : <PaperPlaneTiltIcon size={16} />,
          name: dmRequestPending ? 'DM 하기' : 'DM 요청 보내기',
          onClick: () => {
            setShowMenu(false);
            if (dmRequestPending) {
              if (onSendDm) {
                onSendDm(userId);
              } else {
                handleDefaultSendDm();
              }
            } else {
              if (onSendDmRequest) {
                onSendDmRequest(userId);
              } else {
                handleDefaultSendDmRequest();
              }
            }
          },
        },
      ];

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 왼쪽 섹션: 프로필 이미지 + 닉네임 + 뱃지 */}
      <div className={styles.leftSection}>
        <div
          className={styles.profileImageContainer}
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleProfileClick();
            }
          }}
        >
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={profileImageAlt} className={styles.profileImage} />
          ) : (
            <div className={styles.profileImagePlaceholder}>?</div>
          )}
        </div>

        {/* 닉네임 */}
        {nickname && <span className={styles.nickname}>{nickname}</span>}

        {/* 뱃지 */}
        {mainBadge && (
          <div className={styles.badgeContainer}>
            <Badge
              mainBadge={mainBadge}
              abandonBadge={abandonBadge}
              widthSize={10}
              className={styles.badge}
            />
          </div>
        )}
      </div>

      {/* 오른쪽 섹션: 포지션 + 온도 + 메뉴 */}
      <div className={styles.rightSection}>
        {/* 메인 포지션 */}
        <div className={styles.positionContainer}>
          <span className={styles.positionText}>{mainPosition}</span>
        </div>

        {/* 온도 섹션 */}
        <div className={styles.temperatureSection}>
          <Thermometer temperature={temperature} width={16} height={17} animated={true} />
          <span className={styles.temperatureText}>{temperature.toFixed(1)}°C</span>
        </div>

        {/* 미트볼 메뉴 - 본인이 아닐 때만 표시 */}
        {!isOwnProfile && (
          <div className={styles.menuContainer}>
            <button
              ref={menuButtonRef}
              className={styles.menuButton}
              onClick={handleMenuClick}
              aria-label="메뉴 열기"
            >
              <DotsThreeVerticalIcon size={16} />
            </button>

            {showMenu && (
              <div className={styles.menuDropdown}>
                <OverflowMenu ref={menuRef} menuItems={menuItems} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBar;
