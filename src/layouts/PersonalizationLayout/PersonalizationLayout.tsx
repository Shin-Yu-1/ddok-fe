import { Outlet } from 'react-router-dom';

import styles from './PersonalizationLayout.module.scss';

const PersonalizationLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default PersonalizationLayout;
