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

// 임시 더미 데이터
const dummyNotifications: Notification[] = [
  {
    id: '1',
    type: NotificationType.PROJECT_JOIN_REQUEST,
    message: '당신의 "React 프로젝트" 프로젝트에 우울한 풀스택님이 참여 승인 요청을 보냈습니다.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    userId: 'user1',
    userNickname: '김개발',
    projectId: 'proj1',
    projectTitle: 'React 프로젝트',
  },
  {
    id: '2',
    type: NotificationType.STUDY_JOIN_APPROVED,
    message: '당신의 "TypeScript 스터디" 스터디 참여 희망 요청을 스터디 모집자가 승인하였습니다.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    studyId: 'study1',
    studyTitle: 'TypeScript 스터디',
  },
  {
    id: '3',
    type: NotificationType.DM_REQUEST,
    message: '우울한 풀스택님이 메세지를 보내고 싶어 합니다.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
    userId: 'user2',
    userNickname: '이코딩',
  },
  {
    id: '4',
    type: NotificationType.ACHIEVEMENT,
    message: '업적을 달성하여 새로운 배지가 지급되었습니다. 지금 확인하세요.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    achievementName: '첫 번째 프로젝트 완성',
  },
  {
    id: '5',
    type: NotificationType.TEAM_LEADER_VIOLATION,
    message:
      '"React 팀" 팀 리더가 떠났습니다. 관련 페이지와 채팅은 9월 15일에 자동으로 삭제됩니다.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
    teamId: 'team1',
    teamName: 'React 팀',
  },
  {
    id: '6',
    type: NotificationType.TEAM_MEMBER_VIOLATION,
    message: '"React 팀" 우울한 풀스택님이 팀을 떠났습니다. 헤어짐 인사를 강제로 받아볼까요?',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
    teamId: 'team1',
    teamName: 'React 팀',
  },
  {
    id: '7',
    type: NotificationType.PROJECT_JOIN_REJECTED,
    message: '당신의 "Vue.js 프로젝트" 프로젝트 참여 희망 요청을 프로젝트 모집자가 거절하였습니다.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4시간 전
    projectId: 'proj2',
    projectTitle: 'Vue.js 프로젝트',
  },
  {
    id: '8',
    type: NotificationType.STUDY_JOIN_REJECTED,
    message: '당신의 "알고리즘 스터디" 스터디 참여 희망 요청을 스터디 모집자가 거절하였습니다.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6시간 전
    studyId: 'study2',
    studyTitle: '알고리즘 스터디',
  },
];

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
  const [notifications, setNotifications] = useState<Notification[]>(items ?? dummyNotifications);

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
      // 더미 데이터용 로컬 상태 업데이트
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
      // 더미 데이터용 로컬 상태 업데이트
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
