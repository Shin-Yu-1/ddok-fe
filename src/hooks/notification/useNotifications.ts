import { useState, useEffect, useCallback } from 'react';

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  acceptNotification,
  rejectNotification,
  type NotificationListParams,
  type NotificationFront,
} from '@/api/notification';

export interface UseNotificationsOptions {
  page?: number;
  size?: number;
  isRead?: boolean;
  type?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const {
    page = 0,
    size = 20,
    isRead,
    type,
    autoRefresh = false,
    refreshInterval = 30000, // 30초
  } = options;

  const [notifications, setNotifications] = useState<NotificationFront[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: NotificationListParams = { page, size };
      if (isRead !== undefined) params.isRead = isRead;
      if (type) params.type = type;

      const result = await getNotifications(params);

      setNotifications(result.content);
      setHasNext(result.hasNext);
      setTotalElements(result.totalElements);
    } catch (err) {
      console.error('알림 목록 조회 실패:', err);
      setError('알림을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, size, isRead, type]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  }, []);

  const acceptNotificationAction = useCallback(async (id: string) => {
    try {
      await acceptNotification(id);
      // 승인 후 알림을 읽음 처리
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('알림 승인 실패:', err);
      throw err;
    }
  }, []);

  const rejectNotificationAction = useCallback(async (id: string) => {
    try {
      await rejectNotification(id);
      // 거절 후 알림을 읽음 처리
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('알림 거절 실패:', err);
      throw err;
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 자동 새로고침
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchNotifications, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    hasNext,
    totalElements,
    refetch: fetchNotifications,
    markAsRead: markNotificationAsRead,
    accept: acceptNotificationAction,
    reject: rejectNotificationAction,
  };
};

export const useUnreadCount = (autoRefresh = true, refreshInterval = 30000) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const unreadCount = await getUnreadCount();
      setCount(unreadCount);
    } catch (err) {
      console.error('읽지 않은 알림 개수 조회 실패:', err);
      setError('읽지 않은 알림 개수를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // 자동 새로고침
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchUnreadCount, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchUnreadCount]);

  return {
    count,
    loading,
    error,
    refetch: fetchUnreadCount,
  };
};
