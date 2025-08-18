import { Outlet } from 'react-router-dom';

import styles from './ProfileLayout.module.scss';

const ProfileLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
