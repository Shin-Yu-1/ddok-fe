import type { IMessage } from '@stomp/stompjs';

// 웹소켓 연결 옵션
export interface WebSocketOptions {
  path: string;
  reconnectDelay?: number;
  heartbeatIncoming?: number;
  heartbeatOutgoing?: number;
  debug?: boolean;
}

// 구독 옵션
export interface SubscribeOptions {
  destination: string;
  onMessage: (message: IMessage) => void;
}

// 발행 옵션
export interface PublishOptions {
  destination: string;
  payload: object;
}

// 웹소켓 상태
export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
}

// 웹소켓 훅 반환 타입
export interface UseWebSocketReturn extends WebSocketState {
  connect: () => void;
  disconnect: () => Promise<void>;
  subscribe: (options: SubscribeOptions) => string | null;
  unsubscribe: (subscriptionId: string) => void;
  publish: (options: PublishOptions) => void;
  reconnect: () => void;
}
