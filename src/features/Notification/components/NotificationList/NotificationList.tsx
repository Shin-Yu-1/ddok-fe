import { useState, useEffect } from 'react';

import type { NotificationFront } from '@/api/notification';
import { useNotifications } from '@/hooks/notification/useNotifications';

import {
  NotificationType,
  type Notification,
  type NotificationAction,
} from '../../types/notification.types';
import NotificationItem from '../NotificationItem/NotificationItem';

import styles from './NotificationList.module.scss';

// NotificationFront를 기존 Notification 타입으로 변환하는 헬퍼 함수
const convertToNotification = (apiNotification: NotificationFront): Notification => ({
  id: apiNotification.id,
  type: apiNotification.type as NotificationType,
  message: apiNotification.message,
  isRead: apiNotification.isRead,
  isProcessed: apiNotification.isProcessed,
  createdAt: apiNotification.createdAt,
  userId: apiNotification.userId || undefined,
  userNickname: apiNotification.userNickname || undefined,
  projectId: apiNotification.projectId || undefined,
  projectTitle: apiNotification.projectTitle || undefined,
  studyId: apiNotification.studyId || undefined,
  studyTitle: apiNotification.studyTitle || undefined,
  achievementName: apiNotification.achievementName || undefined,
  teamId: apiNotification.teamId || undefined,
  teamName: apiNotification.teamName || undefined,
});

interface NotificationListProps {
  items?: Notification[];
  onUnreadCountChange?: (count: number) => void;
  onMarkAsRead?: (id: string) => void;
  onAction?: (id: string, action: NotificationAction['type']) => void;
  // API 연결 옵션들
  useApi?: boolean;
  page?: number;
  size?: number;
  isRead?: boolean;
  type?: string;
}

const NotificationList = ({
  items,
  onUnreadCountChange,
  onMarkAsRead,
  onAction,
  useApi = true,
  page = 0,
  size = 20,
  isRead,
  type,
}: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(items ?? []);

  // API 연결
  const {
    notifications: apiNotifications,
    loading,
    error,
    markAsRead: apiMarkAsRead,
    accept: apiAccept,
    reject: apiReject,
  } = useNotifications({
    page,
    size,
    isRead,
    type,
    autoRefresh: true, // 자동 새로고침 활성화
  });

  // API 사용 시 데이터 변환 및 설정
  useEffect(() => {
    if (useApi && apiNotifications.length > 0) {
      const convertedNotifications = apiNotifications.map(convertToNotification);
      setNotifications(convertedNotifications);
    } else if (!useApi && items) {
      setNotifications(items);
    } else if (useApi && apiNotifications.length === 0) {
      setNotifications([]);
    }
  }, [useApi, apiNotifications, items]);

  const handleMarkAsRead = async (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
      return;
    }

    if (useApi) {
      try {
        await apiMarkAsRead(id);
      } catch (error) {
        console.error('읽음 처리 실패:', error);
      }
    } else {
      // 로컬 상태 업데이트 (props로 전달된 items 사용 시)
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    }
  };

  const handleAction = async (id: string, action: NotificationAction['type']) => {
    if (onAction) {
      onAction(id, action);
      return;
    }

    if (useApi) {
      try {
        if (action === 'accept') {
          await apiAccept(id);
        } else if (action === 'reject') {
          await apiReject(id);
        }
      } catch (error) {
        console.error(`알림 ${action} 실패:`, error);
      }
    } else {
      // 로컬 상태 업데이트 (props로 전달된 items 사용 시)
      handleMarkAsRead(id);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  return (
    <div className={styles.notificationList}>
      <div className={styles.list}>
        {/* 로딩 상태 */}
        {useApi && loading && (
          <div className={styles.loading}>
            <p>알림을 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {useApi && error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* 알림 목록 */}
        {!loading && !error && notifications.length === 0 ? (
          <div className={styles.empty}>
            <p>새로운 알림이 없습니다.</p>
          </div>
        ) : (
          !loading &&
          notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onAction={handleAction}
              isFirst={index === 0}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
