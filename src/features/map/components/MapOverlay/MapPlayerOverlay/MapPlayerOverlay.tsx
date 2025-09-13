import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import Thermometer from '@/components/Thermometer/Thermometer';
import type BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Badge';
import { useGetPlayerOverlay } from '@/features/map/hooks/useGetOverlay';
import { useAuthStore } from '@/stores/authStore';

import styles from '../MapOverlay.module.scss';

/**
 * 플레이어 오버레이
 */

interface PlayerOverlayProps {
  id: number;
  onOverlayClose: () => void;
}

const MapPlayerOverlay: React.FC<PlayerOverlayProps> = ({ id, onOverlayClose }) => {
  const nav = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const { data: response, isLoading, isError } = useGetPlayerOverlay(id);

  const handleDetailClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    nav(`/profile/user/${id}`);
  };

  // Badge type을 한글로 변환하는 함수
  const getBadgeTypeInKorean = (type: BadgeType): string => {
    switch (type) {
      case BadgeType.COMPLETE:
        return '완주';
      case BadgeType.LEADER_COMPLETE:
        return '리더 완주';
      case BadgeType.LOGIN:
        return '출석';
      default:
        return type;
    }
  };

  const handleBadgeMouseEnter = (
    event: React.MouseEvent,
    type: 'main' | 'abandon',
    badgeData: { type?: BadgeType; tier?: BadgeTier; count?: number; isGranted?: boolean }
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left - rect.width / 2,
      y: rect.top - 45,
    });

    if (type === 'main') {
      const tierText = badgeData.tier ? badgeData.tier.toLowerCase() : '';
      const koreanType = badgeData.type ? getBadgeTypeInKorean(badgeData.type) : '';
      setTooltipContent(`${koreanType} ${tierText.toLocaleUpperCase()} 등급`);
    } else {
      setTooltipContent(`탈주 ${badgeData.count}회`);
    }

    setShowTooltip(true);
  };

  const handleBadgeMouseLeave = () => {
    setShowTooltip(false);
  };

  if (isLoading) {
    return (
      <div className={styles.overlay__container}>
        <div className={styles.overlay__banner}>PLAYER</div>
        <div className={styles.overlay__content}>
          <div className={styles.overlay__info}>
            <div>로딩 중...</div>
          </div>
        </div>
        <div className={styles.overlay__closeBtn} onClick={onOverlayClose}>
          닫기
        </div>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className={styles.overlay__container}>
        <div className={styles.overlay__banner}>PLAYER</div>
        <div className={styles.overlay__content}>
          <div className={styles.overlay__info}>
            <div>데이터를 불러올 수 없습니다.</div>
          </div>
        </div>
        <div className={styles.overlay__closeBtn} onClick={onOverlayClose}>
          닫기
        </div>
      </div>
    );
  }

  const player = response.data;

  return (
    <div className={styles.overlay__container}>
      <div className={styles.overlay__banner}>
        <img src={player.profileImageUrl} alt="PLAYER" />
      </div>
      <div className={styles.overlay__content}>
        <div className={styles.overlay__info}>
          <div className={styles.overlay__info__core}>
            <div className={styles.overlay__info__core__action}>
              <div className={styles.overlay__info__core__category}>플레이어</div>
              <Button
                className={styles.overlay__info__core__detailBtn}
                fontSize="10px"
                width="fit-content"
                height="22px"
                backgroundColor="var(--gray-1)"
                textColor="var(--white-3)"
                fontWeight="var(--font-weight-regular)"
                radius="xxsm"
                padding="4px 10px"
                onClick={handleDetailClick}
              >
                상세보기
              </Button>
            </div>
            <div className={styles.overlay__info__core__header}>
              <div className={styles.overlay__info__core__title}>{player.nickname}</div>
              <div className={styles.overlay__info__core__temperature}>
                <Thermometer temperature={player.temperature} width={15} />
                {player.temperature}℃
              </div>
            </div>
            <div className={styles.overlay__info__core__badges}>
              {player.mainBadge && (
                <div
                  onMouseEnter={e =>
                    handleBadgeMouseEnter(e, 'main', {
                      type: player.mainBadge?.type as BadgeType,
                      tier: player.mainBadge?.tier as BadgeTier,
                    })
                  }
                  onMouseLeave={handleBadgeMouseLeave}
                  style={{ display: 'inline-block' }}
                >
                  <Badge
                    className={styles.badge}
                    mainBadge={{
                      type: player.mainBadge.type as BadgeType,
                      tier: player.mainBadge.tier as BadgeTier,
                    }}
                    widthSize="20px"
                  />
                </div>
              )}
              {player.abandonBadge && (
                <div
                  onMouseEnter={e =>
                    handleBadgeMouseEnter(e, 'abandon', {
                      count: player.abandonBadge?.count,
                      isGranted: player.abandonBadge?.isGranted,
                    })
                  }
                  onMouseLeave={handleBadgeMouseLeave}
                  style={{ display: 'inline-block' }}
                >
                  <Badge
                    className={styles.badge}
                    abandonBadge={
                      player.abandonBadge && {
                        isGranted: player.abandonBadge.isGranted,
                        count: player.abandonBadge.count,
                      }
                    }
                    widthSize="20px"
                  />
                </div>
              )}
            </div>
            <div className={styles.overlay__info__core__address}>{player.address}</div>
          </div>
          <div className={styles.overlay__info__details}>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>대표 포지션</div>
              <div className={styles.overlay__info__details__item__value}>
                {player.mainPosition || '없음'}
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>주 활동 지역</div>
              <div className={styles.overlay__info__details__item__value}>
                {player.address || '지역 정보 없음'}
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>진행 중 프로젝트</div>
              <div className={styles.overlay__info__details__item__value}>
                {player.latestProject?.title || '없음'}
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>진행 중 스터디</div>
              <div className={styles.overlay__info__details__item__value}>
                {player.latestStudy?.title || '없음'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.overlay__closeBtn} onClick={onOverlayClose}>
        닫기
      </div>

      {/* 툴팁 */}
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%) translateY(-100%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default MapPlayerOverlay;
