import { Outlet } from 'react-router-dom';

import Header from '@/features/Header/components/Header';
import SubHeader from '@/features/Header/components/SubHeader';
import Sidebar from '@/features/Sidebar/components/Sidebar';
        
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

import styles from './SearchLayout.module.scss';

const SearchLayout = () => {
  return (
    <ProtectedRoute requirePreference={true}>
    <div className={styles.layoutContainer}>
      <Header variant="user" />
      <SubHeader />
      <Sidebar />
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default SearchLayout;
