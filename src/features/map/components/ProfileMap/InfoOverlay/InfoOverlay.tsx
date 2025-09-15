import { useNavigate } from 'react-router-dom';

import type { ProfileMapItem } from '@/features/map/schemas/profileMapSchema';

import styles from './InfoOverlay.module.scss';

interface InfoOverlayProps {
  item: ProfileMapItem;
  onOverlayClose: () => void;
}

const InfoOverlay = ({ item, onOverlayClose }: InfoOverlayProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.title}>{item.title}</div>

      <div className={styles.info}>
        <div className={styles.info__title}>카테고리</div>
        <div className={styles.category}>{item.category === 'project' ? '프로젝트' : '스터디'}</div>
      </div>

      <div className={styles.info}>
        <div className={styles.info__title}>모집 상태</div>
        {item.teamStatus === 'ONGOING' ? (
          <div className={`${styles.status} ${styles.status__ongoing}`}>진행 중</div>
        ) : (
          <div className={`${styles.status} ${styles.status__closed}`}>종료</div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.info__title}>위치</div>
        <div className={styles.address}>
          {item.location.region1depthName} {item.location.region2depthName}
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.info__title}>모집 공고</div>
        <div
          className={styles.detailBtn}
          onClick={() =>
            navigate(
              `/detail/${item.category}/${item.category === 'project' ? item.projectId : item.studyId}`
            )
          }
        >
          상세보기
        </div>
      </div>

      <div className={styles.closeBtn} onClick={onOverlayClose}>
        닫기
      </div>
    </div>
  );
};

export default InfoOverlay;
