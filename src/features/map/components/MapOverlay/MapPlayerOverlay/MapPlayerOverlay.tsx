import Button from '@/components/Button/Button';
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
          개발용 닫기 버튼
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
          개발용 닫기 버튼
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
            <div className={styles.overlay__info__core__category}>플레이어</div>
            <div className={styles.overlay__info__core__header}>
              <div className={styles.overlay__info__core__title}>{player.nickname}</div>
              <Button
                className={styles.overlay__info__core__detailBtn}
                fontSize="9px"
                width="fit-content"
                height="18px"
                backgroundColor="var(--gray-1)"
                textColor="var(--white-3)"
                fontWeight="var(--font-weight-regular)"
                radius="xxsm"
                padding="4px 10px"
              >
                상세보기
              </Button>
            </div>
            {/* TODO: 배지 표시 */}
            <div className={styles.overlay__info__core__address}>서울 마포구</div>
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

      {/* 개발 편의를 위한 닫기 버튼(임시) */}
      <div className={styles.overlay__closeBtn} onClick={onOverlayClose}>
        개발용 닫기 버튼
      </div>
    </div>
  );
};

export default MapPlayerOverlay;
