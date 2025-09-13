import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { useGetProjectOverlay } from '@/features/map/hooks/useGetOverlay';
import { MAP_ITEM_STATUS_LABELS, TeamStatus } from '@/features/map/types/common';
import { useAuthStore } from '@/stores/authStore';

import styles from '../MapOverlay.module.scss';

/**
 * 프로젝트 오버레이
 */

interface ProjectOverlayProps {
  id: number;
  onOverlayClose: () => void;
}

const MapProjectOverlay: React.FC<ProjectOverlayProps> = ({ id, onOverlayClose }) => {
  const nav = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const { data: response, isLoading, isError } = useGetProjectOverlay(id);

  const handleDetailClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    nav(`/detail/project/${id}`);
  };

  if (isLoading) {
    return (
      <div className={styles.overlay__container}>
        <div className={styles.overlay__img}>PROJECT</div>
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
        <div className={styles.overlay__img}>PROJECT</div>
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

  const project = response.data;

  return (
    <div className={styles.overlay__container}>
      {project.teamStatus &&
        (project.teamStatus === TeamStatus.RECRUITING ? (
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
          src={project.bannerImageUrl}
          alt="PROJECT"
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
              <div className={styles.overlay__info__core__category}>프로젝트</div>
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
              <div className={styles.overlay__info__core__title}>{project.title}</div>
            </div>
            <div className={styles.overlay__info__core__address}>{project.address}</div>
          </div>
          <div className={styles.overlay__info__details}>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>모집 포지션</div>
              <div className={styles.overlay__info__details__item__value}>
                {project.positions.join(', ')}
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>모집 인원</div>
              <div className={styles.overlay__info__details__item__value}>{project.capacity}명</div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>예상 기간</div>
              <div className={styles.overlay__info__details__item__value}>
                {project.expectedMonth}개월
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>시작 예정일</div>
              <div className={styles.overlay__info__details__item__value}>
                {project.startDate.replace(/-/g, '.')}
              </div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>희망 나이대</div>
              <div className={styles.overlay__info__details__item__value}>
                {!project.preferredAges ||
                (project.preferredAges.ageMin === 0 && project.preferredAges.ageMax === 0)
                  ? '무관'
                  : project.preferredAges.ageMin === project.preferredAges.ageMax - 10
                    ? `${project.preferredAges.ageMin}대`
                    : `${project.preferredAges.ageMin}-${project.preferredAges.ageMax - 10}대`}
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

export default MapProjectOverlay;
