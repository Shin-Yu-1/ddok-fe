import { Outlet } from 'react-router-dom';

import Header from '@/features/Header/components/Header';

import styles from './AuthLayout.module.scss';

const AuthLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header variant="logo-only" />
      </div>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
