import { useCallback, useEffect, useRef, useState } from 'react';

import type { Client, StompSubscription } from '@stomp/stompjs';

import { createStompClient, hasValidToken } from '@/utils/ws/ws';

import type {
  WebSocketOptions,
  WebSocketState,
  UseWebSocketReturn,
  SubscribeOptions,
  PublishOptions,
} from '../types/websocket.types';

/**
 * 웹소켓 연결을 관리하는 훅
 */
export const useWebSocket = (options: WebSocketOptions): UseWebSocketReturn => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    connectionError: null,
  });

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());

  // 상태 업데이트 헬퍼
  const updateState = useCallback((updates: Partial<WebSocketState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 연결
  const connect = useCallback(() => {
    if (!hasValidToken()) {
      const error = '인증 토큰이 없습니다';
      console.error('[WebSocket]', error);
      updateState({ connectionError: error });
      return;
    }

    if (clientRef.current?.active || clientRef.current?.connected) {
      console.warn('[WebSocket] 이미 연결되어 있습니다');
      return;
    }

    console.log('[WebSocket] 연결 시도 시작');
    updateState({ isConnecting: true, connectionError: null });

    const client = createStompClient(options, {
      onConnect: () => {
        console.log('[WebSocket] 연결 성공');
        updateState({ isConnected: true, isConnecting: false, connectionError: null });
      },
      onDisconnect: () => {
        console.log('[WebSocket] 연결 해제됨');
        updateState({ isConnected: false, isConnecting: false });
        // 구독 정리
        subscriptionsRef.current.clear();
      },
      onError: (error: string) => {
        console.error('[WebSocket] 연결 오류:', error);
        updateState({ isConnected: false, isConnecting: false, connectionError: error });
      },
    });

    clientRef.current = client;
    client.activate();
  }, [options, updateState]);

  // 연결 해제
  const disconnect = useCallback(async () => {
    try {
      // 모든 구독 해제
      subscriptionsRef.current.forEach(sub => {
        try {
          sub.unsubscribe();
        } catch (e) {
          console.warn('[WebSocket] 구독 해제 실패:', e);
        }
      });
      subscriptionsRef.current.clear();

      // 클라이언트 비활성화
      if (clientRef.current?.active) {
        await clientRef.current.deactivate();
      }
    } catch (e) {
      console.error('[WebSocket] 연결 해제 중 오류:', e);
    } finally {
      clientRef.current = null;
      updateState({ isConnected: false, isConnecting: false });
    }
  }, [updateState]);

  // 구독
  const subscribe = useCallback((subscribeOptions: SubscribeOptions): string | null => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.warn('[WebSocket] 연결되지 않은 상태에서 구독 시도');
      return null;
    }

    try {
      const subscription = client.subscribe(
        subscribeOptions.destination,
        subscribeOptions.onMessage
      );

      const subscriptionId = `${subscribeOptions.destination}_${Date.now()}`;
      subscriptionsRef.current.set(subscriptionId, subscription);

      // console.log('[WebSocket] 구독 성공:', subscribeOptions.destination);
      return subscriptionId;
    } catch (e) {
      console.error('[WebSocket] 구독 실패:', e);
      return null;
    }
  }, []);

  // 구독 해제
  const unsubscribe = useCallback((subscriptionId: string) => {
    const subscription = subscriptionsRef.current.get(subscriptionId);
    if (subscription) {
      try {
        subscription.unsubscribe();
        subscriptionsRef.current.delete(subscriptionId);
        // console.log('[WebSocket] 구독 해제 성공:', subscriptionId);
      } catch (e) {
        console.error('[WebSocket] 구독 해제 실패:', e);
      }
    }
  }, []);

  // 메시지 발행
  const publish = useCallback((publishOptions: PublishOptions) => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.warn('[WebSocket] 연결되지 않은 상태에서 발행 시도');
      return;
    }

    try {
      client.publish({
        destination: publishOptions.destination,
        body: JSON.stringify(publishOptions.payload),
        headers: { 'content-type': 'application/json;charset=UTF-8' },
      });
      // console.log('[WebSocket] 메시지 발행 성공:', publishOptions.destination);
    } catch (e) {
      console.error('[WebSocket] 메시지 발행 실패:', e);
    }
  }, []);

  // 재연결
  const reconnect = useCallback(() => {
    // console.log('[WebSocket] 재연결 시도');
    disconnect().finally(() => {
      setTimeout(() => connect(), 300);
    });
  }, [connect, disconnect]);

  useEffect(() => {
    const cleanup = () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
      subscriptionsRef.current.clear();
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    reconnect,
  };
};
