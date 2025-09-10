import { CaretRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import MainCard from '@/features/main/components/MainCard/MainCard';
import type { CardItem } from '@/types/main';

import styles from './MainSection.module.scss';

interface MainSectionProps {
  title: string;
  subtitle?: string;
  items: CardItem[];
  viewAllLink?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function MainSection({
  title,
  subtitle,
  items,
  viewAllLink,
  isLoading = false,
  emptyMessage = '등록된 항목이 없습니다.',
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
            <CaretRight size={16} weight="bold" />
          </Link>
        )}
      </div>

      <div className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyMessage}>{emptyMessage}</p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {items.map(item => (
              <MainCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
