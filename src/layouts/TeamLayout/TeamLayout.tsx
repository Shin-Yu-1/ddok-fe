import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

import styles from './TeamLayout.module.scss';

const TeamLayout = () => {
  return (
    <ProtectedRoute requirePreference={true}>
      <div className={styles.container}>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default TeamLayout;
