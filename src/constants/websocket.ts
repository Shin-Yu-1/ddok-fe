// 기본 상수
export const WEBSOCKET_CONSTANTS = {
  // 재연결 지연(ms)
  DEFAULT_RECONNECT_DELAY: 5000,

  // 하트비트 (브로커가 지원 안 하면 0 유지)
  DEFAULT_HEARTBEAT_INCOMING: 0,
  DEFAULT_HEARTBEAT_OUTGOING: 0,

  TOKEN_STORAGE_KEY: 'accessToken',

  PATHS: {
    CHAT: '/ws/chats',
    NOTIFICATIONS: '/ws/notifications',
  } as const,

  // ✅ 알림용 목적지 모음 (구독/발행 경로)
  DESTINATIONS: {
    NOTI_SUB: '/user/queue/notifications',
    NOTI_ACTION: (id: string) => `/pub/notifications/${id}/action`, // 발행(수락/거절)
  },
} as const;

// 환경변수에서 기본 URL 가져오기
export const getBaseUrl = (): string => {
  // 개발 환경에서는 직접 값 사용
  const baseUrl = 'http://localhost:8080';
  console.log('[WebSocket] Base URL:', baseUrl);
  return baseUrl;
};

// WebSocket URL 생성 함수
export const createWebSocketUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const url = new URL(baseUrl);
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${url.host}${path}`;
  console.log('[WebSocket] 생성된 WebSocket URL:', wsUrl);
  return wsUrl;
};

// ✅ (옵션) 세션에서 토큰 읽어 STOMP 연결 헤더 만들기
export const buildAuthHeaders = (): Record<string, string> => {
  const token = sessionStorage.getItem(WEBSOCKET_CONSTANTS.TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
