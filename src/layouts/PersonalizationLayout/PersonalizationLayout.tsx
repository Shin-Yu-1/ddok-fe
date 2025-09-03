import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Header from '@/features/Header/components/Header';

import styles from './PersonalizationLayout.module.scss';

const PersonalizationLayout = () => {
  return (
    <ProtectedRoute requirePreference={false}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Header variant="logo-only" />
        </div>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default PersonalizationLayout;
