import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Header from '@/features/Header/components/Header';
import SubHeader from '@/features/Header/components/SubHeader';
import Sidebar from '@/features/Sidebar/components/Sidebar';
import { useAuthStore } from '@/stores/authStore';

import styles from './PostLayout.module.scss';

const PostLayout = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <ProtectedRoute requirePreference={true}>
      <div className={styles.layoutContainer}>
        <Header />
        <SubHeader />
        {isLoggedIn && <Sidebar />}
        <div className={`${styles.contentContainer} ${!isLoggedIn ? styles.noSidebar : ''}`}>
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostLayout;
