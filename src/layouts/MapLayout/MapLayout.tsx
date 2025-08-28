import { Outlet } from 'react-router-dom';

import Header from '@/features/Header/components/Header';
import SubHeader from '@/features/Header/components/SubHeader';

import styles from './MapLayout.module.scss';

const MapLayout = () => {
  return (
    <>
      <div className={styles.layoutContainer}>
        <Header />
        <SubHeader />
        {/* <Sidebar /> */}
        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MapLayout;
