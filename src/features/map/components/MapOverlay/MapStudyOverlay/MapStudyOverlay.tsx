import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { useGetStudyOverlay } from '@/features/map/hooks/useGetOverlay';

import styles from '../MapOverlay.module.scss';

/**
 * 스터디 오버레이
 */

interface StudyOverlayProps {
  id: number;
  onOverlayClose: () => void;
}

const MapStudyOverlay: React.FC<StudyOverlayProps> = ({ id, onOverlayClose }) => {
  const nav = useNavigate();

  const { data: response, isLoading, isError } = useGetStudyOverlay(id);

  if (isLoading) {
    return (
      <div className={styles.overlay__container}>
        <div className={styles.overlay__banner}>STUDY</div>
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
        <div className={styles.overlay__banner}>STUDY</div>
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

  const study = response.data;

  return (
    <div className={styles.overlay__container}>
      <div className={styles.overlay__banner}>
        <img src={study.bannerImageUrl} alt="STUDY" />
      </div>
      <div className={styles.overlay__content}>
        <div className={styles.overlay__info}>
          <div className={styles.overlay__info__core}>
            <div className={styles.overlay__info__core__action}>
              <div className={styles.overlay__info__core__category}>스터디</div>
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
                onClick={() => {
                  nav(`/detail/study/${id}`);
                }}
              >
                상세보기
              </Button>
            </div>
            <div className={styles.overlay__info__core__header}>
              <div className={styles.overlay__info__core__title}>{study.title}</div>
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
              {study.preferredAges.ageMin === 0 && study.preferredAges.ageMax === 0 ? (
                <div className={styles.overlay__info__details__item__value}>무관</div>
              ) : (
                <div className={styles.overlay__info__details__item__value}>
                  {study.preferredAges.ageMin}-{study.preferredAges.ageMax}대
                </div>
              )}
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
