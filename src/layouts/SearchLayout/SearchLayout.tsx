import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

import styles from './SearchLayout.module.scss';

const SearchLayout = () => {
  return (
    <ProtectedRoute requirePreference={true}>
      <div className={styles.container}>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default SearchLayout;
