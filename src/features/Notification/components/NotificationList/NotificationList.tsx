import { useState, useEffect } from 'react';

import {
  NotificationType,
  type Notification,
  type NotificationAction,
} from '../../types/notification.types';
import NotificationItem from '../NotificationItem/NotificationItem';

import styles from './NotificationList.module.scss';

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
];

interface NotificationListProps {
  items?: Notification[];
  onUnreadCountChange?: (count: number) => void;
  onMarkAsRead?: (id: string) => void;
  onAction?: (id: string, action: NotificationAction['type']) => void;
}

const NotificationList = ({
  items,
  onUnreadCountChange,
  onMarkAsRead,
  onAction,
}: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(items ?? dummyNotifications);

  // 외부 items가 들어오면 교체
  useEffect(() => {
    if (items) setNotifications(items);
  }, [items]);

  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) return onMarkAsRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleAction = (id: string, action: NotificationAction['type']) => {
    if (onAction) onAction(id, action);
    // 내부용 임시 처리
    handleMarkAsRead(id);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  return (
    <div className={styles.notificationList}>
      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <p>새로운 알림이 없습니다.</p>
          </div>
        ) : (
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
