import { useMemo } from 'react';

import { WEBSOCKET_CONSTANTS } from '@/constants/websocket';
import { useWebSocket } from '@/hooks/useWebSocket';

export const useNotificationSocket = () => {
  const opts = useMemo(
    () => ({
      path: '/notifications',
      reconnectDelay: 3000, // 3초로 단축
      heartbeatIncoming: WEBSOCKET_CONSTANTS.DEFAULT_HEARTBEAT_INCOMING,
      heartbeatOutgoing: WEBSOCKET_CONSTANTS.DEFAULT_HEARTBEAT_OUTGOING,
      debug: true, // 디버그 모드 활성화
    }),
    []
  );
  return useWebSocket(opts);
};
