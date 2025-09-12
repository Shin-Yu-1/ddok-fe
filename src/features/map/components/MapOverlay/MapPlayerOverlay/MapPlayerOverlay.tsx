import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import Thermometer from '@/components/Thermometer/Thermometer';
import type BadgeTier from '@/constants/enums/BadgeTier.enum';
import type BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Badge';
import { useGetPlayerOverlay } from '@/features/map/hooks/useGetOverlay';

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

  const { data: response, isLoading, isError } = useGetPlayerOverlay(id);

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
                onClick={() => {
                  nav(`/profile/user/${id}`);
                }}
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
                <Badge
                  className={styles.badge}
                  mainBadge={{
                    type: player.mainBadge.type as BadgeType,
                    tier: player.mainBadge.tier as BadgeTier,
                  }}
                  widthSize="20px"
                />
              )}
              {player.abandonBadge && (
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
    </div>
  );
};

export default MapPlayerOverlay;
