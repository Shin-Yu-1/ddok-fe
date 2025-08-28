import { Outlet } from 'react-router-dom';

import Header from '@/features/Header/components/Header';

import styles from './PersonalizationLayout.module.scss';

const PersonalizationLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header variant="logo-only" />
      </div>
      <Outlet />
    </div>
  );
};

export default PersonalizationLayout;
