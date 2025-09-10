import { BellIcon, BellRingingIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import AchievementIconSrc from '@/assets/icons/achievement-icon.svg';
import DMIconSrc from '@/assets/icons/dm-noti-icon.svg';
import ProjectStudyIconSrc from '@/assets/icons/project-study-noti-icon.svg';
import ViolationIconSrc from '@/assets/icons/violation-icon.svg';
import Button from '@/components/Button/Button';

import {
  notificationConfig,
  type Notification,
  type NotificationAction,
  NotificationType,
} from '../../types/notification.types';

import styles from './NotificationItem.module.scss';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onAction?: (id: string, action: NotificationAction['type']) => void;
  isFirst?: boolean;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onAction,
  isFirst = false,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const config = notificationConfig[notification.type];

  const handleMarkAsRead = () => {
    if (!notification.isRead) onMarkAsRead(notification.id);
  };

  const handleAction = (actionType: NotificationAction['type']) => {
    if (onAction) onAction(notification.id, actionType);
  };

  // 알림 클릭 시 프로필 페이지로 이동
  const handleNotificationClick = () => {
    handleMarkAsRead();
    const actorId = notification.actorUserId ?? notification.userId;
    if (actorId) navigate(`/profile/user/${actorId}`);
  };

  const typeKey =
    typeof notification.type === 'string'
      ? notification.type
      : (NotificationType as Record<string, string>)[notification.type];

  const needsButtons = typeof typeKey === 'string' && typeKey.includes('REQUEST');

  const actions = config.actions ?? [];
  const showActions = (needsButtons || !!config.hasActions) && actions.length > 0;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${diffInDays}일 전`;
  };

  const renderNotificationIcon = () => {
    const isProjectOrStudy =
      notification.type === NotificationType.PROJECT_JOIN_REQUEST ||
      notification.type === NotificationType.PROJECT_JOIN_APPROVED ||
      notification.type === NotificationType.PROJECT_JOIN_REJECTED ||
      notification.type === NotificationType.STUDY_JOIN_REQUEST ||
      notification.type === NotificationType.STUDY_JOIN_APPROVED ||
      notification.type === NotificationType.STUDY_JOIN_REJECTED;

    const isDMRequest =
      notification.type === NotificationType.DM_REQUEST ||
      notification.type === NotificationType.DM_APPROVED ||
      notification.type === NotificationType.DM_REJECTED;

    const isViolation =
      notification.type === NotificationType.TEAM_LEADER_VIOLATION ||
      notification.type === NotificationType.TEAM_MEMBER_VIOLATION;

    const isAchievement = notification.type === NotificationType.ACHIEVEMENT;

    if (isProjectOrStudy) {
      return (
        <div className={styles.iconContainer}>
          <img
            src={ProjectStudyIconSrc}
            alt="프로젝트/스터디"
            className={styles.notificationIcon}
          />
        </div>
      );
    }
    if (isDMRequest) {
      return (
        <div className={styles.iconContainer}>
          <img src={DMIconSrc} alt="DM 요청" className={styles.notificationIcon} />
        </div>
      );
    }
    if (isViolation) {
      return (
        <div className={styles.iconContainer}>
          <img src={ViolationIconSrc} alt="일탈 신고" className={styles.notificationIcon} />
        </div>
      );
    }
    if (isAchievement) {
      return (
        <div className={styles.iconContainer}>
          <img src={AchievementIconSrc} alt="업적 달성" className={styles.notificationIcon} />
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`${styles.notificationItem} ${notification.isRead ? styles.read : styles.unread} ${isFirst ? styles.firstItem : ''} ${notification.userId ? styles.clickable : ''}`}
      onClick={notification.userId ? handleNotificationClick : undefined}
      style={{ cursor: notification.userId ? 'pointer' : 'default' }}
    >
      {/* 아이콘 영역 */}
      <div className={styles.iconSection}>{renderNotificationIcon()}</div>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.type}>{config.title}</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.time}>{formatTimeAgo(notification.createdAt)}</span>
            {!notification.isRead && <div className={styles.unreadDot} />}
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>{notification.message}</p>
        </div>
      </div>

      <div className={styles.actionSection}>
        <div className={styles.bellIconContainer}>
          <div
            className={styles.bellIcon}
            onClick={e => {
              e.stopPropagation();
              handleMarkAsRead();
            }}
          >
            {notification.isRead ? (
              <BellIcon size={16} weight="regular" />
            ) : (
              <BellRingingIcon size={16} weight="regular" />
            )}
          </div>
        </div>
        <div className={styles.actionButtons}>
          {showActions && (
            <div className={styles.actions}>
              {actions.map(action => (
                <Button
                  key={action.type}
                  variant={action.variant}
                  size="xsm"
                  radius="xxsm"
                  fontSizePreset="xxxsmall"
                  fontWeightPreset="regular"
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
      </div>
    </div>
  );
};

export default NotificationItem;
