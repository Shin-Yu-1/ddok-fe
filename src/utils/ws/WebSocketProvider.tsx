import { createContext, useContext, useEffect, useMemo } from 'react';

import type { IMessage } from '@stomp/stompjs';

import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuthStore } from '@/stores/authStore';
import { updateToken } from '@/utils/ws/ws';

// 컨텍스트에 노출할 API 시그니처를 (destination, onMessage) 형태로 정의
type WsApi = {
  isConnected: boolean;
  subscribe: (destination: string, onMessage: (msg: IMessage) => void) => string | null;
  unsubscribe: (id: string) => void;
  publish: (destination: string, payload: object) => void;
};

const WsCtx = createContext<WsApi>({
  isConnected: false,
  subscribe: () => null,
  unsubscribe: () => {},
  publish: () => {},
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useWebSocket({
    path: '/ws/chats-ws',
    reconnectDelay: 5000,
    debug: true,
  });

  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken') || '';
    if (isLoggedIn && user?.id && accessToken) {
      updateToken(accessToken);
      ws.connect();
      return () => {
        ws.disconnect();
      };
    } else {
      ws.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?.id]);

  // 🔧 여기서 시그니처를 맞춰주는 래퍼를 제공
  const api = useMemo<WsApi>(
    () => ({
      isConnected: ws.isConnected,
      subscribe: (destination: string, onMessage: (msg: IMessage) => void) =>
        ws.subscribe({ destination, onMessage }),
      unsubscribe: (id: string) => ws.unsubscribe(id),
      publish: (destination: string, payload: object) => ws.publish({ destination, payload }),
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ws.isConnected, ws.subscribe, ws.unsubscribe, ws.publish]
  );

  return <WsCtx.Provider value={api}>{children}</WsCtx.Provider>;
};

export const useWebSocketContext = () => useContext(WsCtx);
