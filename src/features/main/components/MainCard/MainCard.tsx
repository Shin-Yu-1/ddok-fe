import { Link } from 'react-router-dom';

import type { CardItem } from '@/types/main';

import styles from './MainCard.module.scss';

interface MainCardProps {
  item: CardItem;
}

export default function MainCard({ item }: MainCardProps) {
  const {
    id,
    type,
    title,
    teamStatus,
    bannerImageUrl,
    capacity,
    mode,
    address,
    preferredAges,
    expectedMonth,
    startDate,
    studyType,
    positions,
  } = item;

  // 팀 상태에 따른 배지 스타일과 텍스트
  const getStatusBadge = () => {
    switch (teamStatus) {
      case 'RECRUITING':
        return { className: styles.recruiting, text: '모집중' };
      case 'ONGOING':
        return { className: styles.ongoing, text: '진행중' };
      case 'CLOSED':
        return { className: styles.closed, text: '모집마감' };
      default:
        return { className: styles.recruiting, text: '모집중' };
    }
  };

  const statusBadge = getStatusBadge();

  // 링크 경로 결정
  const linkPath = type === 'study' ? `/detail/study/${id}` : `/detail/project/${id}`;

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Link to={linkPath} className={styles.cardLink}>
      <div className={styles.card}>
        {/* 배너 이미지 */}
        <div className={styles.bannerContainer}>
          <img src={bannerImageUrl} alt={title} className={styles.bannerImage} />
          <div className={styles.statusBadgeContainer}>
            <span className={`${styles.statusBadge} ${statusBadge.className}`}>
              {statusBadge.text}
            </span>
          </div>
        </div>

        {/* 카드 내용 */}
        <div className={styles.cardContent}>
          {/* 제목 */}
          <h3 className={styles.title}>{title}</h3>

          {/* 태그들 */}
          <div className={styles.tags}>
            {/* 타입별 태그 */}
            {type === 'study' && studyType && <span className={styles.tag}>{studyType}</span>}
            {type === 'project' && positions && (
              <span className={styles.tag}>
                {positions.slice(0, 2).join(', ')}
                {positions.length > 2 && ` 외 ${positions.length - 2}개`}
              </span>
            )}

            {/* 모드 태그 */}
            <span className={`${styles.tag} ${styles.modeTag}`}>
              {mode === 'online' ? '온라인' : '오프라인'}
            </span>
          </div>

          {/* 정보 라인들 */}
          <div className={styles.infoLines}>
            {/* 위치 */}
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>위치</span>
              <span className={styles.infoValue}>{mode === 'online' ? '온라인' : address}</span>
            </div>

            {/* 인원 */}
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>모집 인원</span>
              <span className={styles.infoValue}>{capacity}명</span>
            </div>

            {/* 나이대 */}
            {preferredAges && (
              <div className={styles.infoLine}>
                <span className={styles.infoLabel}>희망 나이대</span>
                <span className={styles.infoValue}>
                  {preferredAges.ageMin}~{preferredAges.ageMax}대
                </span>
              </div>
            )}

            {/* 예상 기간 */}
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>예상 기간</span>
              <span className={styles.infoValue}>{expectedMonth}개월</span>
            </div>

            {/* 시작일 */}
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>시작 예정일</span>
              <span className={styles.infoValue}>{formatDate(startDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
