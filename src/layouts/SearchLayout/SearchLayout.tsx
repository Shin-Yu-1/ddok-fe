import { Outlet } from 'react-router-dom';

import styles from './SearchLayout.module.scss';

const SearchLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default SearchLayout;
