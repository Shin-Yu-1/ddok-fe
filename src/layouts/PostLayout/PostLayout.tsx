import { Outlet } from 'react-router-dom';

import Header from '@/features/Header/components/Header';
import SubHeader from '@/features/Header/components/SubHeader';
import Sidebar from '@/features/Sidebar/components/Sidebar';

import styles from './PostLayout.module.scss';

const PostLayout = () => {
  return (
    <>
      <div className={styles.layoutContainer}>
        <Header />
        <SubHeader />
        <Sidebar />
        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default PostLayout;
