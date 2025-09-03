import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Header from '@/features/Header/components/Header';

import styles from './ProfileLayout.module.scss';

const ProfileLayout = () => {
  const isLoggedIn = true; // 또는 false
  const user = {
    nickname: '홍길동',
    profileImage: '/src/assets/images/avatar.png',
  };

  return (
    <ProtectedRoute requirePreference={true}>
      <div className={styles.container}>
        <Header variant={isLoggedIn ? 'user' : 'guest'} user={isLoggedIn ? user : undefined} />
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default ProfileLayout;
