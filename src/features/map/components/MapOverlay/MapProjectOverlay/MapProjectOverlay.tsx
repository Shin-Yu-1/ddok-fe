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
          개발용 닫기 버튼
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
          개발용 닫기 버튼
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
            <div className={styles.overlay__info__core__category}>프로젝트</div>
            <div className={styles.overlay__info__core__header}>
              <div className={styles.overlay__info__core__title}>{project.title}</div>
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
              <div className={styles.overlay__info__details__item__value}>
                {project.preferredAges.ageMin}-{project.preferredAges.ageMax}대
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

export default MapProjectOverlay;
