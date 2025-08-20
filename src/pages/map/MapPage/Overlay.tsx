import styles from './Overlay.module.scss';
import { OverlayType } from './OverlayType';

interface OverlayProps {
  onOverlayClose: () => void;
  overlayType: OverlayType;
}

const Overlay: React.FC<OverlayProps> = ({ onOverlayClose, overlayType }) => {
  return (
    <div className={styles.overlay__container}>
      <div className={styles.overlay__banner}>OverlayBanner</div>
      <div className={styles.overlay__content}>
        {overlayType === OverlayType.project && (
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
        {overlayType === OverlayType.study && (
          <div className={styles.overlay__info}>
            <div>스터디</div>
            <div>제목</div>
          </div>
        )}
        {overlayType === OverlayType.player && (
          <div className={styles.overlay__info}>
            <div>플레이어</div>
            <div>제목</div>
          </div>
        )}
      </div>

      <div className={styles.overlay__closeBtn} onClick={onOverlayClose}>
        개발용 닫기 버튼
      </div>
    </div>
  );
};

export default Overlay;
