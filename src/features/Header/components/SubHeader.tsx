import { forwardRef } from 'react';

import clsx from 'clsx';

import Button from '@/components/Button/Button';

import { useSubHeaderHandlers } from '../hooks/useSubHeaderHandlers';

import styles from './SubHeader.module.scss';

interface SubHeaderProps {
  className?: string;
}

const SubHeader = forwardRef<HTMLElement, SubHeaderProps>(({ className }, ref) => {
  const handlers = useSubHeaderHandlers();

  const navItems = [
    {
      label: '지도',
      onclick: handlers.handleMapClick,
    },
    {
      label: '프로젝트',
      onclick: handlers.handleProjectClick,
    },
    {
      label: '스터디',
      onclick: handlers.handleStudyClick,
    },
    {
      label: '플레이어',
      onclick: handlers.handlePlayerClick,
    },
    {
      label: '랭킹',
      onclick: handlers.handleRankingClick,
    },
  ];
  return (
    <nav ref={ref} className={clsx(styles.subHeader, className)} role="navigation">
      <div className={styles.navContainer}>
        {navItems.map(({ label, onclick }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            fontSizePreset="xsmall"
            fontWeightPreset="regular"
            className={styles.navButton}
            onClick={onclick}
          >
            {label}
          </Button>
        ))}
      </div>
    </nav>
  );
});

export default SubHeader;
