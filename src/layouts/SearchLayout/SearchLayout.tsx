import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Header from '@/features/Header/components/Header';
import SubHeader from '@/features/Header/components/SubHeader';
import Sidebar from '@/features/Sidebar/components/Sidebar';
import { useAuthStore } from '@/stores/authStore';

import styles from './SearchLayout.module.scss';

const SearchLayout = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className={styles.layoutContainer}>
      <Header />
      <SubHeader />
      {isLoggedIn && <Sidebar />}
      <div className={`${styles.contentContainer} ${isLoggedIn ? styles.moveRight : ''}`}>
        {isLoggedIn ? (
          <ProtectedRoute requirePreference={true}>
            <Outlet />
          </ProtectedRoute>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default SearchLayout;
