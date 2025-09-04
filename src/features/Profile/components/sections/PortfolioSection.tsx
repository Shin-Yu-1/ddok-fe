// 포트폴리오 링크들
// 포트폴리오 링크들

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import styles from './PortfolioSection.module.scss';

interface PortfolioSectionProps extends ProfileSectionProps {
  className?: string;
}

const PortfolioSection = forwardRef<HTMLElement, PortfolioSectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('portfolio');
      }
    };

    if (!user.portfolio || user.portfolio.length === 0) {
      return null;
    }

    return (
      <section
        ref={ref}
        className={clsx(styles.portfolioSection, className)}
        aria-labelledby="portfolio-title"
      >
        <div className={styles.header}>
          <h2 id="portfolio-title" className={styles.title}>
            포트폴리오
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="포트폴리오 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div className={styles.portfolioList}>
          {user.portfolio.map((item, index) => (
            <div key={index} className={styles.portfolioItem}>
              <div className={styles.portfolioInfo}>
                <span className={styles.portfolioTitle}>[{item.linkTitle}]</span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.portfolioLink}
                >
                  {item.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
);

PortfolioSection.displayName = 'PortfolioSection';
export default PortfolioSection;
