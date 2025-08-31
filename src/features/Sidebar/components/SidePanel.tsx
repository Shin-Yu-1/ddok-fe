import { forwardRef } from 'react';

import clsx from 'clsx';

import type { SidePanelProps } from '../types/sidebar';

import styles from './SidePanel.module.scss';

const SidePanel = forwardRef<HTMLDivElement, SidePanelProps>(
  ({ title, isOpen, children, className }, ref) => {
    if (!isOpen) return null;

    return (
      <aside
        ref={ref}
        className={clsx(styles.sidePanel, className)}
        role="complementary"
        aria-label={`${title} 섹션`}
      >
        {title && (
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </header>
        )}

        <div className={styles.body}>{children}</div>
      </aside>
    );
  }
);

SidePanel.displayName = 'SidePanel';
export default SidePanel;
