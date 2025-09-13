import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { useGetStudyOverlay } from '@/features/map/hooks/useGetOverlay';
import { MAP_ITEM_STATUS_LABELS, TeamStatus } from '@/features/map/types/common';
import { useAuthStore } from '@/stores/authStore';

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
  const { isLoggedIn } = useAuthStore();

  const { data: response, isLoading, isError } = useGetStudyOverlay(id);

  const handleDetailClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    nav(`/detail/study/${id}`);
  };

  if (isLoading) {
    return (
      <div className={styles.overlay__container}>
        <div className={styles.overlay__img}>STUDY</div>
        <div className={styles.overlay__content}>
          <div className={styles.overlay__info}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '175px',
                fontSize: '14px',
                color: '#666',
              }}
            >
              로딩 중...
            </div>
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
        <div className={styles.overlay__img}>STUDY</div>
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

  const study = response.data;

  return (
    <div className={styles.overlay__container}>
      {study.teamStatus &&
        (study.teamStatus === TeamStatus.RECRUITING ? (
          <div className={`${styles.teamStatus} ${styles.teamStatus__recruiting}`}>
            {MAP_ITEM_STATUS_LABELS.RECRUITING}
          </div>
        ) : (
          <div className={`${styles.teamStatus} ${styles.teamStatus__ongoing}`}>
            {MAP_ITEM_STATUS_LABELS.ONGOING}
          </div>
        ))}
      <div className={styles.overlay__img}>
        <img
          src={study.bannerImageUrl}
          alt="STUDY"
          style={{
            width: '100%',
            height: '125px',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
      <div className={styles.overlay__content}>
        <div className={styles.overlay__info}>
          <div className={styles.overlay__info__core}>
            <div className={styles.overlay__info__core__action}>
              <div className={styles.overlay__info__core__category}>스터디</div>
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
              <div className={styles.overlay__info__details__item__value}>
                {study.startDate.replace(/-/g, '.')}
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>희망 나이대</div>
              <div className={styles.overlay__info__details__item__value}>
                {!study.preferredAges ||
                (study.preferredAges.ageMin === 0 && study.preferredAges.ageMax === 0)
                  ? '무관'
                  : study.preferredAges.ageMin === study.preferredAges.ageMax - 10
                    ? `${study.preferredAges.ageMin}대`
                    : `${study.preferredAges.ageMin}-${study.preferredAges.ageMax - 10}대`}
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

export default MapStudyOverlay;
