import dayjs from 'dayjs';

import 'dayjs/locale/ko';
import banner from '@/assets/images/DDOK/DDOK-banner.png';
import type { ProjectItem } from '@/schemas/project.schema';
import type { StudyItem } from '@/schemas/study.schema';
import type { TeamStatus } from '@/types/project';

import styles from './SearchCard.module.scss';

type PreferredAges = {
  ageMin: number;
  ageMax: number;
};

type SearchCardProps = {
  item: ProjectItem | StudyItem | null;
  isLoading?: boolean;
  clickHandle?: (item: ProjectItem | StudyItem) => void;
};

// 타입 가드
const isProjectItem = (item: ProjectItem | StudyItem): item is ProjectItem => {
  return 'projectId' in item;
};

const SearchCard = ({ item, isLoading, clickHandle }: SearchCardProps) => {
  if (isLoading || !item) {
    return (
      <div className={`${styles.cardContainer} ${styles.skeleton}`}>
        <div className={styles.bannerWrapper}>
          <div className={styles.skeletonBanner}></div>
          <div className={`${styles.statusBadge} ${styles.skeletonBadge}`}></div>
        </div>

        <div className={styles.infoWrapper}>
          <div className={`${styles.title} ${styles.skeletonTitle}`}></div>

          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={`${styles.label} ${styles.skeletonLabel}`}></span>
              <span className={`${styles.value} ${styles.skeletonValue}`}></span>
            </div>

            <div className={styles.infoRow}>
              <span className={`${styles.label} ${styles.skeletonLabel}`}></span>
              <span className={`${styles.value} ${styles.skeletonValueShort}`}></span>
            </div>

            <div className={styles.infoRow}>
              <span className={`${styles.label} ${styles.skeletonLabel}`}></span>
              <span className={`${styles.value} ${styles.skeletonValueShort}`}></span>
            </div>

            <div className={styles.infoRow}>
              <span className={`${styles.label} ${styles.skeletonLabel}`}></span>
              <span className={`${styles.value} ${styles.skeletonValueShort}`}></span>
            </div>

            <div className={styles.infoRow}>
              <span className={`${styles.label} ${styles.skeletonLabel}`}></span>
              <span className={`${styles.value} ${styles.skeletonValueShort}`}></span>
            </div>

            <div className={styles.infoRow}>
              <span className={`${styles.label} ${styles.skeletonLabel}`}></span>
              <span className={`${styles.value} ${styles.skeletonValue}`}></span>
            </div>

            <div className={styles.infoRow}>
              <span className={`${styles.label} ${styles.skeletonLabel}`}></span>
              <span className={`${styles.value} ${styles.skeletonValueShort}`}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 한글 변환
  const getTeamStatusText = (status: TeamStatus) => {
    switch (status) {
      case 'RECRUITING':
        return '모집 중';
      case 'ONGOING':
        return `${isProjectItem(item) ? '프로젝트' : '스터디'} 진행 중`;
      case 'CLOSED':
        return `${isProjectItem(item) ? '프로젝트' : '스터디'} 종료`;
      default:
        return '모집 중';
    }
  };

  const getAddressText = (address: string) => {
    if (address === 'online') {
      return '온라인';
    } else {
      return address;
    }
  };

  // 진행 방식에 따른 한글 변환
  const getModeText = (mode: string) => {
    return mode === 'offline' ? '오프라인' : '온라인';
  };

  // 희망 나이대 포맷팅
  const getAgeRangeText = (preferredAges: PreferredAges) => {
    if (!preferredAges) return '-';

    const { ageMin, ageMax } = preferredAges;

    if (ageMin && ageMax) {
      const result: string[] = [];
      for (let age = ageMin; age < ageMax; age += 10) {
        result.push(`${age}대`);
      }
      return result.join(', ');
    }
    if (ageMin) return `${ageMin}대 이상`;
    if (ageMax) return `${ageMax - 10}대 이하`;
    return '-';
  };

  // 시작 예정일 포맷팅
  const formatStartDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY.MM.DD');
  };

  return (
    <div
      className={styles.cardContainer}
      onClick={() => {
        clickHandle(item);
      }}
    >
      <div className={styles.bannerWrapper}>
        <img src={item.bannerImageUrl || banner} alt={item.title} />
        <div className={`${styles.statusBadge} ${styles[item.teamStatus.toLowerCase()]}`}>
          {getTeamStatusText(item.teamStatus)}
        </div>
      </div>

      <div className={styles.infoWrapper}>
        <h3 className={styles.title}>{item.title}</h3>

        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>
              {isProjectItem(item) ? '모집 포지션' : '스터디 유형'}
            </span>
            <span className={styles.value}>
              {isProjectItem(item) ? item.positions.join(', ') : item.studyType}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>모집 인원</span>
            <span className={styles.value}>{item.capacity}명</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>희망 나이</span>
            <span className={styles.value}>{getAgeRangeText(item.preferredAges)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>진행 방식</span>
            <span className={styles.value}>{getModeText(item.mode)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>예상 기간</span>
            <span className={styles.value}>{item.expectedMonth}개월</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>모집 장소</span>
            <span className={styles.value}>{getAddressText(item.address)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>시작 예정일</span>
            <span className={styles.value}>{formatStartDate(item.startDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
