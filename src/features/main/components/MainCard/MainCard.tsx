import dayjs from 'dayjs';
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
  // const getStatusBadge = () => {
  //   switch (teamStatus) {
  //     case 'RECRUITING':
  //       return {
  //         className: styles.recruiting,
  //         text: type === 'study' ? '스터디 모집중' : '프로젝트 모집중',
  //       };
  //     case 'ONGOING':
  //       return {
  //         className: styles.ongoing,
  //         text: type === 'study' ? '스터디 진행중' : '프로젝트 진행중',
  //       };
  //     case 'CLOSED':
  //       return {
  //         className: styles.closed,
  //         text: type === 'study' ? '스터디 종료' : '프로젝트 종료',
  //       };
  //     default:
  //       return {
  //         className: styles.recruiting,
  //         text: type === 'study' ? '스터디 모집중' : '프로젝트 모집중',
  //       };
  //   }
  // };

  // const statusBadge = getStatusBadge();

  // 링크 경로 결정
  const linkPath = type === 'study' ? `/detail/study/${id}` : `/detail/project/${id}`;

  // 날짜 포맷팅 - YYYY.M.D 형식
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY.MM.DD');
  };

  // 예상 종료일 계산
  const getEstimatedEndDate = () => {
    if (!expectedMonth) return null;
    const start = dayjs(startDate);
    return start.add(expectedMonth, 'month');
  };

  // 진행률 계산
  const getProgress = () => {
    if (!expectedMonth || teamStatus === 'RECRUITING') return null;

    const start = dayjs(startDate);
    const estimatedEnd = start.add(expectedMonth, 'month');
    const now = dayjs();

    const totalDays = estimatedEnd.diff(start, 'day');
    const elapsedDays = now.diff(start, 'day');

    if (elapsedDays < 0) return 0;
    if (elapsedDays > totalDays) return 100;

    return Math.round((elapsedDays / totalDays) * 100);
  };

  // 남은 기간 계산 - 정확한 일수 계산
  const getRemainingInfo = () => {
    if (!expectedMonth || teamStatus === 'RECRUITING') return null;

    const start = dayjs(startDate).startOf('day'); // 시작일의 00:00:00으로 설정
    const estimatedEnd = start.add(expectedMonth, 'month');
    const now = dayjs().startOf('day'); // 오늘의 00:00:00으로 설정

    // 시작 전인지 확인
    const daysUntilStart = start.diff(now, 'day');
    if (daysUntilStart > 0) {
      if (daysUntilStart === 1) return '내일 시작';
      return `${daysUntilStart}일 후 시작`;
    }

    // 종료까지 남은 일수 계산
    const remainingDays = estimatedEnd.diff(now, 'day');

    if (remainingDays < 0) return '예상 기간 초과';
    if (remainingDays === 0) return '오늘 예상 종료';
    if (remainingDays === 1) return '내일 종료 예정';
    if (remainingDays <= 30) return `${remainingDays}일 남음`;

    // 30일 초과시에만 월 단위로 표시
    const remainingMonths = Math.round(remainingDays / 30.44);
    return `약 ${remainingMonths}개월 남음`;
  };

  // 희망 나이대 표시 텍스트 생성
  const getPreferredAgesText = () => {
    if (!preferredAges) {
      return '연령 무관';
    }

    const { ageMin, ageMax } = preferredAges;

    const minDecade = Math.floor(ageMin / 10) * 10;
    const maxDecade = Math.floor((ageMax - 1) / 10) * 10;

    if (minDecade === maxDecade) {
      return `${minDecade}대`;
    }

    return `${minDecade}~${maxDecade}대`;
  };

  const progress = getProgress();
  const remainingInfo = getRemainingInfo();
  const estimatedEndDate = getEstimatedEndDate();

  return (
    <Link to={linkPath} className={styles.cardLink}>
      <div className={styles.card}>
        {/* 배너 이미지 */}
        {bannerImageUrl && (
          <div className={styles.bannerContainer}>
            <img src={bannerImageUrl} alt={title} className={styles.bannerImage} />
            <div className={styles.statusBadgeContainer}>
              {/* <span className={`${styles.statusBadge} ${statusBadge.className}`}>
                {statusBadge.text}
              </span> */}
            </div>
          </div>
        )}

        {/* 카드 내용 */}
        <div className={`${styles.cardContent} ${!bannerImageUrl ? styles.noBanner : ''}`}>
          {/* 배너가 없을 때 헤더 */}
          {!bannerImageUrl && (
            <div className={styles.headerWithBadge}>
              <h3 className={styles.title}>{title}</h3>
              {/* <span className={`${styles.statusBadge} ${statusBadge.className}`}>
              {statusBadge.text}
              </span> */}
            </div>
          )}

          {/* 배너가 있을 때 제목 */}
          {bannerImageUrl && <h3 className={styles.title}>{title}</h3>}

          {/* 진행률 바 */}
          {progress !== null && teamStatus === 'ONGOING' && (
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.progressInfo}>
                <span className={styles.progressText}>{progress}% 진행</span>
                {remainingInfo && <span className={styles.remainingText}>{remainingInfo}</span>}
              </div>
            </div>
          )}

          {/* 태그들 */}
          <div className={styles.tags}>
            {type === 'study' && studyType && <span className={styles.tag}>{studyType}</span>}
            {type === 'project' && positions && (
              <span className={styles.tag}>
                {positions.slice(0, 2).join(', ')}
                {positions.length > 2 && ` 외 ${positions.length - 2}개`}
              </span>
            )}
            <span className={`${styles.tag} ${styles.modeTag}`}>
              {mode === 'online' ? '온라인' : '오프라인'}
            </span>
          </div>

          {/* 정보 라인들 */}
          <div className={styles.infoLines}>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>위치</span>
              <span className={styles.infoValue}>{mode === 'online' ? '온라인' : address}</span>
            </div>

            {capacity && (
              <div className={styles.infoLine}>
                <span className={styles.infoLabel}>모집 인원</span>
                <span className={styles.infoValue}>{capacity}명</span>
              </div>
            )}

            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>희망 나이대</span>
              <span className={styles.infoValue}>{getPreferredAgesText()}</span>
            </div>

            {expectedMonth && (
              <div className={styles.infoLine}>
                <span className={styles.infoLabel}>예상 기간</span>
                <span className={styles.infoValue}>{expectedMonth}개월</span>
              </div>
            )}

            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>시작 예정일</span>
              <span className={styles.infoValue}>{formatDate(startDate)}</span>
            </div>

            {estimatedEndDate && (
              <div className={styles.infoLine}>
                <span className={styles.infoLabel}>종료 예정일</span>
                <span className={styles.infoValue}>
                  {formatDate(estimatedEndDate.toISOString())}
                </span>
              </div>
            )}
          </div>

          {/* 액션 힌트 */}
          <div className={styles.actionHint}>
            <span>자세히 보기</span>
            <div className={styles.arrow}>→</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
