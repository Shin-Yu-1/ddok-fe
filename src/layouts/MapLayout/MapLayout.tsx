import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Header from '@/features/Header/components/Header';
import SubHeader from '@/features/Header/components/SubHeader';

import styles from './MapLayout.module.scss';

const MapLayout = () => {
  return (
    <ProtectedRoute requirePreference={true}>
      <div className={styles.layoutContainer}>
        <Header />
        <SubHeader />
        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MapLayout;
