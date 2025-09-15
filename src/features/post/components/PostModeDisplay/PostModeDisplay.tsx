import { MonitorIcon, UsersIcon } from '@phosphor-icons/react';

import styles from './PostModeDisplay.module.scss';

interface PostModeDisplayProps {
  value: 'online' | 'offline';
}

const PostModeDisplay = ({ value }: PostModeDisplayProps) => {
  const isOnline = value === 'online';

  return (
    <div className={styles.container}>
      <div className={styles.modeInfo}>
        <div className={styles.iconSection}>
          {isOnline ? (
            <MonitorIcon size={20} color="var(--blue-1)" />
          ) : (
            <UsersIcon size={20} color="var(--green-1)" />
          )}
        </div>

        <div className={styles.textSection}>
          <div className={styles.modeText}>{isOnline ? '온라인' : '오프라인'}</div>
          <div className={styles.description}>
            {isOnline ? '온라인 플랫폼을 통한 원격 진행' : '오프라인 공간에서 대면 진행'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModeDisplay;
