import { useEffect, useMemo, useRef, useState } from 'react';

import type { IMessage } from '@stomp/stompjs';

import NotificationList from '@/features/Notification/components/NotificationList/NotificationList';
import { useWebSocket } from '@/hooks/useWebSocket';

import type { Notification, NotificationAction } from './types/notification.types';

type ServerPayload = {
  id: string;
  type: string;
  message: string;
  isRead?: boolean;
  createdAt: string; // ISO string
  userId?: string;
  userNickname?: string;
  projectId?: string;
  projectTitle?: string;
  studyId?: string;
  studyTitle?: string;
  achievementName?: string;
  teamId?: string;
  teamName?: string;
};

function toFrontModel(p: ServerPayload): Notification {
  return {
    id: p.id,
    // 서버에서 온 문자열이 enum 키와 동일하다고 가정
    type: p.type as Notification['type'],
    message: p.message,
    isRead: !!p.isRead,
    createdAt: new Date(p.createdAt),
    userId: p.userId,
    userNickname: p.userNickname,
    projectId: p.projectId,
    projectTitle: p.projectTitle,
    studyId: p.studyId,
    studyTitle: p.studyTitle,
    achievementName: p.achievementName,
    teamId: p.teamId,
    teamName: p.teamName,
  };
}

export default function NotificationCenterContainer() {
  const [items, setItems] = useState<Notification[]>([]);
  const subIdRef = useRef<string | null>(null);

  // 필요하다면 .env로 API 베이스 사용
  const apiBase = useMemo(() => {
    // 개발 환경에서는 빈 문자열 사용
    return '';
  }, []);

  const {
    isConnected,
    connectionError,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    reconnect,
  } = useWebSocket({
    path: '/ws/chats', // 웹소켓 경로
    debug: false,
  });

  // 1) 마운트 시 연결
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // 2) 연결되면 개인 큐 구독
  useEffect(() => {
    if (!isConnected) return;

    if (subIdRef.current) {
      unsubscribe(subIdRef.current);
      subIdRef.current = null;
    }

    const id = subscribe({
      destination: '/user/queue/notifications',
      onMessage: (msg: IMessage) => {
        try {
          const payload = JSON.parse(msg.body) as ServerPayload;
          const n = toFrontModel(payload);
          setItems(prev => {
            // 같은 id 업데이트, 최신순 정렬
            const map = new Map(prev.map(x => [x.id, x]));
            map.set(n.id, { ...(map.get(n.id) ?? n), ...n });
            return Array.from(map.values()).sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );
          });
        } catch (e) {
          console.warn('[notifications] parse error', e, msg.body);
        }
      },
    });

    subIdRef.current = id;

    return () => {
      if (subIdRef.current) {
        unsubscribe(subIdRef.current);
        subIdRef.current = null;
      }
    };
  }, [isConnected, subscribe, unsubscribe]);

  // 3) 읽음 처리(REST가 있으면 호출, 없으면 낙관적)
  const markAsRead = async (id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    // 선택: 백엔드에 PATCH 호출
    try {
      await fetch(`${apiBase}/api/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
    } catch {
      /* dev 환경이면 무시 */
    }
  };

  // 4) 액션 전송 (수락/거절)
  const sendAction = (id: string, action: NotificationAction['type']) => {
    publish({
      destination: `/pub/notifications/${id}/action`,
      payload: { type: action },
    });
    // 낙관적 읽음 처리
    markAsRead(id);
  };

  // ===== 테스트용 UI(원하면 삭제) =====
  if (connectionError) {
    return (
      <div style={{ padding: 16 }}>
        <p>WS 연결 오류: {String(connectionError)}</p>
        <button onClick={reconnect}>재연결</button>
      </div>
    );
  }

  return (
    <NotificationList
      items={items}
      onUnreadCountChange={c => void c}
      onMarkAsRead={markAsRead}
      onAction={sendAction}
    />
  );
}
