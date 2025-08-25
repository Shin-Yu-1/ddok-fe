import styles from './MapOverlay.module.scss';

interface OverlayProps {
  onOverlayClose: () => void;
  overlayType: string;

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
        {overlayType === 'project' && (
          <div className={styles.overlay__info}>
            <div className={styles.overlay__info__core}>
              <div className={styles.overlay__info__core__category}>프로젝트</div>
              <div className={styles.overlay__info__core__header}>
                <div className={styles.overlay__info__core__title}>딥 다이렉트 프로젝트</div>
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
        {overlayType === 'study' && (
          <div className={styles.overlay__info}>
            <div className={styles.overlay__info__core}>
              <div className={styles.overlay__info__core__category}>스터디</div>
              <div className={styles.overlay__info__core__header}>
                <div className={styles.overlay__info__core__title}>딥 다이렉트 스터디</div>
                <div className={styles.overlay__info__core__detailBtn}>상세보기</div>
              </div>
              <div className={styles.overlay__info__core__address}>서울 마포구</div>
            </div>
            <div className={styles.overlay__info__details}>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>스터디 유형</div>
                <div className={styles.overlay__info__details__item__value}>취업/면접</div>
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

        {/* 플레이어 오버레이 */}
        {overlayType === 'player' && (
          <div className={styles.overlay__info}>
            <div className={styles.overlay__info__core}>
              <div className={styles.overlay__info__core__category}>플레이어</div>
              <div className={styles.overlay__info__core__header}>
                <div className={styles.overlay__info__core__title}>똑똑한 플레이어</div>
                <div className={styles.overlay__info__core__detailBtn}>상세보기</div>
              </div>
              {/* TODO: 배지 표시 */}
              <div className={styles.overlay__info__core__address}>서울 마포구</div>
            </div>
            <div className={styles.overlay__info__details}>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>대표 포지션</div>
                <div className={styles.overlay__info__details__item__value}>풀스택</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>주 활동 지역</div>
                <div className={styles.overlay__info__details__item__value}>서울 마포구</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>진행 중 프로젝트</div>
                <div className={styles.overlay__info__details__item__value}>
                  딥 다이렉트 프로젝트
                </div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>진행 중 스터디</div>
                <div className={styles.overlay__info__details__item__value}>딥 다이렉트 스터디</div>
              </div>
            </div>
          </div>
        )}

        {/* 추천 장소 오버레이 */}
        {overlayType === 'cafe' && (
          <div className={styles.overlay__info}>
            <div className={styles.overlay__info__core}>
              <div className={styles.overlay__info__core__category}>추천 장소</div>
              <div className={styles.overlay__info__core__header}>
                <div className={styles.overlay__info__core__title}>분위기 좋은 카페</div>
                <div className={styles.overlay__info__core__detailBtn}>상세보기</div>
              </div>
              <div className={styles.overlay__info__core__address}>서울 마포구</div>
            </div>
            <div className={styles.overlay__info__details}>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>평점</div>
                <div className={styles.overlay__info__details__item__value}>3.8</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>별점</div>
                <div className={styles.overlay__info__details__item__value}>4개</div>
              </div>
              <div className={styles.overlay__info__details__item}>
                <div className={styles.overlay__info__details__item__label}>후기 수</div>
                <div className={styles.overlay__info__details__item__value}>193</div>
              </div>
            </div>
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
