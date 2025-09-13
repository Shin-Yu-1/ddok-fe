import { CaretRightIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import MainCard from '@/features/main/components/MainCard/MainCard';
import UserCard from '@/features/main/components/UserCard/UserCard';
import type { CardItem, UserCardItem } from '@/types/main';

import styles from './MainSection.module.scss';

interface MainSectionProps {
  title: string;
  subtitle?: string;
  items: CardItem[] | UserCardItem[];
  viewAllLink?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  isUserSection?: boolean; // 사용자 섹션인지 구분하는 prop
}

export default function MainSection({
  title,
  subtitle,
  items,
  viewAllLink,
  isLoading = false,
  emptyMessage = '등록된 항목이 없습니다.',
  isUserSection = false,
}: MainSectionProps) {
  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingGrid}>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonBanner} />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonTags}>
                    <div className={styles.skeletonTag} />
                    <div className={styles.skeletonTag} />
                  </div>
                  <div className={styles.skeletonInfo}>
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className={styles.skeletonInfoLine} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {viewAllLink && items.length > 0 && (
          <Link to={viewAllLink} className={styles.viewAllLink}>
            <span>전체보기</span>
            <CaretRightIcon size={16} weight="bold" />
          </Link>
        )}
      </div>

      <div className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyMessage}>{emptyMessage}</p>
          </div>
        ) : (
          <div className={`${styles.cardGrid} ${isUserSection ? styles.userCardGrid : ''}`}>
            {items.map(item => {
              if (isUserSection) {
                // 사용자 섹션에서는 UserCard 사용
                return (
                  <UserCard key={`user-${item.type}-${item.id}`} item={item as UserCardItem} />
                );
              } else {
                // 일반 섹션에서는 MainCard 사용
                return <MainCard key={`${item.type}-${item.id}`} item={item as CardItem} />;
              }
            })}
          </div>
        )}
      </div>
    </section>
  );
}
