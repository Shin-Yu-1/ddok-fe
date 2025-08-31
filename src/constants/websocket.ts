export const WEBSOCKET_CONSTANTS = {
  // 기본 재연결 지연 시간 (ms)
  DEFAULT_RECONNECT_DELAY: 5000,

  // 하트비트 설정
  DEFAULT_HEARTBEAT_INCOMING: 0,
  DEFAULT_HEARTBEAT_OUTGOING: 0,

  // 토큰 저장소 키
  TOKEN_STORAGE_KEY: 'accessToken',
} as const;

// 환경변수에서 기본 URL 가져오기
export const getBaseUrl = (): string => {
  return import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
};

// WebSocket URL 생성 함수
export const createWebSocketUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const url = new URL(baseUrl);
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${url.host}${path}`;
};
