import { CalendarIcon, MapPinIcon, ClockIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import type { UserCardItem } from '@/types/main';

import styles from './UserCard.module.scss';

interface UserCardProps {
  item: UserCardItem;
}

export default function UserCard({ item }: UserCardProps) {
  const { id, type, title, teamStatus, mode, address, period } = item;

  // 링크 경로 결정
  const linkPath = type === 'study' ? `/detail/study/${id}` : `/detail/project/${id}`;

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY.MM.DD');
  };

  // 종료 여부 확인
  const isEnded = teamStatus === 'CLOSED' && period.end;

  return (
    <Link to={linkPath} className={styles.cardLink}>
      <div className={styles.card}>
        {/* 헤더 섹션 */}
        <div className={styles.header}>
          <span className={`${styles.statusBadge} ${styles[teamStatus.toLowerCase()]}`}>
            {teamStatus === 'ONGOING'
              ? type === 'study'
                ? '스터디 참여중'
                : '프로젝트 참여중'
              : type === 'study'
                ? '스터디 종료'
                : '프로젝트 종료'}
          </span>
        </div>

        {/* 제목 */}
        <h3 className={styles.title}>{title}</h3>

        {/* 정보 섹션 */}
        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <MapPinIcon size={14} weight="fill" className={styles.icon} />
            <span className={styles.infoText}>{mode === 'online' ? '온라인' : address}</span>
          </div>

          <div className={styles.infoItem}>
            <CalendarIcon size={14} weight="fill" className={styles.icon} />
            <span className={styles.infoText}>{formatDate(period.start)} 시작</span>
          </div>

          {/* 종료된 경우에만 종료일 표시 */}
          {isEnded && (
            <div className={styles.infoItem}>
              <CalendarIcon size={14} weight="fill" className={styles.icon} />
              <span className={styles.infoText}>{formatDate(period.end)} 종료</span>
            </div>
          )}

          {/* 진행중인 경우 진행 중 표시 */}
          {teamStatus === 'ONGOING' && (
            <div className={styles.infoItem}>
              <ClockIcon size={14} weight="fill" className={styles.icon} />
              <span className={`${styles.infoText} ${styles.highlight}`}>현재 진행중</span>
            </div>
          )}
        </div>

        {/* 액션 힌트 */}
        <div className={styles.actionHint}>
          <span>자세히 보기</span>
          <div className={styles.arrow}>→</div>
        </div>
      </div>
    </Link>
  );
}
