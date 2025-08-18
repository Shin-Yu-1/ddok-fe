import { Outlet } from 'react-router-dom';

import styles from './MapLayout.module.scss';

const MapLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default MapLayout;
