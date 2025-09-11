import { forwardRef } from 'react';

import clsx from 'clsx';

import Button from '@/components/Button/Button';

import { useActiveRoute } from '../hooks/useActiveRoute';
import { useSubHeaderHandlers } from '../hooks/useSubHeaderHandlers';

import styles from './SubHeader.module.scss';

interface SubHeaderProps {
  className?: string;
}

const SubHeader = forwardRef<HTMLElement, SubHeaderProps>(({ className }, ref) => {
  const handlers = useSubHeaderHandlers();
  const activeStates = useActiveRoute();

  const navItems = [
    {
      label: '메인',
      isActive: activeStates.main,
      onclick: handlers.handleMainClick,
    },
    {
      label: '지도',
      isActive: activeStates.map,
      onclick: handlers.handleMapClick,
    },
    {
      label: '프로젝트',
      isActive: activeStates.project,
      onclick: handlers.handleProjectClick,
    },
    {
      label: '스터디',
      isActive: activeStates.study,
      onclick: handlers.handleStudyClick,
    },
    {
      label: '플레이어',
      isActive: activeStates.player,
      onclick: handlers.handlePlayerClick,
    },
    {
      label: '랭킹',
      isActive: activeStates.ranking,
      onclick: handlers.handleRankingClick,
    },
  ];
  return (
    <nav ref={ref} className={clsx(styles.subHeader, className)} role="navigation">
      <div className={styles.navContainer}>
        {navItems.map(({ label, onclick, isActive }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            fontSizePreset="xsmall"
            fontWeightPreset="regular"
            className={clsx(styles.navButton, { [styles.active]: isActive })}
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
