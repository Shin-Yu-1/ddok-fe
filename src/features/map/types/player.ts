import type { BaseMapItem } from './common';

/**
 * 플레이어 관련 타입 정의
 */

/** 지도상의 플레이어 정보 */
export interface PlayerMapItem extends BaseMapItem {
  userId: number;
  nickname: string;
  position: string;
  isMine: boolean;
}

/** 패널의 플레이어 아이템 정보 */
export interface PlayerPanelItem extends PlayerMapItem {
  mainBadge: {
    type: string;
    tier: string;
  };
  abandonBadge: {
    isGranted: boolean;
    count: number;
  };
  temperature: number;
  profileImageUrl: string;
}
