import Button from '@/components/Button/Button';

import {
  notificationConfig,
  type Notification,
  type NotificationAction,
} from '../../types/notification.types';

import styles from './NotificationItem.module.scss';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onAction?: (id: string, action: NotificationAction['type']) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onAction }: NotificationItemProps) => {
  const config = notificationConfig[notification.type];

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleAction = (actionType: NotificationAction['type']) => {
    if (onAction) {
      onAction(notification.id, actionType);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return `${diffInDays}일 전`;
    }
  };

  return (
    <div
      className={`${styles.notificationItem} ${notification.isRead ? styles.read : styles.unread}`}
      onClick={handleMarkAsRead}
    >
      <div className={styles.header}>
        <span className={styles.type}>{config.title}</span>
        <span className={styles.time}>{formatTimeAgo(notification.createdAt)}</span>
        {!notification.isRead && <div className={styles.unreadDot} />}
      </div>

      <div className={styles.content}>
        <p className={styles.message}>{notification.message}</p>
      </div>

      {config.hasActions && config.actions && (
        <div className={styles.actions}>
          {config.actions.map(action => (
            <Button
              key={action.type}
              variant={action.variant}
              size="sm"
              onClick={e => {
                e.stopPropagation();
                handleAction(action.type);
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
