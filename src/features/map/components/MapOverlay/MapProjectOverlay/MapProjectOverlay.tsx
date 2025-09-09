import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { useGetProjectOverlay } from '@/features/map/hooks/useGetOverlay';

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

  const { data: response, isLoading, isError } = useGetProjectOverlay(id);

  if (isLoading) {
    return (
      <div className={styles.overlay__container}>
        <div className={styles.overlay__banner}>PROJECT</div>
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
        <div className={styles.overlay__banner}>PROJECT</div>
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
      <div className={styles.overlay__banner}>
        <img src={project.bannerImageUrl} alt="PROJECT" />
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
                onClick={() => {
                  nav(`/detail/project/${id}`);
                }}
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
              <div className={styles.overlay__info__details__item__value}>{project.startDate}</div>
            </div>
            <div className={styles.overlay__info__details__item}>
              <div className={styles.overlay__info__details__item__label}>희망 나이대</div>
              {project.preferredAges.ageMin === 0 && project.preferredAges.ageMax === 0 ? (
                <div className={styles.overlay__info__details__item__value}>무관</div>
              ) : (
                <div className={styles.overlay__info__details__item__value}>
                  {project.preferredAges.ageMin}-{project.preferredAges.ageMax}대
                </div>
              )}
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
