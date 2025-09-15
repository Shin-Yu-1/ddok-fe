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
import { useAuthStore } from '@/stores/authStore';

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

  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationFront[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchNotifications = useCallback(async () => {
    // 로그인하지 않은 경우 처리
    if (!user) {
      console.log('[useNotifications] 사용자가 로그인하지 않음');
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      console.log('[useNotifications] 알림 목록 요청 시작:', { page, size, isRead, type });
      setLoading(true);
      setError(null);

      const params: NotificationListParams = { page, size };
      if (isRead !== undefined) params.isRead = isRead;
      if (type) params.type = type;

      console.log('[useNotifications] API 요청 파라미터:', params);
      const result = await getNotifications(params);
      console.log('[useNotifications] API 응답 결과:', result);

      setNotifications(result.content);
      setHasNext(result.hasNext);
      setTotalElements(result.totalElements);
      console.log('[useNotifications] 상태 업데이트 완료:', {
        count: result.content.length,
        hasNext: result.hasNext,
        totalElements: result.totalElements,
      });
    } catch (err) {
      console.error('[useNotifications] 알림 목록 조회 실패:', err);
      setError('알림을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, size, isRead, type, user]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  }, []);

  const acceptNotificationAction = useCallback(
    async (id: string) => {
      try {
        await acceptNotification(id);
        // 승인 후 목록 새로고침
        await fetchNotifications();
      } catch (err) {
        console.error('알림 승인 실패:', err);
        throw err;
      }
    },
    [fetchNotifications]
  );

  const rejectNotificationAction = useCallback(
    async (id: string) => {
      try {
        await rejectNotification(id);
        // 거절 후 목록 새로고침
        await fetchNotifications();
      } catch (err) {
        console.error('알림 거절 실패:', err);
        throw err;
      }
    },
    [fetchNotifications]
  );

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
  const { user } = useAuthStore();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    // 로그인하지 않은 경우 처리
    if (!user) {
      console.log('[useUnreadCount] 사용자가 로그인하지 않음');
      setError('로그인이 필요합니다.');
      setLoading(false);
      setCount(0);
      return;
    }

    try {
      console.log('[useUnreadCount] 읽지 않은 알림 개수 요청 시작');
      setLoading(true);
      setError(null);

      const unreadCount = await getUnreadCount();
      console.log('[useUnreadCount] 읽지 않은 알림 개수:', unreadCount);
      setCount(unreadCount);
    } catch (err) {
      console.error('[useUnreadCount] 읽지 않은 알림 개수 조회 실패:', err);
      setError('읽지 않은 알림 개수를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [user]);

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
