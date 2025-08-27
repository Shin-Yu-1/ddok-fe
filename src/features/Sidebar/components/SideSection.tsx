import { forwardRef } from 'react';

import clsx from 'clsx';

import type { SideSectionProps } from '../types/sidebar';

import styles from './SideSection.module.scss';

const SideSection = forwardRef<HTMLDivElement, SideSectionProps>(
  ({ title, isOpen, children, className }, ref) => {
    if (!isOpen) return null;

    return (
      <aside
        ref={ref}
        className={clsx(styles.sideSection, className)}
        role="complementary"
        aria-label={`${title} 섹션`}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>

        <div className={styles.body}>{children}</div>
      </aside>
    );
  }
);

SideSection.displayName = 'SideSection';
export default SideSection;
