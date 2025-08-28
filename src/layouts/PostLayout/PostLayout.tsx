import { Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

import styles from './PostLayout.module.scss';

const PostLayout = () => {
  return (
    <ProtectedRoute requirePreference={true}>
      <div className={styles.container}>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default PostLayout;
