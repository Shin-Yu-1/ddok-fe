import Button from '@/components/Button/Button';

import styles from '../MapOverlay.module.scss';

/**
 * 추천 장소 오버레이
 */

interface CafeOverlayProps {
  category: string;
  cafeId: number;
  title: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  address: string;

  onOverlayClose: () => void;
}

const MapCafeOverlay: React.FC<CafeOverlayProps> = ({
  //   category,
  //   cafeId,
  title,
  //   bannerImageUrl,
  rating,
  reviewCount,
  address,
  onOverlayClose,
}) => {
  return (
    <div className={styles.overlay__container}>
      <div className={styles.overlay__banner}>BANNER</div>
      <div className={styles.overlay__content}>
        <div className={styles.overlay__info}>
          <div className={styles.overlay__info__core}>
            <div className={styles.overlay__info__core__category}>추천 장소</div>
            <div className={styles.overlay__info__core__header}>
              <div className={styles.overlay__info__core__title}>{title}</div>
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
            <div className={styles.overlay__info__core__address}>{address}</div>
          </div>
          <div className={styles.overlay__info__details}>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>평점</div>
              <div className={styles.overlay__info__details__item__value}>{rating}</div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>별점</div>
              <div className={styles.overlay__info__details__item__value}>{reviewCount}</div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>후기 수</div>
              <div className={styles.overlay__info__details__item__value}>{reviewCount}개</div>
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

export default MapCafeOverlay;
