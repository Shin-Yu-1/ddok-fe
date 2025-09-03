import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

import styles from './MapLayout.module.scss';

const MapLayout = () => {
  return (
    <ProtectedRoute requirePreference={true}>
      <div className={styles.container}>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default MapLayout;
