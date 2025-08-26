import type { BaseMapItem } from './common';

/**
 * 플레이어 관련 타입 정의
 */

/** 패널의 플레이어 아이템 정보 */
export interface Player extends BaseMapItem {
  category: 'player';
  userId: number;
  nickname: string;
  profileImageUrl: string;
}

/** 플레이어 오버레이 정보 */
export interface PlayerOverlayData {
  category: string;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  mainBadge: {
    type: string;
    tier: string;
  };
  abandonBadge: {
    isGranted: boolean;
    count: number;
  };
  mainPosition: string;
  address: string;
  latestProject: {
    id: number;
    title: string;
    teamStatus: string;
  };
  latestStudy: {
    id: number;
    title: string;
    teamStatus: string;
  };
  temperature: number;
  isMine: boolean;
}
