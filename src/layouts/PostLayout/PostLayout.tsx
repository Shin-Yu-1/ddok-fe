import { Outlet } from 'react-router-dom';

import styles from './PostLayout.module.scss';

const PostLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default PostLayout;
