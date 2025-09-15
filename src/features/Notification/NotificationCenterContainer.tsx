import { useCallback, useEffect, useRef, useState } from 'react';

import type { IMessage } from '@stomp/stompjs';

import { WEBSOCKET_CONSTANTS } from '@/constants/websocket';
import NotificationList from '@/features/Notification/components/NotificationList/NotificationList';
import { useNotificationSocket } from '@/hooks/notification/useNotificationSocket';

type ServerPayload = {
  id: string;
  type: string;
  message: string;
  isRead?: boolean;
  isProcessed: boolean;
  createdAt: string;

  actorUserId?: string;
  actorNickname?: string;
  actorTemperature?: number | string;

  // 하위 호환
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

export default function NotificationCenterContainer({
  onUnreadCountChange,
}: {
  onUnreadCountChange?: (count: number) => void;
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const subIdRef = useRef<string | null>(null);
  // 디버그용 추가 구독 ID (
  const debugQueueSubRef = useRef<string | null>(null);
  const debugTopicSubRef = useRef<string | null>(null);
  const didSubRef = useRef(false);
  // 마지막 WS 메시지 수신 시각 기록 (폴백 로직 참고용)
  const lastMessageAtRef = useRef<number | null>(null);

  const { isConnected, connectionError, connect, disconnect, subscribe, unsubscribe, reconnect } =
    useNotificationSocket();

  // 새로고침 트리거 함수
  const triggerRefresh = useCallback(() => {
    console.log('[Notification] 실시간 알림으로 인한 새로고침');
    setRefreshKey(prev => prev + 1);
  }, []);

  // (1) WebSocket 연결
  useEffect(() => {
    console.log('[Notification] WebSocket 연결 시도');
    connect();
    return () => {
      console.log('[Notification] WebSocket 연결 해제');
      try {
        if (subIdRef.current) {
          unsubscribe(subIdRef.current);
          subIdRef.current = null;
        }
      } finally {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (2) 연결되면 실시간 알림 구독
  useEffect(() => {
    console.log('[Notification] 연결 상태 변경:', { isConnected, didSub: didSubRef.current });

    if (!isConnected || didSubRef.current) return;

    console.log('[Notification] WebSocket 구독 시작:', WEBSOCKET_CONSTANTS.DESTINATIONS.NOTI_SUB);

    const id = subscribe({
      destination: WEBSOCKET_CONSTANTS.DESTINATIONS.NOTI_SUB,
      onMessage: (msg: IMessage) => {
        console.log('[Notification] WebSocket 메시지 수신:', msg.body);
        try {
          const payload = JSON.parse(msg.body) as ServerPayload;
          console.log('[Notification] 파싱된 메시지:', payload);

          // 새 알림을 받으면 목록을 새로고침
          lastMessageAtRef.current = Date.now();
          triggerRefresh();
        } catch (e) {
          console.warn('[notifications] parse error', e, msg.body);
        }
      },
    });

    if (id) {
      console.log('[Notification] 구독 성공, ID:', id);
      subIdRef.current = id;
      didSubRef.current = true;
    } else {
      console.error('[Notification] 구독 실패');
    }

    // 추가 디버그 구독: 서버가 사용자 큐가 아닌 브로드캐스트로 보내는지 확인
    try {
      debugQueueSubRef.current = subscribe({
        destination: '/queue/notifications',
        onMessage: (msg: IMessage) => {
          console.log('[Notification][DEBUG] /queue/notifications 수신:', msg.body);
        },
      });
      console.log(
        '[Notification][DEBUG] /queue/notifications 구독 완료:',
        debugQueueSubRef.current
      );
    } catch (e) {
      console.warn('[Notification][DEBUG] /queue/notifications 구독 실패:', e);
    }

    try {
      debugTopicSubRef.current = subscribe({
        destination: '/topic/notifications',
        onMessage: (msg: IMessage) => {
          console.log('[Notification][DEBUG] /topic/notifications 수신:', msg.body);
        },
      });
      console.log(
        '[Notification][DEBUG] /topic/notifications 구독 완료:',
        debugTopicSubRef.current
      );
    } catch (e) {
      console.warn('[Notification][DEBUG] /topic/notifications 구독 실패:', e);
    }

    return () => {
      if (subIdRef.current) {
        console.log('[Notification] 구독 해제:', subIdRef.current);
        unsubscribe(subIdRef.current);
        subIdRef.current = null;
      }
      if (debugQueueSubRef.current) {
        console.log('[Notification][DEBUG] 디버그 구독 해제(queue):', debugQueueSubRef.current);
        unsubscribe(debugQueueSubRef.current);
        debugQueueSubRef.current = null;
      }
      if (debugTopicSubRef.current) {
        console.log('[Notification][DEBUG] 디버그 구독 해제(topic):', debugTopicSubRef.current);
        unsubscribe(debugTopicSubRef.current);
        debugTopicSubRef.current = null;
      }
      didSubRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, triggerRefresh]);

  // (3) 폴백: 창이 포커스되거나 탭이 다시 보일 때 즉시 새로고침
  useEffect(() => {
    const onFocus = () => {
      console.log('[Notification][폴백] 윈도우 포커스 - 알림 새로고침');
      triggerRefresh();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Notification][폴백] 탭 가시성 복귀 - 알림 새로고침');
        triggerRefresh();
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [triggerRefresh]);

  // (4) 폴백: 주기적 갱신 (WS 미수신 시에도 최신 상태 유지)
  useEffect(() => {
    const POLL_INTERVAL_MS = 30000; // 30초 간격
    const tick = () => {
      if (document.visibilityState !== 'visible') return; // 백그라운드 탭은 스킵
      // 최근 WS 수신이 없더라도 주기적으로 갱신해 최신 상태 보장
      console.log('[Notification][폴백] 주기적 새로고침 트리거');
      triggerRefresh();
    };
    const id = window.setInterval(tick, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [triggerRefresh]);

  // 액션은 NotificationList가 REST API로 처리하도록 위임 (onAction 전달 안 함)

  if (connectionError) {
    console.error('[Notification] WebSocket 연결 오류:', connectionError);
    return (
      <div style={{ padding: 16 }}>
        <p>WS 연결 오류: {String(connectionError)}</p>
        <p>연결 상태: {isConnected ? '연결됨' : '연결 안됨'}</p>
        <button onClick={reconnect}>재연결</button>
      </div>
    );
  }

  return (
    <NotificationList
      key={refreshKey} // key를 변경하여 컴포넌트 새로고침
      onUnreadCountChange={onUnreadCountChange}
      useApi={true}
    />
  );
}
