import { forwardRef } from 'react';

import clsx from 'clsx';

import Button from '@/components/Button/Button';

import styles from './SubHeader.module.scss';

interface SubHeaderProps {
  className?: string;
}

const SubHeader = forwardRef<HTMLElement, SubHeaderProps>(({ className }, ref) => {
  const navItems = [
    {
      label: '지도',
    },
    {
      label: '프로젝트',
    },
    {
      label: '스터디',
    },
    {
      label: '플레이어',
    },
    {
      label: '랭킹',
    },
  ];
  return (
    <nav ref={ref} className={clsx(styles.subHeader, className)} role="navigation">
      <div className={styles.navContainer}>
        {navItems.map(({ label }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            fontSizePreset="xsmall"
            fontWeightPreset="regular"
            className={styles.navButton}
          >
            {label}
          </Button>
        ))}
      </div>
    </nav>
  );
});

export default SubHeader;
