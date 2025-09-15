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

  // 최신 토큰으로 연결 헤더 생성
  const getConnectHeaders = (): Record<string, string> => {
    const token = getToken();
    console.log(
      '[WebSocket] 연결 시 토큰 확인:',
      !!token,
      token ? `${token.substring(0, 20)}...` : 'null'
    );
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  const wsUrl = createWebSocketUrl(path);
  console.log('[WebSocket] STOMP 클라이언트 생성 시작');
  console.log('[WebSocket] URL:', wsUrl);
  console.log('[WebSocket] 연결 헤더:', getConnectHeaders());

  const client = new Client({
    brokerURL: wsUrl,

    // 연결 시 인증 헤더
    connectHeaders: getConnectHeaders(),

    // 재연결 설정
    reconnectDelay,

    // 하트비트 설정
    heartbeatIncoming,
    heartbeatOutgoing,

    // 디버그 로깅
    debug: debug ? (str: string) => console.log('[STOMP Debug]', str) : undefined,

    // 연결 성공
    onConnect: frame => {
      console.log('[WebSocket] 연결 성공!');
      console.log('[WebSocket] 연결 프레임:', frame.headers);
      onConnect?.();
    },

    // STOMP 에러
    onStompError: frame => {
      const errorMsg = `STOMP 에러: ${frame.body || '알 수 없는 에러'}`;
      console.error('[WebSocket]', errorMsg);
      console.error('[WebSocket] STOMP 에러 헤더:', frame.headers);
      onError?.(errorMsg);
    },

    // WebSocket 에러
    onWebSocketError: event => {
      const errorMsg = 'WebSocket 연결 에러';
      console.error('[WebSocket]', errorMsg);
      console.error('[WebSocket] WebSocket 에러 이벤트:', event);
      onError?.(errorMsg);
    },

    // 연결 해제
    onDisconnect: () => {
      console.log('[WebSocket] 연결 해제됨');
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
