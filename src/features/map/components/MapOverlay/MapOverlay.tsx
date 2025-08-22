import { MapOverlayType } from '../../constants/MapOverlayType';

import styles from './MapOverlay.module.scss';

interface OverlayProps {
  onOverlayClose: () => void;
  overlayType: MapOverlayType;

  //   category: string;
  //   title: string;
  //   address: string;

  //   projectId?: number;
  //   studyId?: number;
  //   cafeId?: number;
  //   userId?: number;

  //   bannerImageUrl?: string;
  //   profileImageUrl?: string;
  //   teamStatus?: string;
  //   studyType?: string;
  //   positions?: string[];
  //   capacity?: number;
  //   mode?: string;
  //   rating?: number;
  //   reviewCount?: number;
  //   nickname?: string;
  //   mainBadge?: { type: string; tier: string };
  //   abandonBadge?: { isGranted: boolean; count: number };
  //   mainPosition?: string;
  //   latestProject?: {
  //     id: number;
  //     title: string;
  //     teamStatus: string;
  //   };
  //   latestStudy?: {
  //     id: number;
  //     title: string;
  //     teamStatus: string;
  //   };
  //   temperature?: number;
  //   isMine?: boolean;

  //   preferredAges?: { ageMin: number; ageMax: number };
  //   expectedMonth?: number;
  //   startDate?: string;
}

const MapOverlay: React.FC<OverlayProps> = ({ onOverlayClose, overlayType }) => {
  return (
    <div className={styles.overlay__container}>
      <div className={styles.overlay__banner}>BANNER</div>
      <div className={styles.overlay__content}>
        {/* 프로젝트 오버레이 */}
        {overlayType === MapOverlayType.PROJECT && (
          <div className={styles.overlay__info}>
            <div className={styles.overlay__info__core}>
              <div className={styles.overlay__info__core__category}>프로젝트</div>
              <div className={styles.overlay__info__core__header}>
                <div className={styles.overlay__info__core__title}>딥 다이렉트 2</div>
                <div className={styles.overlay__info__core__detailBtn}>상세보기</div>
              </div>
              <div className={styles.overlay__info__core__address}>서울 마포구</div>
            </div>
            <div className={styles.overlay__info__details}>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>모집 포지션</div>
                <div className={styles.overlay__info__details__item__value}>프론트엔드...</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>모집 인원</div>
                <div className={styles.overlay__info__details__item__value}>4명</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>예상 기간</div>
                <div className={styles.overlay__info__details__item__value}>3개월</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>시작 예정일</div>
                <div className={styles.overlay__info__details__item__value}>25.09.15</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>희망 나이대</div>
                <div className={styles.overlay__info__details__item__value}>20~40대</div>
              </div>
            </div>
          </div>
        )}

        {/* 스터디 오버레이 */}
        {overlayType === MapOverlayType.STUDY && (
          <div className={styles.overlay__info}>
            <div>스터디</div>
            <div>제목</div>
          </div>
        )}

        {/* 플레이어 오버레이 */}
        {overlayType === MapOverlayType.PLAYER && (
          <div className={styles.overlay__info}>
            <div>플레이어</div>
            <div>이름</div>
          </div>
        )}

        {/* 추천 장소 오버레이 */}
        {overlayType === MapOverlayType.CAFE && (
          <div className={styles.overlay__info}>
            <div>추천 장소</div>
            <div>이름</div>
          </div>
        )}
      </div>

      {/* 개발 편의를 위한 닫기 버튼(임시) */}
      <div className={styles.overlay__closeBtn} onClick={onOverlayClose}>
        개발용 닫기 버튼
      </div>
    </div>
  );
};

export default MapOverlay;
