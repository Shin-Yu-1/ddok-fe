import dayjs from 'dayjs';

import 'dayjs/locale/ko';
import banner from '@/assets/images/DDOK/DDOK-banner.png';
import type { projectItem } from '@/schemas/project.schema';
import type { studyItem } from '@/schemas/study.schema';
import type { TeamStatus } from '@/types/project';

import styles from './SearchCard.module.scss';

type PreferredAges = {
  ageMin: number;
  ageMax: number;
};

interface CardProps {
  item: projectItem | studyItem;
}

// 타입 가드
const isProjectItem = (item: projectItem | studyItem): item is projectItem => {
  return 'projectId' in item;
};

// 한글 변환
const getStudyTypeText = (type: studyItem['studyType']) => {
  switch (type) {
    case 'CERTIFICATION':
      return '자격증';
    case 'JOB_INTERVIEW':
      return '취업 면접';
    case 'SELF_DEV':
      return '자기계발';
    case 'LANGUAGE':
      return '어학';
    case 'LIFE':
      return '생활';
    case 'HOBBY':
      return '취미';
    case 'ETC':
      return '기타';
    default:
      return '-';
  }
};

const SearchCard = ({ item }: CardProps) => {
  // 한글 변환
  const getTeamStatusText = (status: TeamStatus) => {
    switch (status) {
      case 'RECRUITING':
        return '모집 중';
      case 'ONGOING':
        return '프로젝트 진행 중';
      case 'CLOSED':
        return '프로젝트 종료';
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
      return `${ageMin}대, ${ageMax}대`;
    }
    if (ageMin) return `${ageMin}대 이상`;
    if (ageMax) return `${ageMax}대 이하`;
    return '-';
  };

  // 시작 예정일 포맷팅
  const formatStartDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY.MM.DD');
  };

  return (
    <div className={styles.cardContainer}>
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
              {isProjectItem(item) ? item.positions.join(', ') : getStudyTypeText(item.studyType)}
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
