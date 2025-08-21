import { MapOverlayType } from '../../constants/MapOverlayType';

import styles from './MapOverlay.module.scss';

interface OverlayProps {
  onOverlayClose: () => void;
  overlayType: MapOverlayType;
}

const Overlay: React.FC<OverlayProps> = ({ onOverlayClose, overlayType }) => {
  return (
    <div className={styles.overlay__container}>
      <div className={styles.overlay__banner}>OverlayBanner</div>
      <div className={styles.overlay__content}>
        {/* 프로젝트 오버레이 */}
        {overlayType === MapOverlayType.PROJECT && (
          <div className={styles.overlay__info}>
            <div>프로젝트</div>
            <div>딥 다이렉트 2</div>
            <div>서울 마포구</div>
            <div>모집 포지션</div>
            <div>모집 인원</div>
            <div>예상 기간</div>
            <div>시작 예정일</div>
            <div>희망 나이대</div>
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

export default Overlay;
