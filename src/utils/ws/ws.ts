import { Client } from '@stomp/stompjs';

import { WEBSOCKET_CONSTANTS, createWebSocketUrl } from '@/constants/websocket';
import type { WebSocketOptions } from '@/types/websocket.types';

export const createStompClient = (
  options: WebSocketOptions,
  callbacks: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: string) => void;
  } = {}
): Client => {
  const {
    path,
    reconnectDelay = 0,
    heartbeatIncoming = WEBSOCKET_CONSTANTS.DEFAULT_HEARTBEAT_INCOMING,
    heartbeatOutgoing = WEBSOCKET_CONSTANTS.DEFAULT_HEARTBEAT_OUTGOING,
    debug = false,
  } = options;

  const { onConnect, onDisconnect, onError } = callbacks;

  // sessionStorage에서 토큰 가져오기
  const getToken = (): string | null => {
    return sessionStorage.getItem(WEBSOCKET_CONSTANTS.TOKEN_STORAGE_KEY);
  };

  const client = new Client({
    brokerURL: createWebSocketUrl(path),

    // 연결 시 인증 헤더
    connectHeaders: {
      Authorization: `Bearer ${getToken()}`,
    },

    // 재연결 설정
    reconnectDelay,

    // 하트비트 설정
    heartbeatIncoming,
    heartbeatOutgoing,

    // 디버그 로깅
    debug: debug ? (str: string) => console.log('[STOMP Debug]', str) : undefined,

    // 연결 성공
    onConnect: frame => {
      console.log('[WebSocket] 연결 성공', frame.headers);
      onConnect?.();
    },

    // STOMP 에러
    onStompError: frame => {
      const errorMsg = `STOMP 에러: ${frame.body || '알 수 없는 에러'}`;
      console.error('[WebSocket]', errorMsg, frame.headers);
      onError?.(errorMsg);
    },

    // WebSocket 에러
    onWebSocketError: event => {
      const errorMsg = 'WebSocket 연결 에러';
      console.error('[WebSocket]', errorMsg, event);
      onError?.(errorMsg);
    },

    // 연결 해제
    onDisconnect: () => {
      console.log('[WebSocket] 연결 해제');
      onDisconnect?.();
    },
  });

  return client;
};

/**
 * 토큰이 유효한지 확인합니다
 */
export const hasValidToken = (): boolean => {
  const token = sessionStorage.getItem(WEBSOCKET_CONSTANTS.TOKEN_STORAGE_KEY);
  return !!token && token.trim().length > 0;
};

/**
 * 토큰을 업데이트합니다
 */
export const updateToken = (token: string): void => {
  sessionStorage.setItem(WEBSOCKET_CONSTANTS.TOKEN_STORAGE_KEY, token);
};
