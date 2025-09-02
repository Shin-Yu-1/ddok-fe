import { Outlet } from 'react-router-dom';

import Header from '@/features/Header/components/Header';
import SubHeader from '@/features/Header/components/SubHeader';
import Sidebar from '@/features/Sidebar/components/Sidebar';

import styles from './ProfileLayout.module.scss';

const ProfileLayout = () => {
  const isLoggedIn = true; // 또는 false
  const user = {
    nickname: '홍길동',
    profileImage: '/src/assets/images/avatar.png',
  };

  return (
    <div className={styles.layoutContainer}>
      <Header variant={isLoggedIn ? 'user' : 'guest'} user={isLoggedIn ? user : undefined} />
      <SubHeader />
      <Sidebar />
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
