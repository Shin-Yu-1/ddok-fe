import Button from '@/components/Button/Button';
import type { StudyOverlayData } from '@/features/map/types/study';

import styles from '../MapOverlay.module.scss';

/**
 * 스터디 오버레이
 */

interface StudyOverlayProps {
  study: StudyOverlayData;
  onOverlayClose: () => void;
}

const MapStudyOverlay: React.FC<StudyOverlayProps> = ({ study, onOverlayClose }) => {
  return (
    <div className={styles.overlay__container}>
      <div className={styles.overlay__banner}>BANNER</div>
      <div className={styles.overlay__content}>
        <div className={styles.overlay__info}>
          <div className={styles.overlay__info__core}>
            <div className={styles.overlay__info__core__category}>스터디</div>
            <div className={styles.overlay__info__core__header}>
              <div className={styles.overlay__info__core__title}>{study.title}</div>
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
            <div className={styles.overlay__info__core__address}>{study.address}</div>
          </div>
          <div className={styles.overlay__info__details}>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>스터디 유형</div>
              <div className={styles.overlay__info__details__item__value}>{study.studyType}</div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>모집 인원</div>
              <div className={styles.overlay__info__details__item__value}>{study.capacity}명</div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>예상 기간</div>
              <div className={styles.overlay__info__details__item__value}>
                {study.expectedMonth}개월
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>시작 예정일</div>
              <div className={styles.overlay__info__details__item__value}>{study.startDate}</div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>희망 나이대</div>
              <div className={styles.overlay__info__details__item__value}>
                {study.preferredAges.ageMin}-{study.preferredAges.ageMax}대
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

export default MapStudyOverlay;
