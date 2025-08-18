import { Outlet } from 'react-router-dom';

import styles from './TeamLayout.module.scss';

const TeamLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default TeamLayout;
